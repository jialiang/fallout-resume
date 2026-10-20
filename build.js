import { build } from "esbuild";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const outputDirectory = "docs";
const staticDirectory = "src/static";

// esbuild doesn't read browserslist, so its queries ("chrome >= 61") are
// turned into esbuild targets ("chrome61"). Safari on iOS is "ios" there.
const { browserslist } = JSON.parse(readFileSync("package.json", "utf8"));
const target = browserslist.map((query) => query.replace("ios_saf", "ios").replace(" >= ", ""));

rmSync(outputDirectory, { recursive: true, force: true });

const { outputFiles } = await build({
  entryPoints: ["src/index.js", "src/index.css"],
  bundle: true,
  minify: true,
  target,
  // Third-party notices are shown on the #licenses screen instead.
  legalComments: "none",
  outdir: outputDirectory,
  external: ["*.woff2", "*.png"],
  write: false,
});

const bundled = (extension) => outputFiles.find((file) => file.path.endsWith(extension)).text;

// Replaced with functions because the bundled code can contain "$&" and the
// like, which a replacement string would expand.
const html = readFileSync("src/index.html", "utf8")
  .replace('<link rel="stylesheet" href="index.css" />', () => `<style>${bundled(".css")}</style>`)
  .replace('<script src="index.js"></script>', () => `<script>${bundled(".js")}</script>`);

if (html.includes('href="index.css"') || html.includes('src="index.js"')) {
  throw new Error("Couldn't inline the bundle: the tags in src/index.html changed");
}

cpSync(staticDirectory, outputDirectory, { recursive: true });
writeFileSync(`${outputDirectory}/index.html`, html);
