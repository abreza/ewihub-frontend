// src/app/(pages)/(priavte)/reports/self-assessment/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Tooltip,
  CircularProgress, TableSortLabel,
} from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/navigation";
import {
  useEmployeeControllerGetCourseReportQuery,
  useEmployeeControllerGetStatsQuery,
  useEmployeeControllerGetBodyAggregationQuery,
  useEmployeeControllerGetChartAggregationQuery,
  useOrganizationControllerFindOneQuery,
} from "@/lib/redux/api/generatedApi";
import { toSAReportRow, toUIProgramStats, nameToSlug, type SAReportRow } from "@/data/employeeAdapter";
import { STATUS_CONFIG, DEFAULT_STATUS_STYLE } from "@/constants";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import PageHeader from "@/components/atoms/PageHeader";
import FilterButtons from "@/components/atoms/FilterButtons";
import SearchField from "@/components/atoms/SearchField";
import InsightCard from "@/components/molecules/InsightCard";
import PaginationBar from "@/components/molecules/PaginationBar";
import TabbedDonutChart, { ChartTab } from "@/components/organisms/TabbedDonutChart";
import BodyDiagram from "@/components/organisms/bodyDiagram/BodyDiagram";
import FollowUpStatusSelect from "@/components/molecules/FollowUpStatusSelect";
import { useMe } from "@/lib/hooks/useMe";

const FILTER_OPTIONS = ["All", "Pass", "Action Needed", "Assessment", "In Progress"];
const FILTER_STATUS_MAP: Record<string, string | undefined> = {
  All: undefined,
  Pass: "pass",
  "Action Needed": "action",
  Assessment: "assessment",
  "In Progress": "pending",
};

const CHART_COLORS = [
  "#f56954", "#00a65a", "#f39c12", "#00c0ef", "#3c8dbc",
  "#d2d6de", "#605ca8", "#ff851b", "#39cccc", "#001f3f",
  "#D81B60", "#e83e8c",
];

function truncateLabel(label: string, maxLen = 50): string {
  if (label.length <= maxLen) return label;
  return label.substring(0, maxLen - 3) + "...";
}

function processChartData(
  data: Record<string, number>,
  maxItems = 5,
): { labels: string[]; values: number[]; colors: string[] } {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const labels: string[] = [];
  const values: number[] = [];
  let otherCount = 0;

  entries.forEach(([key, val], i) => {
    if (i < maxItems) {
      labels.push(truncateLabel(key));
      values.push(val);
    } else {
      otherCount += val;
    }
  });

  if (otherCount > 0) {
    labels.push("Other");
    values.push(otherCount);
  }

  const colors = CHART_COLORS.slice(0, labels.length);
  return { labels, values, colors };
}

function recordToSegments(
  data: Record<string, number>,
  maxItems = 5,
): { value: number; color: string; label: string }[] {
  const { labels, values, colors } = processChartData(data, maxItems);
  return labels.map((label, i) => ({
    label,
    value: values[i],
    color: colors[i],
  }));
}

export default function SelfAssessmentPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [discomfortView, setDiscomfortView] = useState<"count" | "average">("count");

  const {
    searchTerm, setSearchTerm,
    page, setPage, pageSize, setPageSize,
    sortBy, sortOrder, handleSort,
  } = usePaginatedTable();

  const { data: rawStats } = useEmployeeControllerGetStatsQuery();
  const stats = useMemo(() => (rawStats ? toUIProgramStats(rawStats) : null), [rawStats]);

  const { data: reportResponse, isLoading: isLoadingReport } =
    useEmployeeControllerGetCourseReportQuery({
      course: "Self Assessment",
      search: searchTerm || undefined,
      status: FILTER_STATUS_MAP[activeFilter],
      sortBy,
      sortOrder,
      page,
      limit: pageSize,
    });

  const rows: SAReportRow[] = useMemo(
    () => (reportResponse?.data ? reportResponse.data.map(toSAReportRow) : []),
    [reportResponse],
  );

  const { data: discomfortData } = useEmployeeControllerGetBodyAggregationQuery({
    course: "Self Assessment",
    dataPath: "bodyPartsDiscomfort",
  });

  const { data: chartAggData, isLoading: isLoadingChartAgg } =
    useEmployeeControllerGetChartAggregationQuery({
      course: "Self Assessment",
    });

  const { user } = useMe();
  const { data: org } = useOrganizationControllerFindOneQuery(
    { id: user?.organization || "" },
    { skip: !user?.organization },
  );

  const meta = reportResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? page;
  const totalEntries = meta?.total ?? 0;

  const insights = stats
    ? [
      { label: "Total Enrolled", value: String(stats.sa.enrolled), icon: <PeopleRoundedIcon />, color: "#2563eb" },
      { label: "Pass", value: String(stats.sa.pass), icon: <CheckCircleRoundedIcon />, color: "#16a34a" },
      { label: "Action Needed", value: String(stats.sa.action), icon: <TrendingUpRoundedIcon />, color: "#ea580c" },
      { label: "Assessment", value: String(stats.sa.assessment), icon: <WarningAmberRoundedIcon />, color: "#dc2626" },
    ]
    : [];

  const resultSegments = useMemo(
    () => stats
      ? [
        { value: stats.sa.pass, color: "#6AB187", label: "Pass" },
        { value: stats.sa.action, color: "#DBAE58", label: "Action Needed" },
        { value: stats.sa.assessment, color: "#AC3E31", label: "Assessment" },
      ]
      : [],
    [stats],
  );

  const totalResult = resultSegments.reduce((sum, s) => sum + s.value, 0);
  const passPct = totalResult > 0
    ? Math.round((resultSegments[0]?.value / totalResult) * 100)
    : 0;

  const issuesSegments = useMemo(
    () => (chartAggData?.issues ? recordToSegments(chartAggData.issues, 5) : []),
    [chartAggData],
  );
  const issuesTotal = issuesSegments.reduce((sum, s) => sum + s.value, 0);

  const actionsSegments = useMemo(
    () => (chartAggData?.actions ? recordToSegments(chartAggData.actions, 5) : []),
    [chartAggData],
  );
  const actionsTotal = actionsSegments.reduce((sum, s) => sum + s.value, 0);

  const equipmentSegments = useMemo(
    () => (chartAggData?.equipment ? recordToSegments(chartAggData.equipment, 5) : []),
    [chartAggData],
  );
  const equipmentTotal = equipmentSegments.reduce((sum, s) => sum + s.value, 0);

  const chartTabs: ChartTab[] = useMemo(() => {
    const tabs: ChartTab[] = [
      {
        key: "result",
        label: "Result",
        segments: resultSegments,
        centerValue: `${passPct}%`,
        centerLabel: "Pass Rate",
        isLoading: !stats,
      },
      {
        key: "issues",
        label: "Issues",
        segments: issuesSegments,
        centerValue: String(issuesTotal),
        centerLabel: "Total Issues",
        isLoading: isLoadingChartAgg,
      },
      {
        key: "actions",
        label: "Actions",
        segments: actionsSegments,
        centerValue: String(actionsTotal),
        centerLabel: "Total Actions",
        isLoading: isLoadingChartAgg,
      },
      {
        key: "equipment",
        label: "Equipment",
        segments: equipmentSegments,
        centerValue: String(equipmentTotal),
        centerLabel: "Total Needs",
        isLoading: isLoadingChartAgg,
      },
    ];
    return tabs;
  }, [
    stats, resultSegments, passPct,
    issuesSegments, issuesTotal,
    actionsSegments, actionsTotal,
    equipmentSegments, equipmentTotal,
    isLoadingChartAgg,
  ]);

  const bodyData = useMemo(() => {
    if (!discomfortData) return {} as Record<string, number>;
    return (discomfortView === "count" ? discomfortData.countData : discomfortData.avgData) as Record<string, number>;
  }, [discomfortData, discomfortView]);

  return (
    <Box>
      <PageHeader
        title="Self Assessment"
        subtitle="Employee self-assessment results and status overview"
      />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <TabbedDonutChart
                title="Result Summary"
                tabs={chartTabs}
                defaultTab="result"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
                    Discomfort Summary
                  </Typography>
                  <Tooltip title="Aggregated from the latest self-assessment for all employees" arrow placement="right">
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", cursor: "help" }} />
                  </Tooltip>
                </Box>
                <FilterButtons
                  options={["count", "average"]}
                  active={discomfortView}
                  onChange={(v) => setDiscomfortView(v as "count" | "average")}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {discomfortData ? (
                  <BodyDiagram
                    data={bodyData}
                    resultLabel={discomfortView === "count" ? "COUNT" : "AVG"}
                    variant="full"
                  />
                ) : (
                  <CircularProgress size={28} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
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
            <Box sx={{
              p: 2, display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 1.5,
            }}>
              <FilterButtons
                options={FILTER_OPTIONS}
                active={activeFilter}
                onChange={(f) => { setActiveFilter(f); setPage(1); }}
                compact
              />
              <SearchField value={searchTerm} onChange={setSearchTerm} />
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ overflow: "auto" }}>
              {isLoadingReport ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <Table size="small" sx={{ minWidth: 580 }}>
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
                      <TableCell>Status</TableCell>
                      <TableCell>Result</TableCell>
                      {org?.enableFollowUpStatus && <TableCell>Follow-Up</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const config = STATUS_CONFIG[row.status] || DEFAULT_STATUS_STYLE;
                      return (
                        <TableRow key={row.id} hover sx={{ cursor: "pointer" }}
                          onClick={() => router.push(`/employees/${row.id}/${nameToSlug(row.name)}`)}
                        >
                          <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>
                            {row.name}
                          </TableCell>
                          <TableCell>{row.start}</TableCell>
                          <TableCell>{row.end || "-"}</TableCell>
                          <TableCell>
                            <Chip label={row.status} size="small"
                              sx={{ borderRadius: "6px", fontWeight: 600, fontSize: "0.7rem", bgcolor: config.bg, color: config.color }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                              {row.result}
                            </Typography>
                          </TableCell>
                          {org?.enableFollowUpStatus && (
                            <TableCell>
                              {row.trainingId ? (
                                <FollowUpStatusSelect
                                  employeeId={row.id}
                                  trainingId={row.trainingId}
                                  currentStatus={row.followUpStatus}
                                  options={org.followUpStatuses}
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">—</Typography>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                    {!isLoadingReport && rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">No data found</Typography>
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
