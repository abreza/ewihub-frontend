"use client";

import { Box, Container } from "@mui/material";
import { SignupForm } from "@/components/organisms/auth/SignupForm";

export default function SignupPage() {
  return (
    <Box>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <SignupForm />
      </Container>
    </Box>
  );
}
