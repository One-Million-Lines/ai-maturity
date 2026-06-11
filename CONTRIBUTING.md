# Contributing

Thanks for your interest in improving AI Maturity.

## Before you start

- Read [public.md](./public.md).
- Keep documentation grounded in the actual question, scoring, and results logic in this repository.
- Prefer small, reviewable pull requests.

## Local setup

```bash
npm install
npm run dev
```

## Development guidelines

- Run `npm run lint` and `npm run build` before opening a PR.
- Keep `questions.json`, `scoring.json`, `recommendations.json`, and `roadmap-rules.json` in sync.
- When changing question or option IDs, update any scoring or rule references that depend on them.
- Update `README.md` when setup, scripts, or output behavior changes.

## Pull request checklist

- [ ] The change matches actual app behavior
- [ ] Lint and build pass locally
- [ ] No secrets, local env files, or generated artifacts are included
- [ ] Rule changes are explained clearly in the PR description
