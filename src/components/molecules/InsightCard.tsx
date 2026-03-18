"use client";

import React from "react";
import { Box, Card, CardContent, Typography, alpha } from "@mui/material";

interface InsightCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const InsightCard = ({ label, value, icon, color }: InsightCardProps) => (
  <Card
    sx={{
      height: "100%",
      "&:hover": { borderColor: alpha(color, 0.2) },
      transition: "all 0.2s",
    }}
  >
    <CardContent
      sx={{ p: "14px !important", display: "flex", alignItems: "center", gap: 2 }}
    >
      <Box
        sx={{
          width: { xs: 38, sm: 44 },
          height: { xs: 38, sm: 44 },
          borderRadius: "10px",
          bgcolor: alpha(color, 0.08),
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": { fontSize: "1.3rem" },
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default InsightCard;
