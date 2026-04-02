"use client";

import { useMemo, useState } from "react";
import {
  Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, TableSortLabel,
} from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useRouter } from "next/navigation";
import {
  useEmployeeControllerGetCourseReportQuery,
  useEmployeeControllerGetStatsQuery,
} from "@/lib/redux/api/generatedApi";
import { STATUS_CONFIG, DEFAULT_STATUS_STYLE } from "@/constants";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import PageHeader from "@/components/atoms/PageHeader";
import FilterButtons from "@/components/atoms/FilterButtons";
import SearchField from "@/components/atoms/SearchField";
import InsightCard from "@/components/molecules/InsightCard";
import PaginationBar from "@/components/molecules/PaginationBar";
import DonutChart from "@/components/organisms/DonutChart";

const FILTER_OPTIONS = ["All", "Completed", "In Progress"] as const;
const FILTER_STATUS_MAP: Record<string, string | undefined> = {
  All: undefined,
  Completed: "completed",
  "In Progress": "pending",
};

export default function OfficeErgonomicsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const {
    searchTerm, setSearchTerm,
    page, setPage, pageSize, setPageSize,
    sortBy, sortOrder, handleSort,
  } = usePaginatedTable();

  const { data: rawStats } = useEmployeeControllerGetStatsQuery();

  const stats = useMemo(() => {
    if (!rawStats) return null;
    const oe = rawStats.courses.find(c => c.course === "Office Ergonomics");
    return {
      enrolled: oe?.enrolled || 0,
      completed: oe?.completed || 0,
      inProgress: oe?.inProgress || 0,
    };
  }, [rawStats]);

  const { data: reportResponse, isLoading: isLoadingReport } =
    useEmployeeControllerGetCourseReportQuery({
      course: "Office Ergonomics",
      search: searchTerm || undefined,
      status: FILTER_STATUS_MAP[activeFilter],
      sortBy,
      sortOrder,
      page,
      limit: pageSize,
    });

  const rows = useMemo(() => {
    if (!reportResponse?.data) return [];
    return reportResponse.data.map((row) => {
      let uiStatus = "Not Taken";
      if (row.status === "completed") uiStatus = "Completed";
      else if (row.status === "pending" || row.status === "started") uiStatus = "In Progress";

      return {
        ...row,
        slug: row.name.toLowerCase().replace(/\s+/g, "-"),
        uiStatus,
        start: row.startedDate || "-",
        end: row.completedDate || "-",
      };
    });
  }, [reportResponse]);

  const meta = reportResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? page;
  const totalEntries = meta?.total ?? 0;

  const insights = stats
    ? [
      { label: "Total Enrolled", value: String(stats.enrolled), icon: <PeopleRoundedIcon />, color: "#2563eb" },
      { label: "In Progress", value: String(stats.inProgress), icon: <TrendingUpRoundedIcon />, color: "#ea580c" },
      { label: "Completed", value: String(stats.completed), icon: <CheckCircleRoundedIcon />, color: "#16a34a" },
      { label: "Avg. Days", value: "1", icon: <TimerRoundedIcon />, color: "#7c3aed" },
    ]
    : [];

  const donutSegments = stats
    ? [
      { value: stats.completed, color: "#16a34a", label: "Completed" },
      { value: stats.inProgress, color: "#f97316", label: "In Progress" },
    ]
    : [];

  const completionPct = stats
    ? stats.enrolled > 0
      ? Math.round((stats.completed / (stats.completed + stats.inProgress)) * 100)
      : 0
    : 0;

  return (
    <Box>
      <PageHeader
        title="Office Ergonomics"
        subtitle="Training completion and enrollment overview"
      />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Result Summary
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: 220, md: 280 },
                }}
              >
                {stats ? (
                  <DonutChart
                    segments={donutSegments}
                    centerValue={`${completionPct}%`}
                    centerLabel="Completed"
                  />
                ) : (
                  <CircularProgress size={28} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={1.5} sx={{ height: "100%" }}>
            {insights.map((item, i) => (
              <Grid size={{ xs: 6, md: 12 }} key={i}>
                <InsightCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <FilterButtons
                options={[...FILTER_OPTIONS]}
                active={activeFilter}
                onChange={(f) => {
                  setActiveFilter(f);
                  setPage(1);
                }}
              />
              <SearchField
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ overflow: "auto" }}>
              {isLoadingReport ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <Table size="small" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "name"}
                          direction={sortBy === "name" ? sortOrder : "asc"}
                          onClick={() => handleSort("name")}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "createdAt"}
                          direction={sortBy === "createdAt" ? sortOrder : "desc"}
                          onClick={() => handleSort("createdAt")}
                        >
                          Started
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "updatedAt"}
                          direction={sortBy === "updatedAt" ? sortOrder : "desc"}
                          onClick={() => handleSort("updatedAt")}
                        >
                          Completed
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const config = STATUS_CONFIG[row.uiStatus] || DEFAULT_STATUS_STYLE;
                      return (
                        <TableRow
                          key={row.employeeId}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            router.push(`/employees/${row.employeeId}/${row.slug}`)
                          }
                        >
                          <TableCell
                            sx={{
                              color: "primary.main",
                              fontWeight: 600,
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell>{row.start}</TableCell>
                          <TableCell>{row.end}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.uiStatus}
                              size="small"
                              sx={{
                                borderRadius: "6px",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                bgcolor: config.bg,
                                color: config.color,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!isLoadingReport && rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No data found
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
              totalEntries={totalEntries}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
