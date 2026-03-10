import { api as generatedApi } from "./generatedApi";

export const api = generatedApi
  .enhanceEndpoints({
    endpoints: {},
  })
  .injectEndpoints({
    endpoints: (build) => ({}),
    overrideExisting: true,
  });
