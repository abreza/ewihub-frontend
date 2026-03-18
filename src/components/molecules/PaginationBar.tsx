"use client";

import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getPageNumbers } from "@/utils/pagination";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalEntries?: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PaginationBar = ({
  currentPage,
  totalPages,
  totalEntries,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) => {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {/* Left: info + page-size selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
          {totalEntries !== undefined && ` · ${totalEntries} entries`}
        </Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          sx={{ height: 32, fontSize: "0.85rem", bgcolor: "background.paper" }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size} sx={{ fontSize: "0.85rem" }}>
              {size} / page
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Right: page buttons */}
      <Box sx={{ display: "flex", gap: 0.75, alignItems: "center", flexWrap: "wrap" }}>
        <Button
          size="small"
          variant="outlined"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          sx={{ minWidth: 32, px: 1 }}
        >
          <ChevronLeftIcon sx={{ fontSize: "1.1rem" }} />
        </Button>

        {pages.map((n) =>
          typeof n === "string" ? (
            <Typography
              key={n}
              variant="body2"
              color="text.secondary"
              sx={{ px: 0.5, display: "flex", alignItems: "center" }}
            >
              …
            </Typography>
          ) : (
            <Button
              key={n}
              size="small"
              variant={n === currentPage ? "contained" : "outlined"}
              onClick={() => onPageChange(n as number)}
              sx={{ minWidth: 32, px: 1 }}
            >
              {n}
            </Button>
          ),
        )}

        <Button
          size="small"
          variant="outlined"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          sx={{ minWidth: 32, px: 1 }}
        >
          <ChevronRightIcon sx={{ fontSize: "1.1rem" }} />
        </Button>
      </Box>
    </Box>
  );
};

export default PaginationBar;
