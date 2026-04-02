import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { execSync } from "child_process";

execSync("npx tailwindcss -i client/styles.css -o public/tailwind.css --minify", { stdio: "inherit" });

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  || "370836834849-c28glrv23rmribefn7r7h9m1rori3vfh.apps.googleusercontent.com";
if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
  console.warn("REACT_APP_GOOGLE_CLIENT_ID not set, using default");
}

const define = {
  "process.env.ENV": '"prod"',
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
