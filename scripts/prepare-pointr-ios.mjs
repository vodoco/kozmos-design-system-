// Import explicitly supplied local vendor artifacts and the user-approved QA
// bootstrap page. Never evaluate the page or print its credential values.
import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const [sdk, maplibre, bootstrap] = process.argv.slice(2);
if (!sdk || !maplibre || !bootstrap)
  throw new Error(
    "Usage: node scripts/prepare-pointr-ios.mjs <PointrKit.xcframework> <MapLibre.xcframework> <QA websdk.html>",
  );
const app = fileURLToPath(
  new URL("../apps/PointrPlayground/", import.meta.url),
);
const version = (framework) =>
  JSON.parse(
    execFileSync(
      "plutil",
      ["-convert", "json", "-o", "-", join(framework, "Info.plist")],
      { encoding: "utf8" },
    ),
  );
for (const [path, name] of [
  [sdk, "PointrKit"],
  [maplibre, "MapLibre"],
]) {
  const info = version(resolve(path));
  if (
    !info.AvailableLibraries.some(
      (x) =>
        x.SupportedPlatformVariant === "simulator" &&
        x.SupportedArchitectures.includes("arm64"),
    )
  )
    throw new Error(`${name} needs an arm64 simulator slice`);
}
const sdkInfo = version(
  join(resolve(sdk), "ios-arm64_x86_64-simulator/PointrKit.framework"),
);
if (sdkInfo.CFBundleShortVersionString !== "10.3.0")
  throw new Error("Expected PointrKit 10.3.0");
const mapInfo = version(
  join(resolve(maplibre), "ios-arm64_x86_64-simulator/MapLibre.framework"),
);
if (mapInfo.CFBundleShortVersionString !== "6.27.0")
  throw new Error(
    "Expected the approved MapLibre 6.27.0.1 artifact (framework version 6.27.0)",
  );
const html = readFileSync(resolve(bootstrap), "utf8");
const config = {};
for (const key of ["baseUrl", "clientIdentifier", "licenseKey"]) {
  const matches = [
    ...html.matchAll(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`, "g")),
  ];
  if (matches.length !== 1 || !matches[0][1].trim())
    throw new Error(
      `Expected exactly one literal ${key}; no JavaScript is evaluated`,
    );
  config[key] = matches[0][1];
}
if (new URL(config.baseUrl).origin !== "https://design-qa-v10.pointr.cloud")
  throw new Error("Only the approved Design-QA origin is allowed");
config.siteId = "b7a72429-7bd1-4355-a650-729efd198d92";
config.buildingId = "54523ee9-93e2-4ca0-870f-88b012fb80dd";
const local = join(app, ".local");
mkdirSync(local, { recursive: true, mode: 0o700 });
for (const [path, name] of [
  [sdk, "PointrKit"],
  [maplibre, "MapLibre"],
]) {
  const destination = join(local, `${name}.xcframework`);
  if (existsSync(destination))
    throw new Error(
      `${name} already installed; use a fresh checkout or inspect the existing artifact before replacing it`,
    );
  cpSync(resolve(path), destination, {
    recursive: true,
    errorOnExist: true,
    force: false,
  });
}
const resources = join(app, "Sources/App/Resources");
mkdirSync(resources, { recursive: true });
writeFileSync(
  join(resources, "QAConfig.json"),
  JSON.stringify(config, null, 2) + "\n",
  { mode: 0o600, flag: "wx" },
);
console.log(
  "QA artifacts and configuration prepared locally. Credentials were not printed; do not distribute this development app bundle.",
);
