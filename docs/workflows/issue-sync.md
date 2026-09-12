# Issue Status Sync (reusable workflow)

`.github/workflows/issue-sync.yml`

Keeps an issue's card on the shared **My portfolio projects** board in sync
with the PR that's addressing it, based on GitHub closing keywords
(`Fixes`/`Closes`/`Resolves #N`) found in the PR title, body, or any of its
commit messages.

| Event | New status |
|---|---|
| PR opened / reopened / new commits pushed | `PR raised` |
| PR merged | `In review` |
| PR closed without merging | `PR rejected` |

If a referenced issue isn't already an item on the board, it's added.

## Prerequisites

1. The board's `Status` single-select field must have options named exactly
   `PR raised`, `PR rejected`, and `In review` (override the names via
   inputs if you'd rather use different labels).
2. A classic PAT with `repo` + `project` scopes, stored as a secret named
   `PROJECTS_TOKEN` in **each** consumer repo. The default `GITHUB_TOKEN`
   can't read/write a user-level Projects (v2) board.

## Wiring up a consumer repo

```yaml
# .github/workflows/issue-sync.yml
name: Issue Status Sync

on:
  pull_request:
    types: [opened, reopened, synchronize, closed]
    branches: [main]

jobs:
  sync:
    uses: prithviemmanuelmachado/portfolio.infra/.github/workflows/issue-sync.yml@main
    with:
      project-number: <PROJECT_NUMBER>   # from the project URL, e.g. .../projects/3 -> 3
    secrets:
      projects-token: ${{ secrets.PROJECTS_TOKEN }}
```

Commit messages/PR bodies need an actual closing keyword — plain `#12`
without `fixes`/`closes`/`resolves` in front of it is ignored by design, to
match GitHub's own auto-close semantics and avoid false positives.
