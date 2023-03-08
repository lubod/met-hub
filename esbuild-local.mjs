import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

esbuild.build({
  entryPoints: [
    "test/testDom.ts",
    "test/testStationGarni1025Arcus.ts",
    "test/testStationGoGenMe3900.ts",
  ],
  bundle: true,
  platform: "node",
  outdir: "esdist/test",
  external: ["pg-native"],
  target: "node16",
  minify: false,
});

esbuild.build({
  entryPoints: ["client/index.tsx"],
  bundle: true,
  platform: "browser",
  outdir: "esdist/fe",
  external: [""],
  target: "es2022",
  plugins: [sassPlugin()],
  minify: false,
});

esbuild.build({
  entryPoints: ["server/main.ts", "server/store.ts"],
  bundle: true,
  platform: "node",
  outdir: "esdist/be",
  external: ["pg-native"],
  target: "node16",
  minify: false,
});

// let { host, port } = await ctx.serve({
//   servedir: 'esdist/fe',
// })
