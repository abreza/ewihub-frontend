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
import { toUIEmployeeDetail } from "@/data/employeeAdapter";
import StatusChip from "@/components/atoms/StatusChip";
import SearchField from "@/components/atoms/SearchField";
import FilterButtons from "@/components/atoms/FilterButtons";
import DetailRow from "@/components/molecules/DetailRow";
import DemographicDisplay from "@/components/molecules/DemographicDisplay";
import FollowUpStatusSelect from "@/components/molecules/FollowUpStatusSelect";
import BodyDiagram from "@/components/organisms/bodyDiagram/BodyDiagram";
import SelfAssessmentSection from "@/components/organisms/SelfAssessmentSection";

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

  const employee = useMemo(
    () => (rawEmployee ? toUIEmployeeDetail(rawEmployee) : null),
    [rawEmployee],
  );

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                <EmailRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary" noWrap>{employee.email}</Typography>
              </Box>
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
                      {showFollowUp && <TableCell>Follow-Up</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.latestTrainings.map((t, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{t.date}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{t.training}</TableCell>
                        <TableCell><StatusChip status={t.result} /></TableCell>
                        {showFollowUp && (
                          <TableCell>
                            {t.training === "Self Assessment" && t.trainingId ? (
                              <FollowUpStatusSelect
                                employeeId={employeeId}
                                trainingId={t.trainingId}
                                currentStatus={t.followUpStatus}
                                options={followUpOptions}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">—</Typography>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {employee.selfAssessmentDetail && (
                <SelfAssessmentSection
                  detail={employee.selfAssessmentDetail}
                  resultLabel={resultLabel}
                  employeeId={employeeId}
                  showFollowUp={showFollowUp}
                  followUpOptions={followUpOptions}
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
                      {showFollowUp && <TableCell>Follow-Up</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.trainings.map((t, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{t.training}</TableCell>
                        <TableCell>{t.startedDate || "-"}</TableCell>
                        <TableCell>{t.completedDate || "-"}</TableCell>
                        <TableCell><StatusChip status={t.result} /></TableCell>
                        {showFollowUp && (
                          <TableCell>
                            {t.training === "Self Assessment" && t.trainingId ? (
                              <FollowUpStatusSelect
                                employeeId={employeeId}
                                trainingId={t.trainingId}
                                currentStatus={t.followUpStatus}
                                options={followUpOptions}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">—</Typography>
                            )}
                          </TableCell>
                        )}
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

              {employee.timeline.map((day, di) => (
                <Box key={di}>
                  <Chip label={day.date} size="small"
                    sx={{ bgcolor: alpha("#2563eb", 0.1), color: "#2563eb", borderRadius: "6px", fontWeight: 600, mb: 2, fontSize: "0.75rem" }}
                  />

                  {day.entries
                    .filter((entry) => {
                      if (timelineCourseFilter === "all") return true;
                      if (timelineCourseFilter === "self-assessment") return entry.type === "Self Assessment";
                      if (timelineCourseFilter === "office-ergonomics") return entry.type === "Office Ergonomics";
                      return true;
                    })
                    .map((entry, ei) => (
                      <Box key={ei} sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, mb: 3, ml: { xs: 0, sm: 1 } }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <Avatar sx={{ bgcolor: alpha("#2563eb", 0.1), color: "#2563eb", width: 32, height: 32 }}>
                            <SchoolRoundedIcon sx={{ fontSize: 16 }} />
                          </Avatar>
                          {ei < day.entries.length - 1 && (
                            <Box sx={{ width: 2, flex: 1, bgcolor: "divider", mt: 1 }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                            <Typography variant="body1" sx={{ color: "primary.main", fontWeight: 600 }}>
                              {entry.type}
                            </Typography>
                            {showFollowUp && entry.type === "Self Assessment" && entry.trainingId && (
                              <FollowUpStatusSelect
                                employeeId={employeeId}
                                trainingId={entry.trainingId}
                                currentStatus={entry.followUpStatus}
                                options={followUpOptions}
                              />
                            )}
                          </Box>

                          {entry.details ? (
                            <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, flexWrap: "wrap" }}>
                              <Card sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
                                <Box sx={{ p: 2 }}>
                                  <DetailRow label="Started" value={entry.started} icon={<AccessTimeIcon />} />
                                  <DetailRow label="Completed" value={entry.completed} icon={<AccessTimeIcon />} />
                                  <DetailRow label="Demographic" value={<DemographicDisplay d={entry.details.demographic} />} />
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
              ))}
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}
