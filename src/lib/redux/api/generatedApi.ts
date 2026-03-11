import { emptyApi as api } from "./emptyApi";
export const addTagTypes = [
  "Users",
  "Auth",
  "Employees",
  "Organizations",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      userControllerCreate: build.mutation<
        UserControllerCreateApiResponse,
        UserControllerCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/users`,
          method: "POST",
          body: queryArg.createUserDto,
        }),
        invalidatesTags: ["Users"],
      }),
      userControllerFindAll: build.query<
        UserControllerFindAllApiResponse,
        UserControllerFindAllApiArg
      >({
        query: () => ({ url: `/api/users` }),
        providesTags: ["Users"],
      }),
      userControllerFindOne: build.query<
        UserControllerFindOneApiResponse,
        UserControllerFindOneApiArg
      >({
        query: (queryArg) => ({ url: `/api/users/${queryArg.id}` }),
        providesTags: ["Users"],
      }),
      userControllerUpdate: build.mutation<
        UserControllerUpdateApiResponse,
        UserControllerUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/users/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.updateUserDto,
        }),
        invalidatesTags: ["Users"],
      }),
      userControllerRemove: build.mutation<
        UserControllerRemoveApiResponse,
        UserControllerRemoveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/users/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Users"],
      }),
      authControllerLogin: build.mutation<
        AuthControllerLoginApiResponse,
        AuthControllerLoginApiArg
      >({
        query: (queryArg) => ({
          url: `/api/auth/login`,
          method: "POST",
          body: queryArg.loginDto,
        }),
        invalidatesTags: ["Auth"],
      }),
      authControllerSignup: build.mutation<
        AuthControllerSignupApiResponse,
        AuthControllerSignupApiArg
      >({
        query: (queryArg) => ({
          url: `/api/auth/signup`,
          method: "POST",
          body: queryArg.signupDto,
        }),
        invalidatesTags: ["Auth"],
      }),
      authControllerGetProfile: build.query<
        AuthControllerGetProfileApiResponse,
        AuthControllerGetProfileApiArg
      >({
        query: () => ({ url: `/api/auth/profile` }),
        providesTags: ["Auth"],
      }),
      authControllerForgetPassword: build.mutation<
        AuthControllerForgetPasswordApiResponse,
        AuthControllerForgetPasswordApiArg
      >({
        query: (queryArg) => ({
          url: `/api/auth/forget-password`,
          method: "POST",
          body: queryArg.forgetPasswordDto,
        }),
        invalidatesTags: ["Auth"],
      }),
      authControllerResetPassword: build.mutation<
        AuthControllerResetPasswordApiResponse,
        AuthControllerResetPasswordApiArg
      >({
        query: (queryArg) => ({
          url: `/api/auth/reset-password`,
          method: "POST",
          body: queryArg.resetPasswordDto,
        }),
        invalidatesTags: ["Auth"],
      }),
      employeeControllerCreate: build.mutation<
        EmployeeControllerCreateApiResponse,
        EmployeeControllerCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees`,
          method: "POST",
          body: queryArg.createEmployeeDto,
        }),
        invalidatesTags: ["Employees"],
      }),
      employeeControllerFindAll: build.query<
        EmployeeControllerFindAllApiResponse,
        EmployeeControllerFindAllApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees`,
          params: {
            search: queryArg.search,
            course: queryArg.course,
            status: queryArg.status,
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Employees"],
      }),
      employeeControllerGetStats: build.query<
        EmployeeControllerGetStatsApiResponse,
        EmployeeControllerGetStatsApiArg
      >({
        query: () => ({ url: `/api/employees/stats` }),
        providesTags: ["Employees"],
      }),
      employeeControllerGetCourseReport: build.query<
        EmployeeControllerGetCourseReportApiResponse,
        EmployeeControllerGetCourseReportApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/reports/${queryArg.course}`,
          params: {
            search: queryArg.search,
            status: queryArg.status,
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Employees"],
      }),
      employeeControllerGetBodyAggregation: build.query<
        EmployeeControllerGetBodyAggregationApiResponse,
        EmployeeControllerGetBodyAggregationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/reports/${queryArg.course}/body-aggregation`,
          params: {
            dataPath: queryArg.dataPath,
          },
        }),
        providesTags: ["Employees"],
      }),
      employeeControllerFindOne: build.query<
        EmployeeControllerFindOneApiResponse,
        EmployeeControllerFindOneApiArg
      >({
        query: (queryArg) => ({ url: `/api/employees/${queryArg.id}` }),
        providesTags: ["Employees"],
      }),
      employeeControllerUpdate: build.mutation<
        EmployeeControllerUpdateApiResponse,
        EmployeeControllerUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.updateEmployeeDto,
        }),
        invalidatesTags: ["Employees"],
      }),
      employeeControllerRemove: build.mutation<
        EmployeeControllerRemoveApiResponse,
        EmployeeControllerRemoveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Employees"],
      }),
      employeeControllerAddTraining: build.mutation<
        EmployeeControllerAddTrainingApiResponse,
        EmployeeControllerAddTrainingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/trainings`,
          method: "POST",
          body: queryArg.addTrainingDto,
        }),
        invalidatesTags: ["Employees"],
      }),
      employeeControllerUpdateTraining: build.mutation<
        EmployeeControllerUpdateTrainingApiResponse,
        EmployeeControllerUpdateTrainingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/trainings/${queryArg.trainingId}`,
          method: "PATCH",
          body: queryArg.updateTrainingDto,
        }),
        invalidatesTags: ["Employees"],
      }),
      employeeControllerRemoveTraining: build.mutation<
        EmployeeControllerRemoveTrainingApiResponse,
        EmployeeControllerRemoveTrainingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/trainings/${queryArg.trainingId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Employees"],
      }),
      employeeControllerReceiveLmsData: build.mutation<
        EmployeeControllerReceiveLmsDataApiResponse,
        EmployeeControllerReceiveLmsDataApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/lms/receive`,
          method: "POST",
          body: queryArg.lmsPayloadDto,
        }),
        invalidatesTags: ["Employees"],
      }),
      organizationControllerCreate: build.mutation<
        OrganizationControllerCreateApiResponse,
        OrganizationControllerCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations`,
          method: "POST",
          body: queryArg.createOrganizationDto,
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerFindAll: build.query<
        OrganizationControllerFindAllApiResponse,
        OrganizationControllerFindAllApiArg
      >({
        query: () => ({ url: `/api/organizations` }),
        providesTags: ["Organizations"],
      }),
      organizationControllerFindOne: build.query<
        OrganizationControllerFindOneApiResponse,
        OrganizationControllerFindOneApiArg
      >({
        query: (queryArg) => ({ url: `/api/organizations/${queryArg.id}` }),
        providesTags: ["Organizations"],
      }),
      organizationControllerUpdate: build.mutation<
        OrganizationControllerUpdateApiResponse,
        OrganizationControllerUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.updateOrganizationDto,
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerRemove: build.mutation<
        OrganizationControllerRemoveApiResponse,
        OrganizationControllerRemoveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerRegenerateApiKey: build.mutation<
        OrganizationControllerRegenerateApiKeyApiResponse,
        OrganizationControllerRegenerateApiKeyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}/regenerate-api-key`,
          method: "POST",
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerGetUsers: build.query<
        OrganizationControllerGetUsersApiResponse,
        OrganizationControllerGetUsersApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}/users`,
        }),
        providesTags: ["Organizations"],
      }),
      organizationControllerAddUser: build.mutation<
        OrganizationControllerAddUserApiResponse,
        OrganizationControllerAddUserApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}/users`,
          method: "POST",
          body: queryArg.addOrgUserDto,
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerUpdateUser: build.mutation<
        OrganizationControllerUpdateUserApiResponse,
        OrganizationControllerUpdateUserApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}/users/${queryArg.userId}`,
          method: "PATCH",
          body: queryArg.updateOrgUserDto,
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerRemoveUser: build.mutation<
        OrganizationControllerRemoveUserApiResponse,
        OrganizationControllerRemoveUserApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}/users/${queryArg.userId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organizations"],
      }),
      organizationControllerSyncFromEwihub: build.mutation<
        OrganizationControllerSyncFromEwihubApiResponse,
        OrganizationControllerSyncFromEwihubApiArg
      >({
        query: (queryArg) => ({
          url: `/api/organizations/${queryArg.id}/sync-ewihub`,
          method: "POST",
          body: queryArg.syncEwihubDto,
        }),
        invalidatesTags: ["Organizations"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type UserControllerCreateApiResponse =
  /** status 201 User created successfully */ UserRo;
export type UserControllerCreateApiArg = {
  createUserDto: CreateUserDto;
};
export type UserControllerFindAllApiResponse =
  /** status 200 List of all users */ UserRo[];
export type UserControllerFindAllApiArg = void;
export type UserControllerFindOneApiResponse =
  /** status 200 User found */ UserRo;
export type UserControllerFindOneApiArg = {
  id: string;
};
export type UserControllerUpdateApiResponse =
  /** status 200 User updated successfully */ UserRo;
export type UserControllerUpdateApiArg = {
  id: string;
  updateUserDto: UpdateUserDto;
};
export type UserControllerRemoveApiResponse = unknown;
export type UserControllerRemoveApiArg = {
  id: string;
};
export type AuthControllerLoginApiResponse =
  /** status 200 Login successful */ LoginRo;
export type AuthControllerLoginApiArg = {
  loginDto: LoginDto;
};
export type AuthControllerSignupApiResponse =
  /** status 201 User created successfully */ SignupRo;
export type AuthControllerSignupApiArg = {
  signupDto: SignupDto;
};
export type AuthControllerGetProfileApiResponse =
  /** status 200 User profile */ ProfileRo;
export type AuthControllerGetProfileApiArg = void;
export type AuthControllerForgetPasswordApiResponse =
  /** status 200 Password reset email sent (if email exists) */ ForgetPasswordRo;
export type AuthControllerForgetPasswordApiArg = {
  forgetPasswordDto: ForgetPasswordDto;
};
export type AuthControllerResetPasswordApiResponse =
  /** status 200 Password reset successful */ ResetPasswordRo;
export type AuthControllerResetPasswordApiArg = {
  resetPasswordDto: ResetPasswordDto;
};
export type EmployeeControllerCreateApiResponse =
  /** status 201  */ EmployeeDetailRo;
export type EmployeeControllerCreateApiArg = {
  createEmployeeDto: CreateEmployeeDto;
};
export type EmployeeControllerFindAllApiResponse =
  /** status 200  */ PaginatedEmployeesRo;
export type EmployeeControllerFindAllApiArg = {
  /** Search by name or email */
  search?: string;
  /** Filter by course name */
  course?: string;
  /** Filter by training status */
  status?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type EmployeeControllerGetStatsApiResponse =
  /** status 200  */ ProgramStatsRo;
export type EmployeeControllerGetStatsApiArg = void;
export type EmployeeControllerGetCourseReportApiResponse =
  /** status 200  */ PaginatedCourseReportRo;
export type EmployeeControllerGetCourseReportApiArg = {
  course: string;
  /** Search by name or email */
  search?: string;
  /** Filter by training status */
  status?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type EmployeeControllerGetBodyAggregationApiResponse =
  /** status 200  */ DiscomfortSummaryRo;
export type EmployeeControllerGetBodyAggregationApiArg = {
  course: string;
  /** Dot-notated path within courseData */
  dataPath?: string;
};
export type EmployeeControllerFindOneApiResponse =
  /** status 200  */ EmployeeDetailRo;
export type EmployeeControllerFindOneApiArg = {
  id: string;
};
export type EmployeeControllerUpdateApiResponse =
  /** status 200  */ EmployeeDetailRo;
export type EmployeeControllerUpdateApiArg = {
  id: string;
  updateEmployeeDto: UpdateEmployeeDto;
};
export type EmployeeControllerRemoveApiResponse = unknown;
export type EmployeeControllerRemoveApiArg = {
  id: string;
};
export type EmployeeControllerAddTrainingApiResponse =
  /** status 201  */ TrainingRo;
export type EmployeeControllerAddTrainingApiArg = {
  id: string;
  addTrainingDto: AddTrainingDto;
};
export type EmployeeControllerUpdateTrainingApiResponse =
  /** status 200  */ TrainingRo;
export type EmployeeControllerUpdateTrainingApiArg = {
  id: string;
  trainingId: string;
  updateTrainingDto: UpdateTrainingDto;
};
export type EmployeeControllerRemoveTrainingApiResponse = unknown;
export type EmployeeControllerRemoveTrainingApiArg = {
  id: string;
  trainingId: string;
};
export type EmployeeControllerReceiveLmsDataApiResponse =
  /** status 200 Data received successfully */ {
    success?: boolean;
    message?: string;
  };
export type EmployeeControllerReceiveLmsDataApiArg = {
  lmsPayloadDto: LmsPayloadDto;
};
export type OrganizationControllerCreateApiResponse =
  /** status 201  */ OrganizationDetailRo;
export type OrganizationControllerCreateApiArg = {
  createOrganizationDto: CreateOrganizationDto;
};
export type OrganizationControllerFindAllApiResponse =
  /** status 200  */ OrganizationListItemRo[];
export type OrganizationControllerFindAllApiArg = void;
export type OrganizationControllerFindOneApiResponse =
  /** status 200  */ OrganizationDetailRo;
export type OrganizationControllerFindOneApiArg = {
  id: string;
};
export type OrganizationControllerUpdateApiResponse =
  /** status 200  */ OrganizationDetailRo;
export type OrganizationControllerUpdateApiArg = {
  id: string;
  updateOrganizationDto: UpdateOrganizationDto;
};
export type OrganizationControllerRemoveApiResponse = unknown;
export type OrganizationControllerRemoveApiArg = {
  id: string;
};
export type OrganizationControllerRegenerateApiKeyApiResponse =
  /** status 200  */ OrganizationDetailRo;
export type OrganizationControllerRegenerateApiKeyApiArg = {
  id: string;
};
export type OrganizationControllerGetUsersApiResponse =
  /** status 200  */ UserRo[];
export type OrganizationControllerGetUsersApiArg = {
  id: string;
};
export type OrganizationControllerAddUserApiResponse =
  /** status 201  */ UserRo;
export type OrganizationControllerAddUserApiArg = {
  id: string;
  addOrgUserDto: AddOrgUserDto;
};
export type OrganizationControllerUpdateUserApiResponse =
  /** status 200  */ UserRo;
export type OrganizationControllerUpdateUserApiArg = {
  id: string;
  userId: string;
  updateOrgUserDto: UpdateOrgUserDto;
};
export type OrganizationControllerRemoveUserApiResponse = unknown;
export type OrganizationControllerRemoveUserApiArg = {
  id: string;
  userId: string;
};
export type OrganizationControllerSyncFromEwihubApiResponse =
  /** status 200  */ SyncResultRo;
export type OrganizationControllerSyncFromEwihubApiArg = {
  id: string;
  syncEwihubDto: SyncEwihubDto;
};
export type UserRo = {
  /** User ID */
  id: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email address */
  email: string;
  /** Username */
  username: string;
  /** User role */
  role: "superAdmin" | "orgUser";
  /** Organization ID */
  organization?: string;
  /** User creation timestamp */
  createdAt: string;
  /** User update timestamp */
  updatedAt: string;
};
export type CreateUserDto = {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email address */
  email: string;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /** User role */
  role?: "superAdmin" | "orgUser";
  /** Organization ID (required for orgUser role) */
  organization?: string;
};
export type UpdateUserDto = {
  /** Username */
  username?: string;
  /** Password */
  password?: string;
  /** User role */
  role?: "superAdmin" | "orgUser";
  /** Organization ID */
  organization?: string;
};
export type LoginRo = {
  /** JWT access token */
  access_token: string;
};
export type LoginDto = {
  /** Username */
  username: string;
  /** Password */
  password: string;
};
export type SignupRo = {
  /** User ID */
  id: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email address */
  email: string;
  /** Username */
  username: string;
  /** User creation timestamp */
  createdAt: string;
};
export type SignupDto = {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email address */
  email: string;
  /** Username */
  username: string;
  /** Password (min 8 chars, must include letter and number) */
  password: string;
};
export type ProfileRo = {
  /** User ID */
  id: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email address */
  email: string;
  /** Username */
  username: string;
  /** User role */
  role: string;
  /** Organization ID */
  organization?: string;
  /** User creation timestamp */
  createdAt: string;
  /** User update timestamp */
  updatedAt: string;
};
export type ForgetPasswordRo = {
  /** Success message */
  message: string;
  /** Reset token (only returned in development mode for testing) */
  resetToken?: string;
};
export type ForgetPasswordDto = {
  /** User email address */
  email: string;
};
export type ResetPasswordRo = {
  /** Success message */
  message: string;
};
export type ResetPasswordDto = {
  /** Password reset token received via email */
  token: string;
  /** New password */
  newPassword: string;
};
export type DemographicRo = {
  age?: string;
  heightRaw?: string;
  heightInches?: number;
  handedness?: string;
  wearsBifocals?: boolean;
  visualIssue?: string;
  computerTime?: string;
  dualMonitors?: boolean;
  usesLaptop?: boolean;
  sitToStand?: string;
  chairAdjustable?: boolean;
};
export type DiscomfortRo = {
  area: string;
  severity?: number;
};
export type IssuesRo = {
  recommendations?: string[];
  actionItems?: string[];
  suggestions?: string[];
  result?: string;
  raw?: string;
  other?: string[];
};
export type BodyPartDiscomfortRo = {
  /** Body part key */
  bodyPart:
    | "upperBack"
    | "midBack"
    | "lowerBack"
    | "buttocks"
    | "head"
    | "neck"
    | "eyes"
    | "leftShoulder"
    | "rightShoulder"
    | "leftUpperArm"
    | "rightUpperArm"
    | "leftElbow"
    | "rightElbow"
    | "leftLowerArm"
    | "rightLowerArm"
    | "leftWrist"
    | "rightWrist"
    | "leftHand"
    | "rightHand"
    | "leftThigh"
    | "rightThigh"
    | "leftKnee"
    | "rightKnee"
    | "leftLowerLeg"
    | "rightLowerLeg"
    | "leftFootOrAnkle"
    | "rightFootOrAnkle";
  /** Non-zero severity level */
  severity: number;
};
export type SelfAssessmentCourseDataRo = {
  demographic?: DemographicRo;
  discomforts?: DiscomfortRo[];
  actions?: string[];
  equipment?: string[];
  issues?: IssuesRo;
  result?: string;
  /** Body parts with non-zero severity */
  bodyPartsDiscomfort?: BodyPartDiscomfortRo[];
};
export type OfficeErgonomicsCourseDataRo = void;
export type TrainingRo = {
  /** Training ID */
  id: string;
  /** Course name */
  course: string;
  /** Training status */
  status: string;
  /** Start date */
  startedDate?: string;
  /** Completion date */
  completedDate?: string;
  /** Course-specific data */
  courseData?: SelfAssessmentCourseDataRo | OfficeErgonomicsCourseDataRo;
};
export type EmployeeDetailRo = {
  /** Employee ID */
  id: string;
  /** Employee full name */
  name: string;
  /** Employee email */
  email: string;
  /** Legacy profile URL */
  oldProfileUrl?: string;
  /** Organization ID */
  organization?: string;
  /** Department name */
  department?: string;
  /** All trainings */
  trainings: TrainingRo[];
  /** Creation timestamp */
  createdAt: string;
  /** Update timestamp */
  updatedAt: string;
};
export type CreateEmployeeDto = {
  /** Employee full name */
  name: string;
  /** Employee email */
  email: string;
  /** Legacy profile URL */
  oldProfileUrl?: string;
};
export type TrainingStatusRo = {
  /** Course name */
  course: string;
  /** Training status */
  status: string;
};
export type EmployeeListItemRo = {
  /** Employee ID */
  id: string;
  /** Employee full name */
  name: string;
  /** Employee email */
  email: string;
  /** Legacy profile URL */
  oldProfileUrl?: string;
  /** Status per course */
  trainingStatuses: TrainingStatusRo[];
};
export type PaginationMetaRo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export type PaginatedEmployeesRo = {
  data: EmployeeListItemRo[];
  meta: PaginationMetaRo;
};
export type CourseStatsRo = {
  course: string;
  enrolled: number;
  completed: number;
  inProgress: number;
  /** Status breakdown */
  statusBreakdown: object;
};
export type ProgramStatsRo = {
  totalEmployees: number;
  courses: CourseStatsRo[];
  completionRate: number;
};
export type CourseReportRowRo = {
  /** Employee ID */
  employeeId: string;
  /** Employee name */
  name: string;
  /** Employee email */
  email: string;
  /** Legacy profile URL */
  oldProfileUrl?: string;
  /** Course name */
  course: string;
  /** Training status */
  status: string;
  /** Start date */
  startedDate?: string;
  /** Completion date */
  completedDate?: string;
  /** Course-specific result extracted from courseData */
  result?: string;
};
export type PaginatedCourseReportRo = {
  data: CourseReportRowRo[];
  meta: PaginationMetaRo;
};
export type BodyPartAggregationRo = {
  /** Body part key */
  key: string;
  /** Number of reports */
  count: number;
  /** Sum of severity values */
  totalSeverity: number;
  /** Average severity */
  avgSeverity: number;
};
export type DiscomfortSummaryRo = {
  /** Count per body part */
  countData: object;
  /** Average severity per body part */
  avgData: object;
  /** Detailed aggregation per body part */
  details: BodyPartAggregationRo[];
};
export type UpdateEmployeeDto = {
  /** Employee full name */
  name?: string;
  /** Employee email */
  email?: string;
  /** Legacy profile URL */
  oldProfileUrl?: string;
};
export type DemographicDto = {
  age?: string;
  heightRaw?: string;
  heightInches?: number;
  handedness?: string;
  wearsBifocals?: boolean;
  visualIssue?: string;
  computerTime?: string;
  dualMonitors?: boolean;
  usesLaptop?: boolean;
  sitToStand?: string;
  chairAdjustable?: boolean;
};
export type DiscomfortDto = {
  area: string;
  severity?: number;
};
export type IssuesDto = {
  recommendations?: string[];
  actionItems?: string[];
  suggestions?: string[];
  result?: string;
  raw?: string;
  other?: string[];
};
export type BodyPartDiscomfortDto = {
  /** Body part key */
  bodyPart:
    | "upperBack"
    | "midBack"
    | "lowerBack"
    | "buttocks"
    | "head"
    | "neck"
    | "eyes"
    | "leftShoulder"
    | "rightShoulder"
    | "leftUpperArm"
    | "rightUpperArm"
    | "leftElbow"
    | "rightElbow"
    | "leftLowerArm"
    | "rightLowerArm"
    | "leftWrist"
    | "rightWrist"
    | "leftHand"
    | "rightHand"
    | "leftThigh"
    | "rightThigh"
    | "leftKnee"
    | "rightKnee"
    | "leftLowerLeg"
    | "rightLowerLeg"
    | "leftFootOrAnkle"
    | "rightFootOrAnkle";
  /** Non-zero severity level */
  severity: number;
};
export type SelfAssessmentCourseDataDto = {
  demographic?: DemographicDto;
  discomforts?: DiscomfortDto[];
  actions?: string[];
  equipment?: string[];
  issues?: IssuesDto;
  result?: string;
  /** Body parts with non-zero severity */
  bodyPartsDiscomfort?: BodyPartDiscomfortDto[];
};
export type OfficeErgonomicsCourseDataDto = void;
export type AddTrainingDto = {
  /** Course name */
  course: string;
  /** Training status */
  status: string;
  /** Training start date */
  startedDate?: string;
  /** Training completion date */
  completedDate?: string;
  /** Course-specific data payload */
  courseData?: SelfAssessmentCourseDataDto | OfficeErgonomicsCourseDataDto;
};
export type UpdateTrainingDto = {
  /** Training status */
  status?: string;
  /** Training start date */
  startedDate?: string;
  /** Training completion date */
  completedDate?: string;
  /** Course-specific data payload */
  courseData?: SelfAssessmentCourseDataDto | OfficeErgonomicsCourseDataDto;
};
export type LmsPayloadDto = {
  /** Learner identifier */
  id: string;
  /** Learner email */
  email: string;
  /** Learner full name */
  name: string;
  /** Department */
  department: string;
  /** Course slug */
  course: string;
  /** Training status */
  status: "started" | "finished";
  /** Organization API key */
  apiKey: string;
  /** Course-specific data payload (null for started, object for finished) */
  data?: object;
};
export type OrganizationDetailRo = {
  /** Organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Abbreviated name */
  abbreviation: string;
  /** Notes */
  notes?: string;
  /** Logo URL */
  logo?: string;
  /** API Key */
  apiKey: string;
  /** Enabled courses */
  courses: string[];
  /** Enable departments */
  enableDepartments: boolean;
  /** Is active */
  active: boolean;
  /** Organization users */
  users: UserRo[];
  /** Departments */
  departments: string[];
  /** Creation timestamp */
  createdAt: string;
  /** Update timestamp */
  updatedAt: string;
};
export type CreateOrganizationDto = {
  /** Organization full name */
  name: string;
  /** Abbreviated name */
  abbreviation: string;
  /** Optional notes */
  notes?: string;
  /** Logo URL or base64 */
  logo?: string;
  /** Enabled courses */
  courses?: string[];
  /** Enable department tracking */
  enableDepartments?: boolean;
  /** Whether organization is active */
  active?: boolean;
};
export type OrganizationListItemRo = {
  /** Organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Abbreviated name */
  abbreviation: string;
  /** Logo URL */
  logo?: string;
  /** API Key */
  apiKey: string;
  /** Enabled courses */
  courses: string[];
  /** Enable departments */
  enableDepartments: boolean;
  /** Is active */
  active: boolean;
};
export type UpdateOrganizationDto = {
  /** Organization full name */
  name?: string;
  /** Abbreviated name */
  abbreviation?: string;
  /** Optional notes */
  notes?: string;
  /** Logo URL or base64 */
  logo?: string;
  /** Enabled courses */
  courses?: string[];
  /** Enable department tracking */
  enableDepartments?: boolean;
  /** Whether organization is active */
  active?: boolean;
};
export type AddOrgUserDto = {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** User email */
  email: string;
  /** Username */
  username: string;
  /** User password */
  password: string;
};
export type UpdateOrgUserDto = {
  /** Username */
  username?: string;
  /** User password */
  password?: string;
};
export type SyncResultRo = {
  /** Whether the sync completed */
  success: boolean;
  /** Human-readable summary */
  message: string;
  /** Number of profiles scraped */
  totalScraped: number;
  /** New employees created */
  created: number;
  /** Existing employees updated */
  updated: number;
  /** Per-employee errors (non-fatal) */
  errors: string[];
};
export type SyncEwihubDto = {
  /** EWI Hub login email (organization user credential) */
  email: string;
  /** EWI Hub login password */
  password: string;
};
export const {
  useUserControllerCreateMutation,
  useUserControllerFindAllQuery,
  useLazyUserControllerFindAllQuery,
  useUserControllerFindOneQuery,
  useLazyUserControllerFindOneQuery,
  useUserControllerUpdateMutation,
  useUserControllerRemoveMutation,
  useAuthControllerLoginMutation,
  useAuthControllerSignupMutation,
  useAuthControllerGetProfileQuery,
  useLazyAuthControllerGetProfileQuery,
  useAuthControllerForgetPasswordMutation,
  useAuthControllerResetPasswordMutation,
  useEmployeeControllerCreateMutation,
  useEmployeeControllerFindAllQuery,
  useLazyEmployeeControllerFindAllQuery,
  useEmployeeControllerGetStatsQuery,
  useLazyEmployeeControllerGetStatsQuery,
  useEmployeeControllerGetCourseReportQuery,
  useLazyEmployeeControllerGetCourseReportQuery,
  useEmployeeControllerGetBodyAggregationQuery,
  useLazyEmployeeControllerGetBodyAggregationQuery,
  useEmployeeControllerFindOneQuery,
  useLazyEmployeeControllerFindOneQuery,
  useEmployeeControllerUpdateMutation,
  useEmployeeControllerRemoveMutation,
  useEmployeeControllerAddTrainingMutation,
  useEmployeeControllerUpdateTrainingMutation,
  useEmployeeControllerRemoveTrainingMutation,
  useEmployeeControllerReceiveLmsDataMutation,
  useOrganizationControllerCreateMutation,
  useOrganizationControllerFindAllQuery,
  useLazyOrganizationControllerFindAllQuery,
  useOrganizationControllerFindOneQuery,
  useLazyOrganizationControllerFindOneQuery,
  useOrganizationControllerUpdateMutation,
  useOrganizationControllerRemoveMutation,
  useOrganizationControllerRegenerateApiKeyMutation,
  useOrganizationControllerGetUsersQuery,
  useLazyOrganizationControllerGetUsersQuery,
  useOrganizationControllerAddUserMutation,
  useOrganizationControllerUpdateUserMutation,
  useOrganizationControllerRemoveUserMutation,
  useOrganizationControllerSyncFromEwihubMutation,
} = injectedRtkApi;
