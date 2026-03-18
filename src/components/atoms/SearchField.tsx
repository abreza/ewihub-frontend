"use client";

import { TextField, InputAdornment } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: { xs?: string | number; sm?: string | number };
}

const SearchField = ({
  value,
  onChange,
  placeholder = "Search...",
  width = { xs: "100%", sm: 220 },
}: SearchFieldProps) => (
  <TextField
    size="small"
    variant="outlined"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{
      width,
      "& .MuiOutlinedInput-root": { bgcolor: "#f8fafc" },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchRoundedIcon
            sx={{ fontSize: "1.1rem", color: "text.secondary" }}
          />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchField;
