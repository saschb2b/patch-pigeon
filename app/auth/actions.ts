"use server"

import { redirect } from "next/navigation"
import { eq, and, gt } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { createHash, randomBytes } from "node:crypto"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"
import { users, profiles, passwordResetTokens } from "@/lib/db/schema"
import { sendPasswordResetEmail } from "@/lib/email"
import { generateSlug } from "@/lib/utils/slug"
import { getSiteUrl } from "@/lib/site-url"
import { getProfile, requireUser } from "@/lib/auth-helpers"

const PASSWORD_HASH_ROUNDS = 12

const RESERVED_SLUGS = [
  "admin",
  "auth",
  "api",
  "settings",
  "profile",
  "onboarding",
  "help",
  "support",
  "about",
  "pricing",
  "blog",
  "docs",
  "demo",
  "next",
  "robots",
  "sitemap",
  "favicon",
]

export type ActionState = { error?: string; success?: string }

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  })

export async function signUpAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { email, password } = parsed.data
  const normalizedEmail = email.toLowerCase()

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1)

  if (existing) {
    return { error: "An account with this email already exists" }
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS)
  try {
    await db.insert(users).values({ email: normalizedEmail, passwordHash })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("users_email_unique")) {
      return { error: "An account with this email already exists" }
    }
    return { error: "Unable to create account. Please try again." }
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })
  } catch (error) {
    console.error("Auto sign-in after signup failed:", error)
    return { error: "Account created. Please sign in." }
  }

  redirect("/auth/onboarding")
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Invalid email or password" }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { error: "Invalid email or password" }
    }
    return { error: "Sign in failed. Please try again." }
  }

  redirect("/admin")
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function forgotPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { error: "Please enter a valid email address" }
  }

  const normalizedEmail = parsed.data.email.toLowerCase()
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1)

  if (user) {
    const token = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(token).digest("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await db
      .insert(passwordResetTokens)
      .values({
        token_hash: tokenHash,
        user_id: user.id,
        expires,
      })
      .onConflictDoUpdate({
        target: passwordResetTokens.user_id,
        set: { token_hash: tokenHash, expires },
      })

    const resetUrl = `${getSiteUrl()}/auth/reset-password?token=${token}`

    try {
      await sendPasswordResetEmail(normalizedEmail, resetUrl)
    } catch (error) {
      console.error("Failed to send password reset email:", error)
    }
  }

  return { success: "If an account exists for that email, a reset link is on the way." }
}

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function resetPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex")
  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token_hash, tokenHash),
        gt(passwordResetTokens.expires, new Date()),
      ),
    )
    .limit(1)

  if (!record) {
    return { error: "This reset link is invalid or has expired." }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, PASSWORD_HASH_ROUNDS)
  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash }).where(eq(users.id, record.user_id))
    await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.user_id, record.user_id))
  })

  return { success: "Password updated. You can now sign in with your new password." }
}

const onboardingSchema = z.object({
  ownerSlug: z.string().min(1).max(64),
  displayName: z.string().max(120).optional(),
})

export async function onboardingAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = onboardingSchema.safeParse({
    ownerSlug: formData.get("ownerSlug"),
    displayName: formData.get("displayName") || undefined,
  })

  if (!parsed.success) {
    return { error: "Please choose a valid handle" }
  }

  const slug = generateSlug(parsed.data.ownerSlug)
  if (!slug) return { error: "Please choose a valid handle" }
  if (RESERVED_SLUGS.includes(slug)) return { error: "This handle is reserved" }

  const user = await requireUser()
  const existingProfile = await getProfile(user.id)
  if (existingProfile) redirect("/admin")

  const [taken] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.owner_slug, slug))
    .limit(1)

  if (taken) {
    return { error: "This handle is already taken" }
  }

  await db.insert(profiles).values({
    id: user.id,
    owner_slug: slug,
    display_name: parsed.data.displayName ?? null,
  })

  redirect("/admin")
}

export async function checkSlugAvailability(slug: string): Promise<{ available: boolean }> {
  const normalized = generateSlug(slug)
  if (!normalized || RESERVED_SLUGS.includes(normalized)) {
    return { available: false }
  }

  const [existing] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.owner_slug, normalized))
    .limit(1)

  return { available: !existing }
}
