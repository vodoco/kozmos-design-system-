/**
 * Compile both native packages, the way CI's iOS Build and Android Build jobs
 * do, so a Swift or Kotlin mistake is caught here instead of eight minutes into
 * a pull request.
 *
 * Written 2026-09-08, after the native elevation rollout went to CI with its
 * Kotlin half unverified. Not because compiling Android locally was hard — the
 * SDK was already installed at ~/Library/Android/sdk — but because Gradle had
 * no way to find it: ANDROID_HOME was unset and packages/android/local.properties
 * did not exist. The whole gap was one line of machine-local config that nothing
 * told anyone to write.
 *
 * So this reports how to fix a missing toolchain rather than only that one is
 * missing, and skips rather than fails when a platform genuinely cannot be built
 * here — a Linux checkout has no Xcode, and that is not an error.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const only = process.argv[2];
const results = [];

function run(label, command, args, cwd) {
  const started = Date.now();
  const r = spawnSync(command, args, {
    cwd: path.join(ROOT, cwd),
    encoding: "utf8",
  });
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const output = `${r.stdout || ""}${r.stderr || ""}`;
  results.push({ label, ok: r.status === 0, seconds, output });
  return r.status === 0;
}

if (!only || only === "ios") {
  if (os.platform() !== "darwin") {
    results.push({ label: "iOS", skipped: "not macOS — Swift needs Xcode" });
  } else if (
    spawnSync("swift", ["--version"], { encoding: "utf8" }).status !== 0
  ) {
    results.push({
      label: "iOS",
      skipped: "swift is not on PATH — install Xcode or the command line tools",
    });
  } else {
    run("iOS", "swift", ["build"], "packages/ios");
  }
}

if (!only || only === "android") {
  const localProps = path.join(ROOT, "packages/android/local.properties");
  const sdkGuess = path.join(os.homedir(), "Library/Android/sdk");
  const configured =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    (fs.existsSync(localProps) &&
      /sdk\.dir=/.test(fs.readFileSync(localProps, "utf8")));

  if (!configured && fs.existsSync(sdkGuess)) {
    results.push({
      label: "Android",
      skipped:
        `the SDK is installed at ${sdkGuess} but Gradle cannot find it. Fix with:\n` +
        `             echo "sdk.dir=${sdkGuess}" > packages/android/local.properties\n` +
        `           local.properties is gitignored, so it stays on this machine.`,
    });
  } else if (!configured) {
    results.push({
      label: "Android",
      skipped:
        "no Android SDK found. Install one, then point at it with\n" +
        "           packages/android/local.properties (sdk.dir=...) or ANDROID_HOME.",
    });
  } else {
    run(
      "Android",
      "./gradlew",
      ["compileDebugKotlin", "--console=plain", "-q"],
      "packages/android",
    );
  }
}

console.log("Native builds\n");
let failed = 0;
for (const r of results) {
  if (r.skipped) {
    console.log(`  skip  ${r.label}: ${r.skipped}`);
    continue;
  }
  if (r.ok) {
    console.log(`  ok    ${r.label} compiles (${r.seconds}s)`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${r.label} did not compile (${r.seconds}s)\n`);
    const lines = r.output.split("\n").filter((l) => l.trim());
    for (const line of lines.slice(-25)) console.log(`        ${line}`);
    console.log("");
  }
}

console.log(
  `\n${failed === 0 ? "ok    native packages compile" : `${failed} native package(s) did not compile`}`,
);
process.exit(failed === 0 ? 0 : 1);
