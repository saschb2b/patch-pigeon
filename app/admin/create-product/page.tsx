import { Box, Container, Typography } from "@mui/material"
import { requireUserAndProfile } from "@/lib/auth-helpers"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"
import { ProductForm } from "@/components/admin/product-form"

export default async function CreateProductPage() {
  const { user } = await requireUserAndProfile()

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <AdminHeader user={user} />

      <Container component="main" maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ maxWidth: 672, mx: "auto" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 4 }}>
            Create New Product
          </Typography>
          <ProductForm />
        </Box>
      </Container>

      <AdminFooter />
    </Box>
  )
}
