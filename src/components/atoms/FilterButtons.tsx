"use client";

import { Box, Button, alpha } from "@mui/material";

interface FilterButtonsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

const FilterButtons = ({
  options,
  active,
  onChange,
  compact = false,
}: FilterButtonsProps) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
    {options.map((opt) => (
      <Button
        key={opt}
        size="small"
        variant="contained"
        onClick={() => onChange(opt)}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          bgcolor:
            active === opt ? "primary.main" : alpha("#64748b", 0.08),
          color: active === opt ? "white" : "text.secondary",
          "&:hover": {
            bgcolor:
              active === opt
                ? "primary.dark"
                : alpha("#64748b", 0.12),
          },
          ...(compact && {
            fontSize: { xs: "0.7rem", sm: "0.825rem" },
            px: { xs: 1, sm: 2 },
          }),
        }}
      >
        {opt}
      </Button>
    ))}
  </Box>
);

export default FilterButtons;
