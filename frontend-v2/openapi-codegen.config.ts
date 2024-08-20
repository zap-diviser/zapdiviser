import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";

export default defineConfig({
  zapdiviser: {
    from: {
      source: "url",
      url: "http://127.0.0.1:8000/api-json",
    },
    outputDir: "src/hooks/api",
    to: async (context) => {
      const filenamePrefix = "zapdiviser";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
