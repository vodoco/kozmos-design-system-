import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import YAML from "yaml";

const workflow = YAML.parse(
  fs.readFileSync(".github/workflows/release.yml", "utf8"),
);
const source = JSON.stringify(workflow);

test("publication has only a manual trigger and read-only default permissions", () => {
  assert.deepEqual(Object.keys(workflow.on), ["workflow_dispatch"]);
  assert.deepEqual(workflow.permissions, { contents: "read", actions: "read" });
  for (const input of ["sha", "ci_run_id", "confirmation"]) {
    assert.equal(workflow.on.workflow_dispatch.inputs[input].required, true);
  }
  assert.equal(workflow.concurrency["cancel-in-progress"], false);
});

test("build and publish are separate, SHA-pinned, approval-gated jobs", () => {
  assert.ok(workflow.jobs.prepare);
  assert.equal(workflow.jobs.publish.needs, "prepare");
  assert.equal(workflow.jobs.publish.environment, "npm-release");
  for (const job of Object.values(workflow.jobs)) {
    const checkout = job.steps.find((step) =>
      step.uses?.startsWith("actions/checkout@"),
    );
    assert.equal(checkout.with.ref, "${{ inputs.sha }}");
    assert.equal(checkout.with["persist-credentials"], false);
    assert.ok(
      job.steps.some(
        (step) => step.run === "node scripts/release/verify-request.mjs",
      ),
    );
    for (const step of job.steps.filter((s) => s.uses)) {
      assert.match(step.uses, /@[a-f0-9]{40}$/);
    }
  }
});

test("only final publish step receives npm credential; no implicit publisher or rebuild", () => {
  assert.doesNotMatch(
    JSON.stringify(workflow.jobs.prepare),
    /secrets\.NPM_TOKEN/,
  );
  assert.doesNotMatch(JSON.stringify(workflow.env ?? {}), /NPM_TOKEN/);
  const publish = workflow.jobs.publish;
  assert.doesNotMatch(JSON.stringify(publish.env ?? {}), /secrets\.NPM_TOKEN/);
  const credentialSteps = publish.steps.filter((s) =>
    JSON.stringify(s).includes("secrets.NPM_TOKEN"),
  );
  assert.equal(credentialSteps.length, 1);
  assert.equal(credentialSteps[0].run, "node scripts/release/publish.mjs");
  assert.doesNotMatch(
    source,
    /changesets\/action|changeset publish|pnpm release/,
  );
  assert.doesNotMatch(JSON.stringify(publish), /turbo run build/);
  assert.equal(publish.steps.at(-1), credentialSteps[0]);
});

test("local release alias cannot publish and CI exercises the safety tests", () => {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.equal(pkg.scripts.release, "node scripts/release/local-release.mjs");
  const ci = YAML.parse(fs.readFileSync(".github/workflows/ci.yml", "utf8"));
  assert.ok(ci.jobs.web.steps.some((s) => s.run === "pnpm test:release"));
});
