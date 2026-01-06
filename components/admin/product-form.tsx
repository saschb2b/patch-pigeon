"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Box, Stack, Typography, Alert } from "@mui/material"
import { generateSlug } from "@/lib/utils/slug"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  userId: string
  product?: Product
}

export function ProductForm({ userId, product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(product?.name || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [description, setDescription] = useState(product?.description || "")
  const [logoUrl, setLogoUrl] = useState(product?.logo_url || "")

  const handleNameChange = (value: string) => {
    setName(value)
    if (!product) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (product) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name,
            slug,
            description: description || null,
            logo_url: logoUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id)

        if (error) throw error
        router.push(`/admin/products/${product.id}`)
      } else {
        // Create new product
        const { data, error } = await supabase
          .from("products")
          .insert({
            user_id: userId,
            name,
            slug,
            description: description || null,
            logo_url: logoUrl || null,
          })
          .select()
          .single()

        if (error) throw error
        router.push(`/admin/products/${data.id}`)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Awesome App"
                required
              />
            </Box>

            <Box>
              <Label htmlFor="slug">URL Slug</Label>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography color="text.secondary">/</Typography>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="my-awesome-app"
                  required
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                This will be your public changelog URL
              </Typography>
            </Box>

            <Box>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your product"
                rows={3}
              />
            </Box>

            <Box>
              <Label htmlFor="logoUrl">Logo URL (optional)</Label>
              <Input
                id="logoUrl"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button type="submit" disabled={isLoading} fullWidth sx={{ width: { sm: "auto" } }}>
                {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} fullWidth sx={{ width: { sm: "auto" } }}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
