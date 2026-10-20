# Releasing

Feature work lands on `develop`. Production ships only when `develop` is promoted to `main`.

## Feature branches

Open pull requests against `develop`. Squash merges are fine there. Nothing merges directly into `main`.

## Production release

`develop` reaches `main` only through a release pull request:

- Head: `develop`
- Base: `main`
- Merge method: a merge commit. Do not squash or rebase this pull request.

The release owner (Infra & Security bot) opens and merges that pull request after QA passes on [dev.toprostr.com](https://dev.toprostr.com) and Grok Bot or the user approves the production release.

## Deploys

Every push to `main` auto-deploys production: [toprostr.com](https://toprostr.com), Vercel project `toprostr-landing`.

`develop` deploys [dev.toprostr.com](https://dev.toprostr.com). Pull requests get protected Vercel preview links.

## Hotfixes

If anything lands on `main` directly, merge `main` back into `develop` right away. Use a merge commit, not cherry-picks, so the branches stay aligned.

## Drift check

`main` must be an ancestor of `develop`. This command must succeed (exit 0), and it is checked daily:

```bash
git merge-base --is-ancestor origin/main origin/develop
```

## Branch protection

**`main`**

- Pull request required
- `landing-ci` must pass
- Merge commits only
- No force pushes

**`develop`**

- Pull request required
- `landing-ci` must pass
- No force pushes
