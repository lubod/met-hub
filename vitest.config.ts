import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["common/**/*.ts", "server/**/*.ts"],
      exclude: ["server/main.ts", "server/store.ts", "**/*.d.ts"],
      reporter: ["text", "html"],
    },
  },
});
