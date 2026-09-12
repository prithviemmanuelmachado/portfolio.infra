# Commit Lint (reusable workflow)

`.github/workflows/commitlint.yml`

CI-side enforcement of the commit-message policy: a Conventional Commits
type prefix (`feat:`, `fix:`, ...) plus a GitHub closing keyword referencing
an issue (`Fixes #12`, `Closes #12`, `Resolves #12`). Runs
[commitlint](https://commitlint.js.org/) over every commit in the PR using
the consumer repo's own `commitlint.config.js`.

This is the half of the policy that can't be bypassed — pair it with the
local husky `commit-msg` hook (fast feedback, but skippable with
`--no-verify` or simply not running `npm install`).

## Wiring up a consumer repo

1. Copy [`templates/commitlint/commitlint.config.js`](../../templates/commitlint/commitlint.config.js)
   into the repo's root.
2. Add `@commitlint/cli` and `@commitlint/config-conventional` as
   devDependencies (needed by both the hook and this workflow).
3. Add the caller workflow:

```yaml
# .github/workflows/commitlint.yml
name: Commit Lint

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    uses: prithviemmanuelmachado/portfolio.infra/.github/workflows/commitlint.yml@main
```

## Local hook (husky)

```bash
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional
npm pkg set scripts.prepare="husky"
npx husky init   # or: mkdir -p .husky && git config core.hooksPath .husky
```

Then create `.husky/commit-msg`:

```sh
npx --no -- commitlint --edit "$1"
```

...and make it executable (`chmod +x .husky/commit-msg`). Anyone who runs
`npm install` after cloning gets the hook automatically via the `prepare`
script.
