"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";
import { useMe } from "@/lib/hooks/useMe";
import { useRouter } from "next/navigation";
import { Header } from "@/components/organisms/auth/layout/Header";
import { Sidebar, DRAWER_WIDTH } from "@/components/organisms/auth/layout/Sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useMe();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress size={32} thickness={4} sx={{ color: "#2563eb" }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Loading your workspace…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header onMenuToggle={() => setMobileOpen((prev) => !prev)} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: "64px", md: "80px" },
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          maxWidth: "100%",
          overflow: "hidden",
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Fade in timeout={300}>
          <Box>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
}
