"use client";

import { useState } from "react";
import { Select, MenuItem, CircularProgress } from "@mui/material";
import { FOLLOW_UP_STATUS_COLORS } from "@/constants";
import { useEmployeeControllerUpdateTrainingMutation } from "@/lib/redux/api/generatedApi";

interface FollowUpStatusSelectProps {
  employeeId: string;
  trainingId: string | null;
  currentStatus: string | null;
  options: string[];
  disabled?: boolean;
}

const FollowUpStatusSelect = ({
  employeeId,
  trainingId,
  currentStatus,
  options,
  disabled = false,
}: FollowUpStatusSelectProps) => {
  const [updateTraining, { isLoading }] =
    useEmployeeControllerUpdateTrainingMutation();
  const [value, setValue] = useState(currentStatus || "Not Assigned");

  const handleChange = async (newStatus: string) => {
    if (!trainingId) return;
    setValue(newStatus);
    try {
      await updateTraining({
        id: employeeId,
        trainingId,
        updateTrainingDto: { followUpStatus: newStatus },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update follow-up status:", err);
      setValue(currentStatus || "Not Assigned");
    }
  };

  const colors = FOLLOW_UP_STATUS_COLORS[value] || {
    bg: "#f1f5f9",
    color: "#64748b",
  };

  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={disabled || isLoading || !trainingId}
      onClick={(e) => e.stopPropagation()}
      sx={{
        height: 28,
        fontSize: "0.7rem",
        fontWeight: 600,
        borderRadius: "6px",
        bgcolor: colors.bg,
        color: colors.color,
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiSelect-icon": { color: colors.color },
        minWidth: 130,
      }}
      renderValue={(val) =>
        isLoading ? <CircularProgress size={14} /> : val
      }
    >
      {options.map((opt) => {
        const optColors = FOLLOW_UP_STATUS_COLORS[opt] || {
          bg: "#f1f5f9",
          color: "#64748b",
        };
        return (
          <MenuItem key={opt} value={opt} sx={{ fontSize: "0.8rem" }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: optColors.color,
                marginRight: 8,
              }}
            />
            {opt}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default FollowUpStatusSelect;
