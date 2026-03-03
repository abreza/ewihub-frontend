"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <Box sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    py: 1.25,
    borderBottom: "1px solid",
    borderColor: "divider",
    "&:last-child": { borderBottom: 0 },
  }}>
    <Box sx={{ width: { xs: "auto", sm: 130 }, flexShrink: 0, display: "flex", alignItems: "flex-start", gap: 0.75, mb: { xs: 0.25, sm: 0 } }}>
      {icon && <Box sx={{ color: "text.secondary", mt: 0.1, "& svg": { fontSize: "0.95rem" } }}>{icon}</Box>}
      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>{label}</Typography>
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{value}</Typography>
    </Box>
  </Box>
);

export default DetailRow;
