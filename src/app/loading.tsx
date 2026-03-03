"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        gap: 2.5,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1, transform: "scale(1)" },
            "50%": { opacity: 0.7, transform: "scale(0.95)" },
          },
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.85rem" }}>ewi</Typography>
      </Box>
      <CircularProgress size={28} thickness={4} sx={{ color: "#2563eb" }} />
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        Loading…
      </Typography>
    </Box>
  );
}
