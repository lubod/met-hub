import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { execSync } from "child_process";
import fs from "fs";

execSync("npx tailwindcss -i client/styles.css -o public/tailwind.css --minify", { stdio: "inherit" });

let googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!googleClientId && fs.existsSync("met-hub.env")) {
  const envContent = fs.readFileSync("met-hub.env", "utf8");
  const match = envContent.match(/^REACT_APP_GOOGLE_CLIENT_ID=(.+)$/m);
  if (match) {
    googleClientId = match[1].trim().replace(/^['"]|['"]$/g, "");
  }
}

if (!googleClientId) {
  throw new Error("REACT_APP_GOOGLE_CLIENT_ID environment variable is not set. Please set it or add it to met-hub.env.");
}

const define = {
  "process.env.REACT_APP_GOOGLE_CLIENT_ID": JSON.stringify(googleClientId),
};

esbuild.build({
  entryPoints: [
    "test/test.ts",
  ],
  bundle: true,
  platform: "node",
  outdir: "esdist/test",
  external: ["pg-native"],
  target: "node24",
  minify: true,
  define,
});

esbuild.build({
  entryPoints: ["client/index.tsx"],
  bundle: true,
  platform: "browser",
  outdir: "esdist/fe",
  external: [""],
  target: "es2022",
  plugins: [sassPlugin()],
  minify: true,
  define,
});

esbuild.build({
  entryPoints: ["server/main.ts", "server/store.ts"],
  bundle: true,
  platform: "node",
  outdir: "esdist/be",
  external: ["pg-native"],
  target: "node24",
  minify: true,
  define,
});
