import { api as generatedApi } from "./generatedApi";

export const api = generatedApi
  .enhanceEndpoints({
    addTagTypes: ["Employees"],
    endpoints: {},
  })
  .injectEndpoints({
    endpoints: () => ({}),
    overrideExisting: true,
  });
