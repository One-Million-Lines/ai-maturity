# AI Maturity

## Project Name

AI Maturity

## What it does

AI Maturity is a browser-based assessment that helps a user evaluate organizational AI readiness. It guides the user through a structured questionnaire and produces scores, blockers, strengths, recommendations, and a staged roadmap.

## Why it exists

The project turns a qualitative AI-readiness conversation into a consistent self-assessment flow backed by explicit scoring rules stored in JSON configuration files.

## Features

- Landing page that explains the assessment and its four maturity dimensions
- Multi-section questionnaire with required questions and progress tracking
- Local persistence using Zustand so users can continue later in the same browser
- Results page with overall score, maturity level, archetype, blockers, strengths, recommendations, and roadmap
- Visual result components including gauges, score cards, tabs, and a radar chart
- Pure client-side scoring engine driven by JSON rules

## How it works

- `src/config/questions.json` defines sections, questions, and answer options.
- `src/config/scoring.json` defines dimension weights, maturity levels, archetypes, strengths, and consistency rules.
- `src/config/recommendations.json` and `src/config/roadmap-rules.json` provide follow-up output rules.
- `src/engine/scoringEngine.ts` computes the final assessment result.
- `src/store/assessmentStore.ts` manages answers, session progress, persistence, and result generation.
- The app is fully client-side and does not depend on a backend service.

## Tech stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Radix UI / shadcn-style UI components
- React Router 7
- Zustand
- Recharts
- Lucide React

## Project structure

```text
src/
├── components/
│   ├── assessment/   # question flow and navigation
│   ├── layout/       # shell and top navigation
│   ├── results/      # score and recommendation UI
│   ├── ui/           # shared UI primitives
│   └── FloatingNav.tsx
├── config/           # questions, scoring, recommendations, roadmap rules
├── engine/           # scoring engine
├── pages/            # landing, assessment, results
├── store/            # Zustand store
├── types/
└── main.tsx
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The Vite dev server is configured for port `5308`.

### Build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Configuration

- No project-specific environment variables are required.
- The app uses Vite's `BASE_URL` for routing.
- In production, the configured base path is `/demo/ai-maturity/`.

## Usage

1. Start at the landing page.
2. Complete each assessment section.
3. Submit the assessment to compute results.
4. Review the score, archetype, blockers, recommendations, and roadmap.
5. Revisit or retake the assessment as needed.

## Development

Useful commands:

```bash
npm run dev
npm run lint
npm run build
```

If you change question IDs or answer option IDs, update the scoring, recommendation, and roadmap rule files that depend on them.

## Roadmap

There is no formal public roadmap documented in this repository yet. The current implementation focuses on a static-config, client-side assessment flow.

## Contributing

Contributions are welcome. Please review [CONTRIBUTING.md](./CONTRIBUTING.md) and [public.md](./public.md) before opening a pull request.

## License

This project is available under the [MIT License](./LICENSE).
