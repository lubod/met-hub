import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const define = {
  "process.env.ENV": '"dev"',
  "process.env.REACT_APP_GOOGLE_CLIENT_ID":
    '"370836834849-c28glrv23rmribefn7r7h9m1rori3vfh.apps.googleusercontent.com"',
  "process.env.MY_JWT_SECRET":
    '"woiyt8q3457ohrglhgq834758q347659346739tghrohg"',
};

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
  minify: false,
  define,
});

esbuild.build({
  entryPoints: ["server/main.ts", "server/store.ts"],
  bundle: true,
  platform: "node",
  outdir: "esdist/be",
  external: ["pg-native"],
  target: "node16",
  minify: false,
  define,
});

// let { host, port } = await ctx.serve({
//   servedir: 'esdist/fe',
// })
