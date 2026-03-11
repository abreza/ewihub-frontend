"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useMe } from "@/lib/hooks/useMe";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useMe();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={28} thickness={4} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  if (user?.role !== "superAdmin") {
    router.replace("/");
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
