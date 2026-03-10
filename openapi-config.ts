import type { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "http://ewihub.posechecker.com/api/swagger-json",
  apiFile: "./src/lib/redux/api/emptyApi.ts",
  apiImport: "emptyApi",
  outputFile: "./src/lib/redux/api/generatedApi.ts",
  exportName: "api",
  hooks: {
    queries: true,
    lazyQueries: true,
    mutations: true,
  },

  tag: true,
};

export default config;
