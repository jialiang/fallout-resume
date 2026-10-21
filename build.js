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

const now = new Date();
const pad = (number) => String(number).padStart(2, "0");

const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());

// Midnight of the build day in local time, e.g. "2026-10-21T00:00:00+08:00".
// Google wants a full datetime with a timezone.
function getBuildDateTime() {
  const offsetMinutes = -now.getTimezoneOffset();
  const sign = offsetMinutes < 0 ? "-" : "+";
  const hours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const minutes = pad(Math.abs(offsetMinutes) % 60);

  return `${year}-${month}-${day}T00:00:00${sign}${hours}:${minutes}`;
}

// Replaced with functions because the bundled code can contain "$&" which a replacement string would expand.
const html = readFileSync("src/index.html", "utf8")
  .replace('<link rel="stylesheet" href="index.css" />', () => `<style>${bundled(".css")}</style>`)
  .replace('<script src="index.js"></script>', () => `<script>${bundled(".js")}</script>`)
  .replace('"dateModified": "BUILD_TIME"', () => `"dateModified": "${getBuildDateTime()}"`)
  .replace("<span>BUILD_DATE</span>", () => `<span>${day}/${month}/${year}</span>`);

if (html.includes('href="index.css"') || html.includes('src="index.js"')) {
  throw new Error("Couldn't inline the bundle: the tags in src/index.html changed");
}

cpSync(staticDirectory, outputDirectory, { recursive: true });
writeFileSync(`${outputDirectory}/index.html`, html);
