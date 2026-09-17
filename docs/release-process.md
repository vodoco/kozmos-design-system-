# Controlled npm releases

Status: implemented locally on `astra/release-safeguards`, based on merged PR #53
(`040f53d`). Not pushed or activated. No release is approved: `release/plan.json`
intentionally contains an empty package list. No credentials, repository settings,
package versions, npm tags or publications were changed.

This replaces the old `workflow_run` publisher. Adding `NPM_TOKEN` must never be
enough to publish. The old workflow on main remains in effect until this change
is reviewed and merged; do not add a token before then.

## What the workflow requires

1. A reviewed, committed `release/plan.json` listing exact public package names,
   versions and the explicit `next` or `latest` npm tag. Only listed packages ship.
   Versions must match workspace manifests; private/unknown/duplicate packages and
   unversioned changesets are rejected. Prerelease versions cannot use `latest`.
2. A successful **main-push** run of `.github/workflows/ci.yml` for that exact SHA
   in this repository. Every job must have succeeded, including web and both native
   jobs. PR runs, skipped jobs, forks and unrelated workflows are not evidence.
3. A manual dispatch **from main**, with the full lowercase 40-character SHA,
   the CI run ID and the exact confirmation `publish <SHA>`. The dispatch commit,
   checkout and candidate SHA must agree. The candidate must still be main HEAD
   at each verification, including after the approval wait.
4. Repository variable `NPM_RELEASE_ENABLED=true`, a configured `npm-release`
   environment with required reviewers and an exact main branch policy, and
   approval of that environment's publishing job.

Global concurrency serializes releases without cancelling a running publish.
There is no automatic version PR, publication, git tag or GitHub release. Changesets
still manage versions/changelogs through `pnpm changeset` and
`pnpm version-packages` on a reviewed branch. `pnpm release` deliberately exits
with instructions; do not replace it with direct `changeset publish`.

## Exact tested artifacts

The prepare job checks out the requested SHA, builds without npm credentials and
runs the existing package-install test. Only when the type, export, server-render
and React 18/19 README checks pass does it retain the **same tarballs** in an artifact.
The candidate manifest binds package identities, SHA-512 integrity and a digest of
the release plan to the source SHA. CI also exercises this export/readback path in
an isolated fixture; that fixture never edits the real release plan.

The publish job waits for environment approval, checks out the same SHA and
revalidates live CI/environment/main evidence. It downloads the exact artifact ID
from its own prepare job, checks hashes and packed manifests, and does not rebuild
or repack. Install scripts are disabled in both jobs' dependency installation;
the npm token is supplied only to the final publishing step. Third-party actions
in the release workflow are pinned to commit SHAs. The GitHub token has read-only
contents/actions permissions and checkout does not persist it.

Before the first write, the publisher checks registry availability, version
collisions and internal dependency availability. Selected dependencies publish
before dependants; omitted internal dependencies must have a published version
satisfying the packed range. Cycles fail for explicit investigation. Publishing
uses the public npm registry, public access, the approved tag and disabled lifecycle
scripts. Private-repository provenance remains disabled, per the existing ruling.

This proves source identity and tested package bytes, **not** reproducible builds,
provenance, visual approval or product/device readiness. CI does not build the exact
artifact later produced by prepare; prepare independently tests what it will ship.

## Owner setup — deliberately not performed by the agent

- Keep `NPM_RELEASE_ENABLED` absent/false until the release checklist is complete.
- Configure `npm-release` with named required reviewers and a selected branch rule
  for `main` (not a wildcard or tag). Disable administrator bypass in the UI;
  consider preventing self-review when another maintainer is available. The REST
  environment response does not expose the bypass setting, so code does not claim
  to verify it. Administrators and trusted workflow authors remain a trust boundary.
- This repository is private. GitHub documents required-reviewer restrictions on
  private repositories depending on the account plan. Confirm the setting is
  available before promising this workflow is operational. If unavailable, stop
  and choose a supported approval mechanism/account configuration explicitly—do
  not remove the gate or make the repository public as a workaround.
- Only after explicit authorization, provision a suitably restricted npm token as
  the **environment** secret `NPM_TOKEN`, not a repository-wide secret. Confirm
  ownership and publish access for the `@kozmos` scope. No token exists in this work.
- Protect main and the release workflow/plan from unreviewed edits as part of
  repository governance. Local scripts cannot prevent an administrator or someone
  already holding an npm token from bypassing the workflow outside GitHub.

GitHub references: [environment protection and plan restrictions](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments),
[environment REST permissions](https://docs.github.com/en/rest/deployments/environments),
[deployment branch policies](https://docs.github.com/en/rest/deployments/branch-policies).

## Operating a future approved release

1. Close the browser/WebView policy, device/native/product integration,
   accessibility/motion, visual and package-type release blockers. Green CI alone
   does not approve them. In particular, Chromatic's pending UI Tests is not a pass.
2. Version through Changesets, then review the resulting manifests/changelogs and
   exact release plan together. Begin with an explicitly chosen prerelease on `next`;
   the checked-in empty plan is not an implied choice of versions.
3. Merge after CI, wait for successful main-push CI and record its run ID/SHA.
   A documentation-only main commit can have no push CI due to path exclusions;
   do not substitute an older SHA or PR run. Prepare a reviewed release commit that
   actually triggers CI instead.
4. Dispatch `Release Kozmos System` from main with those inputs. Review the candidate
   artifact and plan before approving `npm-release`. If main advances during the
   wait, validation fails: repeat against newly tested main, not a moving checkout.
5. Check each package version, integrity and dist-tag. The script verifies these
   after each publish; registry propagation/network trouble stops it for inspection.
   Record the result in release notes. Git tags and GitHub releases need a separate
   explicit action; this workflow has no write permission for them.

## Failure and recovery

npm publication is not transactional. A later package can fail after an earlier one
has published. Do not unpublish, overwrite, retag, bump versions or rerun blindly.
Inspect the workflow artifact and registry first. A retry skips an existing version
only if its integrity and requested dist-tag exactly match. Different bytes or a
changed tag fail before any write. A rebuilt artifact may differ; preserve the original
artifact for recovery (retention is seven days). Rerunning a failed publish job can
reuse its prepare artifact, subject to approval and current-main checks. If the artifact
expired, main moved or registry state differs, stop for a separately reviewed recovery
plan. Never delete a released version to make the tests pass.

## Validation evidence

Four workflow regression tests failed against the original configuration before
the replacement. A later retry-tag regression failed before its preflight correction.
The other safety tests are additional coverage, not claimed as old reproduced bugs.

Measured locally: **35 release tests passed**, all package builds passed, ordinary
React 18/19 tarball checks passed (14 exports, three CommonJS entries and 11 README
samples), and the isolated export smoke test verified all four retained real-package
tarballs. The three known declaration issues remain unchanged. ESLint, frozen-lockfile
installation, diff checks and Actionlint 1.7.12 passed. Actionlint checked workflow
syntax/expressions with its optional shellcheck/pyflakes integrations disabled; those
external tools were not installed. The official Actionlint archive digest was verified
against its GitHub release metadata before running it from a temporary directory.

```sh
pnpm test:release
pnpm --filter './packages/*' build
pnpm packages:install:check
pnpm test:release:packages
pnpm exec eslint scripts/release scripts/check-package-install.mjs
pnpm install --frozen-lockfile --ignore-scripts
git diff --check
```

No live dispatch or npm write has been tested. Environment approval, restricted-token
permissions and real registry publication require owner setup and a separately approved
release rehearsal. Native/Figma/component behavior is unchanged by this batch.
