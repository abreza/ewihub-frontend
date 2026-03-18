"use client";

import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, alpha, Avatar, CircularProgress,
  TableSortLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useEmployeeControllerFindAllQuery } from "@/lib/redux/api/generatedApi";
import { toUIEmployees } from "@/data/employeeAdapter";
import { AVATAR_COLORS } from "@/constants";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import StatusChip from "@/components/atoms/StatusChip";
import PageHeader from "@/components/atoms/PageHeader";
import SearchField from "@/components/atoms/SearchField";
import PaginationBar from "@/components/molecules/PaginationBar";

export default function EmployeesPage() {
  const router = useRouter();

  const {
    searchTerm, setSearchTerm,
    page, setPage, pageSize, setPageSize,
    sortBy, sortOrder, handleSort,
  } = usePaginatedTable();

  const { data: response, isLoading } = useEmployeeControllerFindAllQuery({
    search: searchTerm || undefined,
    sortBy,
    sortOrder,
    page,
    limit: pageSize,
  });

  const employees = useMemo(
    () => (response?.data ? toUIEmployees(response.data) : []),
    [response],
  );

  const meta = response?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? page;
  const totalCount = meta?.total ?? 0;

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase();

  return (
    <Box>
      <PageHeader
        title="Employees"
        subtitle="Manage and view employee training status"
      />

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
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {totalCount}
            </Typography>{" "}
            employees
          </Typography>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search employees..."
            width={{ xs: "100%", sm: 280 }}
          />
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ overflow: "auto" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: { xs: "40%", md: "35%" } }}>
                    <TableSortLabel
                      active={sortBy === "name"}
                      direction={sortBy === "name" ? sortOrder : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Employee
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Office Ergonomics</TableCell>
                  <TableCell>Self Assessment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee, i) => (
                  <TableRow
                    key={employee.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#fafbfc" },
                      transition: "background 0.15s",
                    }}
                    onClick={() =>
                      router.push(`/employees/${employee.id}/${employee.slug}`)
                    }
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: alpha(
                              AVATAR_COLORS[i % AVATAR_COLORS.length],
                              0.1,
                            ),
                            color: AVATAR_COLORS[i % AVATAR_COLORS.length],
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
                            {employee.email}
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
                {!isLoading && employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No employees found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>
    </Box>
  );
}
