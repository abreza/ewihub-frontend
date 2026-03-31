"use client";

import { useState } from "react";
import { Select, MenuItem, Box, alpha, CircularProgress } from "@mui/material";
import { FOLLOW_UP_STATUS_COLORS } from "@/constants";
import { useEmployeeControllerUpdateMutation } from "@/lib/redux/api/generatedApi";

interface FollowUpStatusSelectProps {
  employeeId: string;
  currentStatus: string | null;
  options: string[];
}

export default function FollowUpStatusSelect({
  employeeId,
  currentStatus,
  options,
}: FollowUpStatusSelectProps) {
  const [updateEmployee, { isLoading }] = useEmployeeControllerUpdateMutation();
  const [localStatus, setLocalStatus] = useState(currentStatus || "Not Assigned");

  const handleChange = async (newStatus: string) => {
    setLocalStatus(newStatus);
    try {
      await updateEmployee({
        id: employeeId,
        updateEmployeeDto: { followUpStatus: newStatus },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update follow-up status:", err);
      // Revert on error
      setLocalStatus(currentStatus || "Not Assigned");
    }
  };

  const currentColors = FOLLOW_UP_STATUS_COLORS[localStatus] || {
    bg: "#f1f5f9",
    color: "#64748b",
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Select
        value={localStatus}
        onChange={(e) => handleChange(e.target.value)}
        size="small"
        disabled={isLoading}
        sx={{
          minWidth: 140,
          borderRadius: "6px",
          bgcolor: currentColors.bg,
          color: currentColors.color,
          fontWeight: 600,
          fontSize: "0.75rem",
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSelect-select": { py: 0.5, px: 1.5 },
          "&:hover": { bgcolor: alpha(currentColors.bg, 0.8) },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt} sx={{ fontSize: "0.85rem" }}>
            {opt}
          </MenuItem>
        ))}
      </Select>
      {isLoading && <CircularProgress size={16} />}
    </Box>
  );
}
