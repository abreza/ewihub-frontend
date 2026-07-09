import { api as generatedApi } from "./generatedApi";
import type {
  EmployeeControllerUploadAttachmentApiArg,
  EmployeeControllerUploadAttachmentApiResponse,
  EmployeeControllerUploadAttachmentsBulkApiArg,
  EmployeeControllerUploadAttachmentsBulkApiResponse,
} from "./generatedApi";

export type NoteRo = {
  id: string;
  content: string;
  createdBy: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeControllerListNotesApiResponse = NoteRo[];
export type EmployeeControllerListNotesApiArg = { id: string };

export type EmployeeControllerAddNoteApiResponse = NoteRo;
export type EmployeeControllerAddNoteApiArg = {
  id: string;
  createNoteDto: { content: string };
};

export type EmployeeControllerUpdateNoteApiResponse = NoteRo;
export type EmployeeControllerUpdateNoteApiArg = {
  id: string;
  noteId: string;
  updateNoteDto: { content: string };
};

export type EmployeeControllerRemoveNoteApiResponse = void;
export type EmployeeControllerRemoveNoteApiArg = {
  id: string;
  noteId: string;
};

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

      employeeControllerListNotes: build.query<
        EmployeeControllerListNotesApiResponse,
        EmployeeControllerListNotesApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/notes`,
        }),
        providesTags: ["Employees"],
      }),

      employeeControllerAddNote: build.mutation<
        EmployeeControllerAddNoteApiResponse,
        EmployeeControllerAddNoteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/notes`,
          method: "POST",
          body: queryArg.createNoteDto,
        }),
        invalidatesTags: ["Employees"],
      }),

      employeeControllerUpdateNote: build.mutation<
        EmployeeControllerUpdateNoteApiResponse,
        EmployeeControllerUpdateNoteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/notes/${queryArg.noteId}`,
          method: "PATCH",
          body: queryArg.updateNoteDto,
        }),
        invalidatesTags: ["Employees"],
      }),

      employeeControllerRemoveNote: build.mutation<
        EmployeeControllerRemoveNoteApiResponse,
        EmployeeControllerRemoveNoteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.id}/notes/${queryArg.noteId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Employees"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useEmployeeControllerUploadAttachmentMutation,
  useEmployeeControllerUploadAttachmentsBulkMutation,
  useEmployeeControllerListNotesQuery,
  useEmployeeControllerAddNoteMutation,
  useEmployeeControllerUpdateNoteMutation,
  useEmployeeControllerRemoveNoteMutation,
} = api;