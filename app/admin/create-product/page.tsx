import { redirect } from "next/navigation"
import { Box, Container, Typography } from "@mui/material"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProductForm } from "@/components/admin/product-form"

export default async function CreateProductPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader user={user} />

      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ maxWidth: 672, mx: "auto" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 4 }}>
            Create New Product
          </Typography>
          <ProductForm userId={user.id} />
        </Box>
      </Container>
    </Box>
  )
}
