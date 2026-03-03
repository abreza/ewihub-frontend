import { emptyApi as api } from "./emptyApi";
export const addTagTypes = ["Users", "Auth"] as const;
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
export type UserControllerImportApiResponse = unknown;
export type UserControllerImportApiArg = void;
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
  /** Whether the user is a super user */
  isAdmin: boolean;
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
  /** Whether the user is a super user */
  isAdmin?: boolean;
};
export type UpdateUserDto = {
  /** Username */
  username?: string;
  /** Password */
  password?: string;
  /** Whether the user is a super user */
  isAdmin?: boolean;
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
  /** Whether the user is a super user */
  isAdmin: boolean;
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
} = injectedRtkApi;
