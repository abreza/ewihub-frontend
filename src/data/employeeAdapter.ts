import type {
  EmployeeListItemRo,
  EmployeeDetailRo,
  TrainingRo,
  SelfAssessmentCourseDataRo,
  ProgramStatsRo,
  CourseReportRowRo,
} from "@/lib/redux/api/generatedApi";

export type UIStatus =
  | "Completed"
  | "Pass"
  | "Not Taken"
  | "In Progress"
  | "Action Needed"
  | "Assessment";

function mapSelfAssessmentStatus(status: string): UIStatus {
  switch (status) {
    case "pass":
      return "Pass";
    case "action":
      return "Action Needed";
    case "assessment":
      return "Assessment";
    case "pending":
    case "started":
      return "In Progress";
    case "finished":
      return "Completed";
    default:
      return "Not Taken";
  }
}

function mapOfficeErgonomicsStatus(status: string): UIStatus {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
    case "started":
      return "In Progress";
    default:
      return "Not Taken";
  }
}

function mapStatus(course: string, status: string): UIStatus {
  if (course === "Self Assessment") {
    return mapSelfAssessmentStatus(status);
  }
  return mapOfficeErgonomicsStatus(status);
}

export interface UIEmployee {
  id: string;
  name: string;
  slug: string;
  email: string;
  officeErgonomics: UIStatus;
  selfAssessment: UIStatus;
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function toUIEmployee(emp: EmployeeListItemRo): UIEmployee {
  const oe = emp.trainingStatuses.find((t) => t.course === "Office Ergonomics");
  const sa = emp.trainingStatuses.find((t) => t.course === "Self Assessment");

  return {
    id: emp.id,
    name: emp.name,
    slug: nameToSlug(emp.name),
    email: emp.email,
    officeErgonomics: oe ? mapOfficeErgonomicsStatus(oe.status) : "Not Taken",
    selfAssessment: sa ? mapSelfAssessmentStatus(sa.status) : "Not Taken",
  };
}

export function toUIEmployees(list: EmployeeListItemRo[]): UIEmployee[] {
  return list.map(toUIEmployee);
}

export interface UITraining {
  date: string;
  training: string;
  result: UIStatus;
  startedDate: string | undefined;
  completedDate: string | undefined;
}

export interface UIDemographic {
  age: string;
  height: string;
  handedness: string;
  monitors: string;
  usesLaptop: boolean;
  chairAdjustable: boolean;
  wearsBifocals: boolean;
}

export interface UISelfAssessmentDetail {
  started: string;
  completed: string;
  demographic: UIDemographic;
  discomforts: string;
  action: string;
  equipment: string;
  issues: string;
  result: string;
  bodyData: Record<string, number>;
}

export interface UITimelineEntry {
  type: string;
  started: string;
  completed: string;
  details?: {
    demographic: UIDemographic;
    discomforts: string;
    action: string;
    equipment: string;
    issues: string;
    result: string;
    bodyData: Record<string, number>;
  };
}

export interface UITimeline {
  date: string;
  entries: UITimelineEntry[];
}

export interface UIEmployeeDetail {
  id: string;
  name: string;
  email: string;
  officeErgonomics: UIStatus;
  selfAssessment: UIStatus;
  trainings: UITraining[];
  selfAssessmentDetail: UISelfAssessmentDetail | null;
  timeline: UITimeline[];
}

function formatDate(dateStr: string | null | undefined): string {
  return dateStr || "-";
}

function isSelfAssessmentData(
  courseData: any
): courseData is SelfAssessmentCourseDataRo {
  return courseData && ("demographic" in courseData || "discomforts" in courseData || "bodyPartsDiscomfort" in courseData);
}

function buildDemographic(
  d: SelfAssessmentCourseDataRo["demographic"]
): UIDemographic {
  return {
    age: d?.age || "-",
    height: d?.heightRaw || "-",
    handedness: d?.handedness
      ? `${d.handedness.charAt(0).toUpperCase() + d.handedness.slice(1)}-handed`
      : "-",
    monitors: d?.dualMonitors ? "Has dual monitors" : "Single monitor",
    usesLaptop: d?.usesLaptop ?? false,
    chairAdjustable: d?.chairAdjustable ?? false,
    wearsBifocals: d?.wearsBifocals ?? false,
  };
}

function buildDiscomfortsString(
  discomforts: SelfAssessmentCourseDataRo["discomforts"] | undefined
): string {
  if (!discomforts || discomforts.length === 0) return "-";
  return discomforts.map((d) => `${d.area}: ${d.severity ?? "?"}`).join(", ");
}

function buildActionsString(actions: string[] | undefined): string {
  if (!actions || actions.length === 0) return "-";
  return actions.join(", ");
}

function buildEquipmentString(equipment: string[] | undefined): string {
  if (!equipment || equipment.length === 0) return "-";
  return equipment.join("\n");
}

function buildIssuesString(
  issues: SelfAssessmentCourseDataRo["issues"] | undefined | null
): string {
  if (!issues) return "No issues";
  const parts: string[] = [];
  if (issues.recommendations?.length) parts.push(...issues.recommendations);
  if (issues.actionItems?.length) parts.push(...issues.actionItems);
  if (issues.suggestions?.length) parts.push(...issues.suggestions);
  if (issues.other?.length) parts.push(...issues.other);
  if (parts.length === 0) {
    if (issues.raw) return issues.raw.trim();
    return "No issues";
  }
  return parts.join("\n");
}

function buildBodyData(
  bodyParts: SelfAssessmentCourseDataRo["bodyPartsDiscomfort"] | undefined
): Record<string, number> {
  const data: Record<string, number> = {};
  if (!bodyParts) return data;
  for (const bp of bodyParts) {
    if (bp.severity > 0) {
      data[bp.bodyPart] = bp.severity;
    }
  }
  return data;
}

function buildSADetail(
  t: TrainingRo,
  cd: SelfAssessmentCourseDataRo
): UISelfAssessmentDetail {
  return {
    started: formatDate(t.startedDate),
    completed: formatDate(t.completedDate),
    demographic: buildDemographic(cd.demographic),
    discomforts: buildDiscomfortsString(cd.discomforts),
    action: buildActionsString(cd.actions),
    equipment: buildEquipmentString(cd.equipment),
    issues: buildIssuesString(cd.issues),
    result: cd.result || cd.issues?.result || "-",
    bodyData: buildBodyData(cd.bodyPartsDiscomfort),
  };
}

export function toUIEmployeeDetail(
  emp: EmployeeDetailRo
): UIEmployeeDetail {
  const oeTraining = emp.trainings.find((t) => t.course === "Office Ergonomics");
  const saTraining = emp.trainings.find((t) => t.course === "Self Assessment");

  const uiTrainings: UITraining[] = emp.trainings.map((t) => ({
    date: t.completedDate || t.startedDate || "-",
    training: t.course,
    result: mapStatus(t.course, t.status),
    startedDate: t.startedDate,
    completedDate: t.completedDate,
  }));

  let selfAssessmentDetail: UISelfAssessmentDetail | null = null;
  if (saTraining && saTraining.courseData && isSelfAssessmentData(saTraining.courseData)) {
    selfAssessmentDetail = buildSADetail(saTraining, saTraining.courseData);
  }

  const dateMap = new Map<string, UITimelineEntry[]>();

  for (const t of emp.trainings) {
    const dateKey = t.completedDate || t.startedDate || "Unknown";

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }

    const entry: UITimelineEntry = {
      type: t.course,
      started: formatDate(t.startedDate),
      completed: formatDate(t.completedDate),
    };

    if (
      t.course === "Self Assessment" &&
      t.courseData &&
      isSelfAssessmentData(t.courseData) &&
      t.courseData.demographic
    ) {
      const cd = t.courseData;
      entry.details = {
        demographic: buildDemographic(cd.demographic),
        discomforts: buildDiscomfortsString(cd.discomforts),
        action: buildActionsString(cd.actions),
        equipment: buildEquipmentString(cd.equipment),
        issues: buildIssuesString(cd.issues),
        result: cd.result || cd.issues?.result || "-",
        bodyData: buildBodyData(cd.bodyPartsDiscomfort),
      };
    }

    dateMap.get(dateKey)!.push(entry);
  }

  const timeline: UITimeline[] = Array.from(dateMap.entries()).map(
    ([date, entries]) => ({ date, entries })
  );

  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    officeErgonomics: oeTraining
      ? mapOfficeErgonomicsStatus(oeTraining.status)
      : "Not Taken",
    selfAssessment: saTraining
      ? mapSelfAssessmentStatus(saTraining.status)
      : "Not Taken",
    trainings: uiTrainings,
    selfAssessmentDetail,
    timeline,
  };
}

export interface UIProgramStats {
  totalEmployees: number;
  oe: {
    enrolled: number;
    completed: number;
    inProgress: number;
  };
  sa: {
    enrolled: number;
    completed: number;
    inProgress: number;
    pass: number;
    action: number;
    assessment: number;
  };
  completionRate: number;
  assessmentsDue: number;
}

export function toUIProgramStats(stats: ProgramStatsRo): UIProgramStats {
  const oeCourse = stats.courses.find((c) => c.course === "Office Ergonomics");
  const saCourse = stats.courses.find((c) => c.course === "Self Assessment");

  const saBreakdown = (saCourse?.statusBreakdown || {}) as Record<string, number>;

  return {
    totalEmployees: stats.totalEmployees,
    oe: {
      enrolled: oeCourse?.enrolled || 0,
      completed: oeCourse?.completed || 0,
      inProgress: oeCourse?.inProgress || 0,
    },
    sa: {
      enrolled: saCourse?.enrolled || 0,
      completed: saCourse?.completed || 0,
      inProgress: saCourse?.inProgress || 0,
      pass: saBreakdown["pass"] || 0,
      action: saBreakdown["action"] || 0,
      assessment: saBreakdown["assessment"] || 0,
    },
    completionRate: stats.completionRate,
    assessmentsDue: saCourse?.inProgress || 0,
  };
}

export interface OEReportRow {
  name: string;
  id: string;
  start: string;
  end: string;
  status: UIStatus;
}

export function toOEReportRow(row: CourseReportRowRo): OEReportRow {
  return {
    name: row.name,
    id: row.employeeId,
    start: row.startedDate || "-",
    end: row.completedDate || "-",
    status: mapOfficeErgonomicsStatus(row.status),
  };
}

export interface SAReportRow {
  name: string;
  id: string;
  start: string;
  end: string;
  status: UIStatus;
  result: string;
}

export function toSAReportRow(row: CourseReportRowRo): SAReportRow {
  return {
    name: row.name,
    id: row.employeeId,
    start: row.startedDate || "-",
    end: row.completedDate || "-",
    status: mapSelfAssessmentStatus(row.status),
    result: row.result || "-",
  };
}

export { nameToSlug };
