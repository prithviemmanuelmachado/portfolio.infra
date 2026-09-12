# Semantic Version (reusable workflow)

`.github/workflows/semantic-version.yml`

Bumps a semver git tag from [Conventional Commits](https://www.conventionalcommits.org/)
on push to a branch, updates `CHANGELOG.md`, creates a GitHub Release, and
outputs the version for the caller. It does **not** touch any in-repo
version file (`package.json`, `pyproject.toml`, ...) — that's the calling
repo's call, via a follow-up job reading the outputs.

## Commit convention

Commit subjects on the release branch must follow Conventional Commits for
the bump to work as expected:

- `fix: ...` -> patch (1.0.0 -> 1.0.1)
- `feat: ...` -> minor (1.0.0 -> 1.1.0)
- `feat!: ...` or a `BREAKING CHANGE:` footer -> major (1.0.0 -> 2.0.0)
- other types (`chore:`, `docs:`, `refactor:`, `test:`, ...) -> no release

## Wiring up a consumer repo

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    uses: prithviemmanuelmachado/portfolio.infra/.github/workflows/semantic-version.yml@main
    permissions:
      contents: write
      issues: write
      pull-requests: write
```

### Doing something with the version

Add a job that depends on `release` and reads its outputs:

```yaml
  bump-version-file:
    needs: release
    if: needs.release.outputs.released == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { ref: main }
      - run: echo "Releasing ${{ needs.release.outputs.version }} (${{ needs.release.outputs.tag }})"
        # e.g. `poetry version`, `npm version --no-git-tag-version`, build & push a
        # Docker image tagged with the version, etc. — commit + push if the repo
        # needs the bump to land in git, on whichever branch makes sense for it.
```

## Custom release config

If the repo has its own `.releaserc.json` / `release.config.js` (or a
`release` key in `package.json`), it's used as-is — semantic-release's
normal config resolution. Otherwise the workflow falls back to
[`templates/release/.releaserc.json`](../../templates/release/.releaserc.json)
in this repo.

Plugins beyond `@semantic-release/changelog` and `@semantic-release/git`
(already installed by the workflow) need to be either:
- listed as devDependencies in the repo's own `package.json`, or
- passed via the `extra-plugins` input (one per line).

## Outputs

| Output | Description |
|---|---|
| `version` | Released version, e.g. `1.4.0`. Empty if no release was made. |
| `released` | `'true'`/`'false'` |
| `tag` | Git tag created, e.g. `v1.4.0` |
