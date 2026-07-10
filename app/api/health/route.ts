import { sql } from "drizzle-orm"
import { db, isDatabaseConfigured } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isDatabaseConfigured) {
    return Response.json(
      { status: "unhealthy", database: "not configured" },
      { status: 503 },
    )
  }

  try {
    await db.execute(sql`select 1`)
    return Response.json({ status: "healthy" })
  } catch {
    return Response.json(
      { status: "unhealthy", database: "unavailable" },
      { status: 503 },
    )
  }
}
