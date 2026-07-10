"use client"

import { Box, Container, Paper, Stack, Typography } from "@mui/material"
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined"
import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: 10 }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Stack spacing={2} sx={{
          alignItems: "center"
        }}>
          <ErrorOutlinedIcon color="error" sx={{ fontSize: 48 }} />
          <Box>
            <Typography component="h1" variant="h5" sx={{
              fontWeight: 700
            }}>
              Something went wrong
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                mt: 1
              }}>
              The request could not be completed. Try again, or check the server logs if the problem continues.
            </Typography>
          </Box>
          <Button onClick={reset}>Try again</Button>
        </Stack>
      </Paper>
    </Container>
  );
}
