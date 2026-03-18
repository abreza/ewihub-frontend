"use client";

import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopy";
import { copyToClipboard } from "@/utils/clipboard";

interface ApiKeyDisplayProps {
  apiKey: string;
  variant?: "inline" | "block";
}

const ApiKeyDisplay = ({ apiKey, variant = "inline" }: ApiKeyDisplayProps) => {
  if (variant === "block") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1.5,
          bgcolor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {apiKey}
        </Typography>
        <Tooltip title="Copy">
          <IconButton size="small" onClick={() => copyToClipboard(apiKey)}>
            <ContentCopyRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          bgcolor: "#f1f5f9",
          px: 1,
          py: 0.25,
          borderRadius: "4px",
          maxWidth: 140,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {apiKey}
      </Typography>
      <Tooltip title="Copy API key">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(apiKey);
          }}
        >
          <ContentCopyRoundedIcon sx={{ fontSize: "0.9rem" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ApiKeyDisplay;
