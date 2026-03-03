import { scrapedData } from "./scraped";
import {
  Employee,
  Training,
  SelfAssessmentTraining,
  isSelfAssessment,
} from "./types";

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
      return "In Progress";
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
      return "In Progress";
    case "started":
      return "In Progress";
    default:
      return "Not Taken";
  }
}

export interface UIEmployee {
  id: number;
  name: string;
  slug: string;
  email: string;
  officeErgonomics: UIStatus;
  selfAssessment: UIStatus;
}

function extractIdAndSlug(oldProfileUrl: string): { id: number; slug: string } {
  const match = oldProfileUrl.match(/\/employees\/(\d+)\/(.+)$/);
  if (match) {
    return { id: parseInt(match[1], 10), slug: match[2] };
  }
  return { id: 0, slug: "unknown" };
}

function getTrainingByType(
  trainings: Training[],
  course: string
): Training | undefined {
  return trainings.find((t) => t.course === course);
}

function getLatestSelfAssessment(
  trainings: Training[]
): SelfAssessmentTraining | undefined {
  const sas = trainings.filter(isSelfAssessment);
  if (sas.length === 0) return undefined;
  // Return the first one (most recent in the array based on scraped order)
  return sas[0];
}

export function getUIEmployees(): UIEmployee[] {
  return (scrapedData as Employee[]).map((emp) => {
    const { id, slug } = extractIdAndSlug(emp.oldProfileUrl);

    const oe = getTrainingByType(emp.trainings, "Office Ergonomics");
    const sa = getTrainingByType(emp.trainings, "Self Assessment");

    return {
      id,
      name: emp.name,
      slug,
      email: emp.email,
      officeErgonomics: oe
        ? mapOfficeErgonomicsStatus(oe.status)
        : "Not Taken",
      selfAssessment: sa
        ? mapSelfAssessmentStatus(sa.status)
        : "Not Taken",
    };
  });
}


export interface UITraining {
  date: string;
  training: string;
  result: UIStatus;
  startedDate: string | null;
  completedDate: string | null;
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
  id: number;
  name: string;
  email: string;
  officeErgonomics: UIStatus;
  selfAssessment: UIStatus;
  trainings: UITraining[];
  selfAssessmentDetail: UISelfAssessmentDetail | null;
  timeline: UITimeline[];
}

function buildBodyDataFromTraining(
  sa: SelfAssessmentTraining
): Record<string, number> {
  const data: Record<string, number> = {};
  if (sa.bodyDiagram?.allParts) {
    for (const [key, info] of Object.entries(sa.bodyDiagram.allParts)) {
      if (info && info.severity > 0) {
        data[key] = info.severity;
      }
    }
  }
  return data;
}

function buildDemographic(sa: SelfAssessmentTraining): UIDemographic {
  const d = sa.demographic;
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

function buildDiscomfortsString(sa: SelfAssessmentTraining): string {
  if (!sa.discomforts || sa.discomforts.length === 0) return "-";
  return sa.discomforts
    .map((d) => `${d.area}: ${d.severity ?? "?"}`)
    .join(", ");
}

function buildActionsString(sa: SelfAssessmentTraining): string {
  if (!sa.actions || sa.actions.length === 0) return "-";
  return sa.actions.join(", ");
}

function buildEquipmentString(sa: SelfAssessmentTraining): string {
  if (!sa.equipment || sa.equipment.length === 0) return "-";
  return sa.equipment.join("\n");
}

function buildIssuesString(sa: SelfAssessmentTraining): string {
  const parts: string[] = [];
  if (sa.issues?.recommendations?.length)
    parts.push(...sa.issues.recommendations);
  if (sa.issues?.actionItems?.length) parts.push(...sa.issues.actionItems);
  if (sa.issues?.suggestions?.length) parts.push(...sa.issues.suggestions);
  if (sa.issues?.other?.length) parts.push(...sa.issues.other);
  if (parts.length === 0) {
    if (sa.issues?.raw) return sa.issues.raw.trim();
    return "No issues";
  }
  return parts.join("\n");
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return dateStr;
}

export function getUIEmployeeDetail(
  employeeId: number
): UIEmployeeDetail | null {
  const emp = (scrapedData as Employee[]).find((e) => {
    const { id } = extractIdAndSlug(e.oldProfileUrl);
    return id === employeeId;
  });

  if (!emp) return null;

  const { id } = extractIdAndSlug(emp.oldProfileUrl);

  const oe = getTrainingByType(emp.trainings, "Office Ergonomics");
  const sa = getLatestSelfAssessment(emp.trainings);

  // Build trainings list
  const uiTrainings: UITraining[] = emp.trainings.map((t) => {
    const status = t.course === "Self Assessment"
      ? mapSelfAssessmentStatus(t.status)
      : mapOfficeErgonomicsStatus(t.status);

    return {
      date: t.completedDate || t.startedDate || "-",
      training: t.course,
      result: status,
      startedDate: t.startedDate,
      completedDate: t.completedDate,
    };
  });

  // Build self assessment detail
  let selfAssessmentDetail: UISelfAssessmentDetail | null = null;
  if (sa) {
    selfAssessmentDetail = {
      started: formatDate(sa.startedDate),
      completed: formatDate(sa.completedDate),
      demographic: buildDemographic(sa),
      discomforts: buildDiscomfortsString(sa),
      action: buildActionsString(sa),
      equipment: buildEquipmentString(sa),
      issues: buildIssuesString(sa),
      result: sa.result || sa.issues?.result || "-",
      bodyData: buildBodyDataFromTraining(sa),
    };
  }

  // Build timeline — group trainings by date
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

    if (isSelfAssessment(t) && t.demographic) {
      entry.details = {
        demographic: buildDemographic(t),
        discomforts: buildDiscomfortsString(t),
        action: buildActionsString(t),
        equipment: buildEquipmentString(t),
        issues: buildIssuesString(t),
        result: t.result || t.issues?.result || "-",
        bodyData: buildBodyDataFromTraining(t),
      };
    }

    dateMap.get(dateKey)!.push(entry);
  }

  const timeline: UITimeline[] = Array.from(dateMap.entries()).map(
    ([date, entries]) => ({
      date,
      entries,
    })
  );

  return {
    id,
    name: emp.name,
    email: emp.email,
    officeErgonomics: oe
      ? mapOfficeErgonomicsStatus(oe.status)
      : "Not Taken",
    selfAssessment: sa
      ? mapSelfAssessmentStatus(sa.status)
      : "Not Taken",
    trainings: uiTrainings,
    selfAssessmentDetail,
    timeline,
  };
}


export interface ProgramStats {
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

export function getProgramStats(): ProgramStats {
  const employees = scrapedData as Employee[];
  const total = employees.length;

  let oeEnrolled = 0;
  let oeCompleted = 0;
  let oeInProgress = 0;

  let saEnrolled = 0;
  let saCompleted = 0;
  let saInProgress = 0;
  let saPass = 0;
  let saAction = 0;
  let saAssessment = 0;

  for (const emp of employees) {
    const oe = getTrainingByType(emp.trainings, "Office Ergonomics");
    const sa = getTrainingByType(emp.trainings, "Self Assessment");

    if (oe) {
      oeEnrolled++;
      if (oe.status === "completed") oeCompleted++;
      else oeInProgress++;
    }

    if (sa) {
      saEnrolled++;
      if (sa.status === "pass") {
        saCompleted++;
        saPass++;
      } else if (sa.status === "action") {
        saCompleted++;
        saAction++;
      } else if (sa.status === "assessment") {
        saCompleted++;
        saAssessment++;
      } else {
        saInProgress++;
      }
    }
  }

  const totalCompleted = oeCompleted + saCompleted;
  const totalEnrolled = oeEnrolled + saEnrolled;
  const completionRate =
    totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

  return {
    totalEmployees: total,
    oe: { enrolled: oeEnrolled, completed: oeCompleted, inProgress: oeInProgress },
    sa: {
      enrolled: saEnrolled,
      completed: saCompleted,
      inProgress: saInProgress,
      pass: saPass,
      action: saAction,
      assessment: saAssessment,
    },
    completionRate,
    assessmentsDue: saInProgress,
  };
}


export interface OEReportRow {
  name: string;
  id: number;
  start: string;
  end: string;
  status: UIStatus;
}

export function getOEReportData(): OEReportRow[] {
  const employees = scrapedData as Employee[];
  const rows: OEReportRow[] = [];

  for (const emp of employees) {
    const oe = getTrainingByType(emp.trainings, "Office Ergonomics");
    if (!oe) continue;

    const { id } = extractIdAndSlug(emp.oldProfileUrl);
    rows.push({
      name: emp.name,
      id,
      start: oe.startedDate || "-",
      end: oe.completedDate || "-",
      status: mapOfficeErgonomicsStatus(oe.status),
    });
  }

  return rows;
}


export interface SAReportRow {
  name: string;
  id: number;
  start: string;
  end: string;
  status: UIStatus;
  result: string;
}

export function getSAReportData(): SAReportRow[] {
  const employees = scrapedData as Employee[];
  const rows: SAReportRow[] = [];

  for (const emp of employees) {
    const sa = getLatestSelfAssessment(emp.trainings);
    if (!sa) {
      const pending = emp.trainings.find(
        (t) => t.course === "Self Assessment"
      );
      if (pending) {
        const { id } = extractIdAndSlug(emp.oldProfileUrl);
        rows.push({
          name: emp.name,
          id,
          start: pending.startedDate || "-",
          end: pending.completedDate || "-",
          status: mapSelfAssessmentStatus(pending.status),
          result: "-",
        });
      }
      continue;
    }

    const { id } = extractIdAndSlug(emp.oldProfileUrl);
    rows.push({
      name: emp.name,
      id,
      start: sa.startedDate || "-",
      end: sa.completedDate || "-",
      status: mapSelfAssessmentStatus(sa.status),
      result: sa.result || "-",
    });
  }

  return rows;
}
