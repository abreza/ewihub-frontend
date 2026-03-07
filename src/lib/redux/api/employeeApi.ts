import { api } from "./enhancedApi";

export interface TrainingStatusRo {
  course: string;
  status: string;
}

export interface EmployeeListItemRo {
  id: string;
  name: string;
  email: string;
  oldProfileUrl: string | null;
  trainingStatuses: TrainingStatusRo[];
}

export interface PaginationMetaRo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedRo<T> {
  data: T[];
  meta: PaginationMetaRo;
}

export interface DemographicRo {
  age: string | null;
  heightRaw: string | null;
  heightInches: number | null;
  handedness: string | null;
  wearsBifocals: boolean;
  visualIssue: string | null;
  computerTime: string | null;
  dualMonitors: boolean;
  usesLaptop: boolean;
  sitToStand: string | null;
  chairAdjustable: boolean;
}

export interface DiscomfortRo {
  area: string;
  severity: number | null;
}

export interface IssuesRo {
  recommendations: string[];
  actionItems: string[];
  suggestions: string[];
  result: string | null;
  raw: string | null;
  other: string[];
}

export interface BodyPartDiscomfortRo {
  bodyPart: string;
  severity: number;
}

export interface SelfAssessmentCourseDataRo {
  demographic: DemographicRo | null;
  discomforts: DiscomfortRo[];
  actions: string[];
  equipment: string[];
  issues: IssuesRo | null;
  result: string | null;
  bodyPartsDiscomfort: BodyPartDiscomfortRo[];
}

export interface TrainingRo {
  id: string;
  course: string;
  status: string;
  startedDate: string | null;
  completedDate: string | null;
  courseData: SelfAssessmentCourseDataRo | Record<string, any> | null;
}

export interface EmployeeDetailRo {
  id: string;
  name: string;
  email: string;
  oldProfileUrl: string | null;
  trainings: TrainingRo[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseStatsRo {
  course: string;
  enrolled: number;
  completed: number;
  inProgress: number;
  statusBreakdown: Record<string, number>;
}

export interface ProgramStatsRo {
  totalEmployees: number;
  courses: CourseStatsRo[];
  completionRate: number;
}

export interface CourseReportRowRo {
  employeeId: string;
  name: string;
  email: string;
  oldProfileUrl: string | null;
  course: string;
  status: string;
  startedDate: string | null;
  completedDate: string | null;
  result: string | null;
}

export interface BodyPartAggregationRo {
  key: string;
  count: number;
  totalSeverity: number;
  avgSeverity: number;
}

export interface DiscomfortSummaryRo {
  countData: Record<string, number>;
  avgData: Record<string, number>;
  details: BodyPartAggregationRo[];
}

// ─── Query arg types ────────────────────────────────────────────────────

export interface QueryEmployeesArg {
  search?: string;
  course?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CourseReportArg {
  course: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface BodyAggregationArg {
  course: string;
  dataPath?: string;
}

const employeeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<
      PaginatedRo<EmployeeListItemRo>,
      QueryEmployeesArg | void
    >({
      query: (params) => ({
        url: "/api/employees",
        params: params || {},
      }),
      providesTags: ["Employees"],
    }),

    getEmployeeDetail: build.query<EmployeeDetailRo, string>({
      query: (id) => ({
        url: `/api/employees/${id}`,
      }),
      providesTags: ["Employees"],
    }),

    getProgramStats: build.query<ProgramStatsRo, void>({
      query: () => ({
        url: "/api/employees/stats",
      }),
      providesTags: ["Employees"],
    }),

    getCourseReport: build.query<
      PaginatedRo<CourseReportRowRo>,
      CourseReportArg
    >({
      query: ({ course, ...params }) => ({
        url: `/api/employees/reports/${encodeURIComponent(course)}`,
        params,
      }),
      providesTags: ["Employees"],
    }),

    getBodyAggregation: build.query<DiscomfortSummaryRo, BodyAggregationArg>({
      query: ({ course, dataPath }) => ({
        url: `/api/employees/reports/${encodeURIComponent(course)}/body-aggregation`,
        params: dataPath ? { dataPath } : {},
      }),
      providesTags: ["Employees"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailQuery,
  useGetProgramStatsQuery,
  useGetCourseReportQuery,
  useGetBodyAggregationQuery,
} = employeeApi;
