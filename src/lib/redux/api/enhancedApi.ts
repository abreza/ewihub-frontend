import { api as generatedApi } from "./generatedApi";
import type {
  EmployeeControllerUploadAttachmentApiArg,
  EmployeeControllerUploadAttachmentApiResponse,
  EmployeeControllerUploadAttachmentsBulkApiArg,
  EmployeeControllerUploadAttachmentsBulkApiResponse,
} from "./generatedApi";

export const api = generatedApi
  .enhanceEndpoints({
    endpoints: {},
  })
  .injectEndpoints({
    endpoints: (build) => ({
      employeeControllerUploadAttachment: build.mutation<
        EmployeeControllerUploadAttachmentApiResponse,
        EmployeeControllerUploadAttachmentApiArg
      >({
        query: (queryArg) => {
          const formData = new FormData();
          formData.append("file", queryArg.body.file);
          if (queryArg.body.label) {
            formData.append("label", queryArg.body.label);
          }
          return {
            url: `/api/employees/${queryArg.id}/attachments`,
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["Employees"],
      }),

      employeeControllerUploadAttachmentsBulk: build.mutation<
        EmployeeControllerUploadAttachmentsBulkApiResponse,
        EmployeeControllerUploadAttachmentsBulkApiArg
      >({
        query: (queryArg) => {
          const formData = new FormData();
          for (const file of queryArg.body.files) {
            formData.append("files", file);
          }
          return {
            url: `/api/employees/${queryArg.id}/attachments/bulk`,
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["Employees"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useEmployeeControllerUploadAttachmentMutation,
  useEmployeeControllerUploadAttachmentsBulkMutation,
} = api;