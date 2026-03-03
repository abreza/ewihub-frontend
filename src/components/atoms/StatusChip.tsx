"use client";

import React from "react";
import { Box, Chip } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export const STATUS_CONFIG: Record<string, { bg: string; color: string; icon?: React.ReactNode }> = {
  Completed: { bg: "#dcfce7", color: "#15803d", icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} /> },
  Pass: { bg: "#dcfce7", color: "#15803d", icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} /> },
  "Not Taken": { bg: "#f1f5f9", color: "#64748b" },
  "In Progress": { bg: "#fff7ed", color: "#c2410c" },
  "Action Needed": { bg: "#fef3c7", color: "#b45309", icon: <WarningAmberRoundedIcon sx={{ fontSize: 14 }} /> },
  Assessment: { bg: "#fee2e2", color: "#b91c1c", icon: <WarningAmberRoundedIcon sx={{ fontSize: 14 }} /> },
};

const StatusChip = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <Chip
      icon={config.icon ? <Box sx={{ color: "inherit !important", display: "flex" }}>{config.icon}</Box> : undefined}
      label={status}
      size="small"
      sx={{
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 24,
        bgcolor: config.bg,
        color: config.color,
        "& .MuiChip-icon": { color: "inherit", ml: 0.5 },
      }}
    />
  );
};

export default StatusChip;
