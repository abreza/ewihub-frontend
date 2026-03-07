"use client";

import { useMemo, useState } from "react";
import {
  Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Button, TextField,
  alpha, InputAdornment, Select, MenuItem, CircularProgress,
} from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";
import {
  useGetCourseReportQuery,
  useGetProgramStatsQuery,
} from "@/lib/redux/api/employeeApi";
import { toOEReportRow, toUIProgramStats, nameToSlug, type OEReportRow } from "@/data/employeeAdapter";

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "#dcfce7", color: "#15803d" },
  "In Progress": { bg: "#fff7ed", color: "#c2410c" },
  "Not Taken": { bg: "#f1f5f9", color: "#64748b" },
};

const FILTER_STATUS_MAP: Record<string, string | undefined> = {
  All: undefined,
  Completed: "completed",
  "In Progress": "pending",
};

const DonutChart = ({ completed, inProgress }: { completed: number; inProgress: number }) => {
  const total = completed + inProgress;
  const compPct = total > 0 ? (completed / total) * 100 : 0;
  const inPPct = total > 0 ? (inProgress / total) * 100 : 0;
  const radius = 15.9155;

  return (
    <Box sx={{ position: "relative", width: { xs: 180, sm: 240 }, height: { xs: 180, sm: 240 }, margin: "0 auto" }}>
      <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#16a34a" strokeWidth="3.5"
          strokeDasharray={`${compPct} ${100 - compPct}`} strokeLinecap="round" />
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#f97316" strokeWidth="3.5"
          strokeDasharray={`${inPPct} ${100 - inPPct}`} strokeDashoffset={`${-compPct}`}
          strokeLinecap="round" />
      </svg>
      <Box sx={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
          {Math.round(compPct)}%
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
          Completed
        </Typography>
      </Box>
    </Box>
  );
};

export default function OfficeErgonomicsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"All" | "Completed" | "In Progress">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: rawStats } = useGetProgramStatsQuery();
  const stats = useMemo(() => (rawStats ? toUIProgramStats(rawStats) : null), [rawStats]);

  const { data: reportResponse, isLoading: isLoadingReport } = useGetCourseReportQuery({
    course: "Office Ergonomics",
    search: searchTerm || undefined,
    status: FILTER_STATUS_MAP[activeFilter],
    page,
    limit: pageSize,
  });

  const rows: OEReportRow[] = useMemo(
    () => (reportResponse?.data ? reportResponse.data.map(toOEReportRow) : []),
    [reportResponse]
  );

  const meta = reportResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? page;
  const totalEntries = meta?.total ?? 0;

  const insights = stats
    ? [
      { label: "Total Enrolled", value: String(stats.oe.enrolled), icon: <PeopleRoundedIcon />, color: "#2563eb", bg: alpha("#2563eb", 0.08) },
      { label: "In Progress", value: String(stats.oe.inProgress), icon: <TrendingUpRoundedIcon />, color: "#ea580c", bg: alpha("#ea580c", 0.08) },
      { label: "Completed", value: String(stats.oe.completed), icon: <CheckCircleRoundedIcon />, color: "#16a34a", bg: alpha("#16a34a", 0.08) },
      { label: "Avg. Days", value: "1", icon: <TimerRoundedIcon />, color: "#7c3aed", bg: alpha("#7c3aed", 0.08) },
    ]
    : [];

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
        <Typography variant="h4" sx={{ mb: 0.5, fontSize: { xs: "1.4rem", sm: "2.125rem" } }}>Office Ergonomics</Typography>
        <Typography variant="body1" color="text.secondary">
          Training completion and enrollment overview
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Result Summary</Typography>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: { xs: 220, md: 280 } }}>
                {stats ? (
                  <Box>
                    <DonutChart completed={stats.oe.completed} inProgress={stats.oe.inProgress} />
                    <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 2, sm: 3 }, mt: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#16a34a" }} />
                        <Typography variant="body2" color="text.secondary">Completed ({stats.oe.completed})</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f97316" }} />
                        <Typography variant="body2" color="text.secondary">In Progress ({stats.oe.inProgress})</Typography>
                      </Box>
                    </Box>
                  </Box>
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
                <Card sx={{ height: "100%", "&:hover": { borderColor: alpha(item.color, 0.2) }, transition: "all 0.2s" }}>
                  <CardContent sx={{ p: "14px !important", display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{
                      width: { xs: 38, sm: 44 }, height: { xs: 38, sm: 44 }, borderRadius: "10px",
                      bgcolor: item.bg, color: item.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      "& svg": { fontSize: "1.3rem" },
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="h6" sx={{ lineHeight: 1.1 }}>{item.value}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <Box sx={{
              p: 2, display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 1.5,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                {(["All", "Completed", "In Progress"] as const).map((f) => (
                  <Button key={f} size="small" variant="contained"
                    onClick={() => { setActiveFilter(f); setPage(1); }}
                    sx={{
                      bgcolor: activeFilter === f ? "primary.main" : alpha("#64748b", 0.08),
                      color: activeFilter === f ? "white" : "text.secondary",
                      "&:hover": { bgcolor: activeFilter === f ? "primary.dark" : alpha("#64748b", 0.12) },
                    }}
                  >
                    {f}
                  </Button>
                ))}
              </Box>
              <TextField
                size="small" placeholder="Search..." variant="outlined" sx={{ width: { xs: "100%", sm: 220 } }}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: "1rem", color: "text.secondary" }} /></InputAdornment> }}
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
                      <TableCell>Name</TableCell>
                      <TableCell>Started</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const config = STATUS_CONFIG[row.status] || { bg: "#f1f5f9", color: "#64748b" };
                      return (
                        <TableRow key={row.id} hover sx={{ cursor: "pointer" }}
                          onClick={() => router.push(`/employees/${row.id}/${nameToSlug(row.name)}`)}
                        >
                          <TableCell sx={{ color: "primary.main", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
                            {row.name}
                          </TableCell>
                          <TableCell>{row.start}</TableCell>
                          <TableCell>{row.end}</TableCell>
                          <TableCell>
                            <Chip label={row.status} size="small"
                              sx={{ borderRadius: "6px", fontWeight: 600, fontSize: "0.7rem", bgcolor: config.bg, color: config.color }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!isLoadingReport && rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">No data found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>

            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="body2" color="text.secondary">
                  Page {currentPage} of {totalPages} · {totalEntries} entries
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

              <Box sx={{ display: "flex", gap: 0.75 }}>
                <Button size="small" variant="outlined" disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  sx={{ minWidth: 32, px: 1 }}>
                  <ChevronLeftIcon sx={{ fontSize: "1.1rem" }} />
                </Button>
                {getPageNumbers().map((n) =>
                  typeof n === "string" ? (
                    <Typography key={n} variant="body2" color="text.secondary" sx={{ px: 0.5, display: "flex", alignItems: "center" }}>
                      …
                    </Typography>
                  ) : (
                    <Button key={n} size="small" variant={n === currentPage ? "contained" : "outlined"}
                      onClick={() => setPage(n as number)}
                      sx={{ minWidth: 32, px: 1 }}>{n}</Button>
                  )
                )}
                <Button size="small" variant="outlined" disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  sx={{ minWidth: 32, px: 1 }}>
                  <ChevronRightIcon sx={{ fontSize: "1.1rem" }} />
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
