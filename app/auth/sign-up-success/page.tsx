import { Box, Container, Typography } from "@mui/material"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="xs">
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>We sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Please check your email and click the confirmation link to activate your account.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
