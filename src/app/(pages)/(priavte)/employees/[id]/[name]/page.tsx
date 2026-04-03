"use client";

import { useState, useMemo } from "react";
import {
  Box, Card, Chip, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Tabs, Tab, alpha, CircularProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { useParams } from "next/navigation";
import {
  useEmployeeControllerFindOneQuery,
  useOrganizationControllerFindOneQuery,
} from "@/lib/redux/api/generatedApi";
import StatusChip from "@/components/atoms/StatusChip";
import SearchField from "@/components/atoms/SearchField";
import FilterButtons from "@/components/atoms/FilterButtons";
import DetailRow from "@/components/molecules/DetailRow";
import DemographicDisplay from "@/components/molecules/DemographicDisplay";
import FollowUpStatusSelect from "@/components/molecules/FollowUpStatusSelect";
import BodyDiagram from "@/components/organisms/bodyDiagram/BodyDiagram";
import SelfAssessmentSection from "@/components/organisms/SelfAssessmentSection";
import AttachmentSection from "@/components/organisms/AttachmentSection";

const COURSE_FILTERS = [
  { key: "all", label: "All Courses" },
  { key: "self-assessment", label: "Self Assessment" },
  { key: "office-ergonomics", label: "Office Ergonomics" },
];

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params?.id as string;
  const [activeTab, setActiveTab] = useState(0);
  const [timelineTryFilter, setTimelineTryFilter] = useState("all");
  const [timelineCourseFilter, setTimelineCourseFilter] = useState("all");

  const { data: rawEmployee, isLoading, error } = useEmployeeControllerFindOneQuery(
    { id: employeeId },
    { skip: !employeeId },
  );

  const employee = useMemo(() => {
    if (!rawEmployee) return null;

    const emp = rawEmployee;
    const reversedTrainings = [...emp.trainings].reverse();

    const oeTraining = reversedTrainings.find((t) => t.course === "Office Ergonomics");
    const saTraining = reversedTrainings.find((t) => t.course === "Self Assessment");

    const mapStatus = (course: string, status: string) => {
      if (course === "Self Assessment") {
        if (status === "pass") return "Pass";
        if (status === "action") return "Action Needed";
        if (status === "assessment") return "Assessment";
        if (status === "pending" || status === "started") return "In Progress";
        if (status === "finished") return "Completed";
        return "Not Taken";
      } else {
        if (status === "completed") return "Completed";
        if (status === "pending" || status === "started") return "In Progress";
        return "Not Taken";
      }
    };

    const uiTrainings = emp.trainings.map((t) => ({
      trainingId: t.id,
      date: t.completedDate || t.startedDate || "-",
      training: t.course,
      result: mapStatus(t.course, t.status),
      startedDate: t.startedDate || "-",
      completedDate: t.completedDate || "-",
    }));

    const latestTrainings: typeof uiTrainings = [];
    const seenCourses = new Set<string>();
    for (const t of reversedTrainings) {
      if (!seenCourses.has(t.course)) {
        seenCourses.add(t.course);
        latestTrainings.push({
          trainingId: t.id,
          date: t.completedDate || t.startedDate || "-",
          training: t.course,
          result: mapStatus(t.course, t.status),
          startedDate: t.startedDate || "-",
          completedDate: t.completedDate || "-",
        });
      }
    }

    const buildDemographic = (d: any) => ({
      age: d?.age || "-",
      height: d?.heightRaw || "-",
      handedness: d?.handedness ? `${d.handedness.charAt(0).toUpperCase() + d.handedness.slice(1)}-handed` : "-",
      monitors: d?.dualMonitors ? "Has dual monitors" : "Single monitor",
      usesLaptop: d?.usesLaptop ?? false,
      chairAdjustable: d?.chairAdjustable ?? false,
      wearsBifocals: d?.wearsBifocals ?? false,
    });

    const buildDiscomforts = (d: any[]) => {
      if (!d || d.length === 0) return "-";
      return d.map((x) => `${x.area}: ${x.severity ?? "?"}`).join(", ");
    };

    const buildIssues = (i: any) => {
      if (!i) return "No issues";
      const parts = [];
      if (i.recommendations?.length) parts.push(...i.recommendations);
      if (i.actionItems?.length) parts.push(...i.actionItems);
      if (i.suggestions?.length) parts.push(...i.suggestions);
      if (i.other?.length) parts.push(...i.other);
      if (parts.length === 0) return i.raw?.trim() || "No issues";
      return parts.join("\n");
    };

    const buildBodyData = (bp: any[]) => {
      const data: Record<string, number> = {};
      if (!bp) return data;
      for (const p of bp) {
        if (p.severity > 0) data[p.bodyPart] = p.severity;
      }
      return data;
    };

    const isSA = (data: any) =>
      data && ("demographic" in data || "discomforts" in data || "bodyPartsDiscomfort" in data);

    let selfAssessmentDetail = null;
    if (saTraining?.courseData && isSA(saTraining.courseData)) {
      const cd = saTraining.courseData as any;
      selfAssessmentDetail = {
        trainingId: saTraining.id,
        started: saTraining.startedDate || "-",
        completed: saTraining.completedDate || "-",
        demographic: buildDemographic(cd.demographic),
        discomforts: buildDiscomforts(cd.discomforts),
        action: cd.actions?.length ? cd.actions.join(", ") : "-",
        equipment: cd.equipment?.length ? cd.equipment.join("\n") : "-",
        issues: buildIssues(cd.issues),
        result: cd.result || cd.issues?.result || "-",
        bodyData: buildBodyData(cd.bodyPartsDiscomfort),
      };
    }

    const dateMap = new Map<string, any[]>();
    for (const t of emp.trainings) {
      const dateKey = t.completedDate || t.startedDate || "Unknown";
      if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);

      const entry: any = {
        type: t.course,
        trainingId: t.id,
        started: t.startedDate || "-",
        completed: t.completedDate || "-",
      };

      if (t.course === "Self Assessment" && t.courseData && isSA(t.courseData) && (t.courseData as any).demographic) {
        const cd = t.courseData as any;
        entry.details = {
          demographic: buildDemographic(cd.demographic),
          discomforts: buildDiscomforts(cd.discomforts),
          action: cd.actions?.length ? cd.actions.join(", ") : "-",
          equipment: cd.equipment?.length ? cd.equipment.join("\n") : "-",
          issues: buildIssues(cd.issues),
          result: cd.result || cd.issues?.result || "-",
          bodyData: buildBodyData(cd.bodyPartsDiscomfort),
        };
      }
      dateMap.get(dateKey)!.push(entry);
    }

    const timeline = Array.from(dateMap.entries()).map(([date, entries]) => ({ date, entries }));

    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      followUpStatus: emp.followUpStatus ?? null,
      officeErgonomics: oeTraining ? mapStatus(oeTraining.course, oeTraining.status) : "Not Taken",
      selfAssessment: saTraining ? mapStatus(saTraining.course, saTraining.status) : "Not Taken",
      trainings: uiTrainings,
      latestTrainings,
      latestTrainingIds: latestTrainings.map((training) => training.trainingId),
      selfAssessmentDetail,
      timeline,
    };
  }, [rawEmployee]);

  const { data: org } = useOrganizationControllerFindOneQuery(
    { id: rawEmployee?.organization || "" },
    { skip: !rawEmployee?.organization },
  );

  const showFollowUp = !!org?.enableFollowUpStatus;
  const followUpOptions = org?.followUpStatuses ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error || !employee) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Employee not found (ID: {employeeId})
        </Typography>
      </Box>
    );
  }

  const resultLabel = employee.selfAssessment.toUpperCase();
  const initials = employee.name.split(" ").map((w: string) => w[0]).join("").toUpperCase();

  return (
    <Box>
      <Card sx={{ mb: 3, overflow: "visible" }}>
        <Box sx={{ pt: 4, pb: 6, px: { xs: 2, md: 4 }, position: "relative" }}>
          <Box sx={{ position: "absolute", inset: 0, opacity: 0.03, backgroundSize: "50px 50px" }} />
        </Box>
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 3, mt: -5, position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "flex-end" }, gap: 2.5, flexDirection: { xs: "column", sm: "row" } }}>
            <Avatar
              sx={{
                width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, fontSize: "1.5rem", fontWeight: 700,
                bgcolor: "#2563eb", color: "#fff",
                border: "4px solid white",
                boxShadow: "0 4px 12px rgb(0 0 0 / 0.15)",
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ pb: 0.5, flex: 1, minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "1.1rem", sm: "1.5rem" } }}>
                {employee.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25, mb: showFollowUp ? 1 : 0 }}>
                <EmailRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary" noWrap>{employee.email}</Typography>
              </Box>
              {showFollowUp && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">Follow-Up Status:</Typography>
                  <FollowUpStatusSelect
                    employeeId={employee.id}
                    currentStatus={employee.followUpStatus}
                    options={followUpOptions}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2, pb: 0.5, flexWrap: "wrap" }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Office Ergonomics</Typography>
                <StatusChip status={employee.officeErgonomics} />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Self Assessment</Typography>
                <StatusChip status={employee.selfAssessment} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
      <Card>
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              px: { xs: 1, sm: 2 },
              "& .MuiTab-root": {
                textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
                minHeight: 48, color: "text.secondary",
                minWidth: { xs: "auto", sm: 90 }, px: { xs: 1.5, sm: 2 },
                "&.Mui-selected": { color: "primary.main" },
              },
              "& .MuiTabs-indicator": { height: 2.5, borderRadius: "2px 2px 0 0" },
            }}
          >
            <Tab label="Summary" />
            <Tab label="Training" />
            <Tab label="Timeline" />
            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>Training Overview</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "10px", overflow: "auto" }}>
                <Table size="small" sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Training</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.latestTrainings.map((t, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{t.date}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{t.training}</TableCell>
                        <TableCell><StatusChip status={t.result} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {employee.selfAssessmentDetail && (
                <SelfAssessmentSection
                  detail={employee.selfAssessmentDetail}
                  resultLabel={resultLabel}
                />
              )}
            </Box>
          )}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>Training History</Typography>
                <SearchField value="" onChange={() => { }} />
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "10px", overflow: "auto" }}>
                <Table size="small" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>Started</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.trainings.map((t, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{t.training}</TableCell>
                        <TableCell>{t.startedDate}</TableCell>
                        <TableCell>{t.completedDate}</TableCell>
                        <TableCell><StatusChip status={t.result} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Showing 1–{employee.trainings.length} of {employee.trainings.length} entries
                </Typography>
              </Box>
            </Box>
          )}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 1.5 }}>
                <FilterButtons
                  options={["all", "last"]}
                  active={timelineTryFilter}
                  onChange={setTimelineTryFilter}
                />
                <FilterButtons
                  options={COURSE_FILTERS.map((f) => f.key)}
                  active={timelineCourseFilter}
                  onChange={setTimelineCourseFilter}
                  compact
                />
              </Box>

              {employee.timeline.map((day, di) => {
                const filteredEntries = day.entries.filter((entry) => {
                  const matchesCourse =
                    timelineCourseFilter === "all"
                    || (timelineCourseFilter === "self-assessment" && entry.type === "Self Assessment")
                    || (timelineCourseFilter === "office-ergonomics" && entry.type === "Office Ergonomics");

                  if (!matchesCourse) return false;
                  if (timelineTryFilter === "all") return true;

                  return employee.latestTrainingIds.includes(entry.trainingId);
                });

                if (filteredEntries.length === 0) return null;

                return (
                  <Box key={di}>
                    <Chip label={day.date} size="small"
                      sx={{ bgcolor: alpha("#2563eb", 0.1), color: "#2563eb", borderRadius: "6px", fontWeight: 600, mb: 2, fontSize: "0.75rem" }}
                    />

                    {filteredEntries
                      .map((entry, ei) => (
                        <Box key={ei} sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, mb: 3, ml: { xs: 0, sm: 1 } }}>
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                            <Avatar sx={{ bgcolor: alpha("#2563eb", 0.1), color: "#2563eb", width: 32, height: 32 }}>
                              <SchoolRoundedIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            {ei < filteredEntries.length - 1 && (
                              <Box sx={{ width: 2, flex: 1, bgcolor: "divider", mt: 1 }} />
                            )}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                              <Typography variant="body1" sx={{ color: "primary.main", fontWeight: 600 }}>
                                {entry.type}
                              </Typography>
                            </Box>

                            {entry.details ? (
                              <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, flexWrap: "wrap" }}>
                                <Card sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
                                  <Box sx={{ p: 2 }}>
                                    <DetailRow label="Started" value={entry.started} icon={<AccessTimeIcon />} />
                                    <DetailRow label="Completed" value={entry.completed} icon={<AccessTimeIcon />} />
                                    <DetailRow label="Demographic" value={<DemographicDisplay {...entry.details.demographic} />} />
                                    <DetailRow label="Discomforts" value={entry.details.discomforts} />
                                    <DetailRow label="Action" value={entry.details.action} />
                                    <DetailRow label="Equipment" value={entry.details.equipment} />
                                    <DetailRow label="Issues" value={entry.details.issues} />
                                    <DetailRow label="Result" value={entry.details.result} />
                                  </Box>
                                </Card>
                                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                  <BodyDiagram data={entry.details.bodyData} resultLabel={resultLabel} />
                                </Box>
                              </Box>
                            ) : (
                              <Card sx={{ maxWidth: 380 }}>
                                <Box sx={{ p: 2 }}>
                                  <DetailRow label="Started" value={entry.started} icon={<AccessTimeIcon />} />
                                  <DetailRow label="Completed" value={entry.completed} icon={<AccessTimeIcon />} />
                                </Box>
                              </Card>
                            )}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                );
              })}
            </Box>
          )}
          {activeTab === 3 && (
            <AttachmentSection employeeId={employee.id} />
          )}
        </Box>
      </Card>
    </Box>
  );
}
