"use client";

import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, TextField, Typography, InputAdornment,
  alpha, Avatar, Select, MenuItem
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { getUIEmployees } from "@/data/employeeAdapter";

const STATUS_CONFIG: Record<string, { bg: string; color: string; border?: string }> = {
  Completed: { bg: "#dcfce7", color: "#15803d" },
  Pass: { bg: "#dcfce7", color: "#15803d" },
  "Not Taken": { bg: "#f1f5f9", color: "#64748b" },
  "In Progress": { bg: "#fff7ed", color: "#c2410c" },
  "Action Needed": { bg: "#fef3c7", color: "#b45309" },
  Assessment: { bg: "#fee2e2", color: "#b91c1c" },
};

const StatusChip = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 24,
        bgcolor: config.bg,
        color: config.color,
        border: "none",
      }}
    />
  );
};

export default function EmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const allEmployees = useMemo(() => getUIEmployees(), []);

  const filteredEmployees = useMemo(
    () =>
      allEmployees.filter((emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allEmployees, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase();

  const colors = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#dc2626"];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis-1", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis-1", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis-1", currentPage - 1, currentPage, currentPage + 1, "ellipsis-2", totalPages);
      }
    }
    return pages;
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 0.5, fontSize: { xs: "1.4rem", sm: "2.125rem" } }}>Employees</Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and view employee training status
        </Typography>
      </Box>

      <Card>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {filteredEmployees.length}
            </Typography>{" "}
            of {allEmployees.length} employees
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            sx={{
              width: { xs: "100%", sm: 280 },
              "& .MuiOutlinedInput-root": { bgcolor: "#f8fafc" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ overflow: "auto" }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: { xs: "40%", md: "35%" } }}>Employee</TableCell>
                <TableCell>Office Ergonomics</TableCell>
                <TableCell>Self Assessment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee, i) => (
                <TableRow
                  key={employee.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#fafbfc" },
                    transition: "background 0.15s",
                  }}
                  onClick={() => router.push(`/employees/${employee.id}/${employee.slug}`)}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          bgcolor: alpha(colors[i % colors.length], 0.1),
                          color: colors[i % colors.length],
                          display: { xs: "none", sm: "flex" },
                        }}
                      >
                        {getInitials(employee.name)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {employee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {employee.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={employee.officeErgonomics} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={employee.selfAssessment} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of {totalPages}
            </Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              sx={{ height: 32, fontSize: "0.85rem", bgcolor: "background.paper" }}
            >
              {[5, 10, 25, 50].map((size) => (
                <MenuItem key={size} value={size} sx={{ fontSize: "0.85rem" }}>
                  {size} / page
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, alignItems: "center", flexWrap: "wrap" }}>
            <Button
              size="small"
              variant="outlined"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ minWidth: 32, px: 1 }}
            >
              <ChevronLeftIcon sx={{ fontSize: "1.1rem" }} />
            </Button>
            {getPageNumbers().map((n) =>
              typeof n === "string" ? (
                <Typography key={n} variant="body2" color="text.secondary" sx={{ px: 0.5, display: "flex", alignItems: "center" }}>
                  …
                </Typography>
              ) : (
                <Button
                  key={n}
                  size="small"
                  variant={n === currentPage ? "contained" : "outlined"}
                  onClick={() => setPage(n as number)}
                  sx={{ minWidth: 32, px: 1 }}
                >
                  {n}
                </Button>
              )
            )}
            <Button
              size="small"
              variant="outlined"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ minWidth: 32, px: 1 }}
            >
              <ChevronRightIcon sx={{ fontSize: "1.1rem" }} />
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
