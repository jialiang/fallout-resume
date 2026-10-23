import { AwsClient } from "aws4fetch";
import { build } from "esbuild";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const outputDirectory = "dist";
const staticDirectory = "src/static";

const signedURLLifetimeSeconds = 7 * 24 * 60 * 60;

// Radio stations name their R2 object as src="R2:<key>" in src/index.html.
const r2SourcePattern = /src="R2:([^"]+)"/g;

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

// The radio streams from a private R2 bucket through signed URLs, which R2 caps at 7 days,
// so the scheduler repo re-runs the deploy every 5 days.
// The secrets come from the repo in CI and from a gitignored .env locally.
function createR2Signer() {
  const secretNames = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];
  const missingNames = secretNames.filter((name) => !process.env[name]);

  if (missingNames.length) {
    throw new Error(`Missing ${missingNames.join(", ")} in .env or repo secrets`);
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

  const client = new AwsClient({
    service: "s3",
    region: "auto",
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  });

  const bucketURL = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;

  return async (objectKey) => {
    const url = `${bucketURL}/${objectKey}?X-Amz-Expires=${signedURLLifetimeSeconds}`;
    const signed = await client.sign(new Request(url), { aws: { signQuery: true } });

    return signed.url.replaceAll("&", "&amp;");
  };
}

const sourceHtml = readFileSync("src/index.html", "utf8");
const signURL = createR2Signer();

const objectKeys = Array.from(sourceHtml.matchAll(r2SourcePattern), ([, objectKey]) => objectKey);
const signedURLs = await Promise.all(objectKeys.map(signURL));
const signedURLByKey = new Map(
  objectKeys.map((objectKey, index) => [objectKey, signedURLs[index]])
);

// Replaced with functions because the bundled code can contain "$&" which a replacement string would expand.
const html = sourceHtml
  .replace('<link rel="stylesheet" href="index.css" />', () => `<style>${bundled(".css")}</style>`)
  .replace('<script src="index.js"></script>', () => `<script>${bundled(".js")}</script>`)
  .replace(r2SourcePattern, (match, objectKey) => `src="${signedURLByKey.get(objectKey)}"`)
  .replace('"dateModified": "BUILD_TIME"', () => `"dateModified": "${getBuildDateTime()}"`)
  .replace("<span>BUILD_DATE</span>", () => `<span>${day}/${month}/${year}</span>`);

cpSync(staticDirectory, outputDirectory, { recursive: true });
writeFileSync(`${outputDirectory}/index.html`, html);
