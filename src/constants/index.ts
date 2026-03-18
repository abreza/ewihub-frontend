import React from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export const COURSE_OPTIONS = ["Office Ergonomics", "Self Assessment"] as const;

export interface StatusStyle {
  bg: string;
  color: string;
  icon?: React.ReactNode;
}

export const STATUS_CONFIG: Record<string, StatusStyle> = {
  Completed: {
    bg: "#dcfce7",
    color: "#15803d",
    icon: React.createElement(CheckCircleRoundedIcon, { sx: { fontSize: 14 } }),
  },
  Pass: {
    bg: "#dcfce7",
    color: "#15803d",
    icon: React.createElement(CheckCircleRoundedIcon, { sx: { fontSize: 14 } }),
  },
  "Not Taken": { bg: "#f1f5f9", color: "#64748b" },
  "In Progress": { bg: "#fff7ed", color: "#c2410c" },
  "Action Needed": {
    bg: "#fef3c7",
    color: "#b45309",
    icon: React.createElement(WarningAmberRoundedIcon, { sx: { fontSize: 14 } }),
  },
  Assessment: {
    bg: "#fee2e2",
    color: "#b91c1c",
    icon: React.createElement(WarningAmberRoundedIcon, { sx: { fontSize: 14 } }),
  },
};

export const DEFAULT_STATUS_STYLE: StatusStyle = {
  bg: "#f1f5f9",
  color: "#64748b",
};

export const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0891b2",
  "#059669",
  "#dc2626",
  "#ea580c",
];
