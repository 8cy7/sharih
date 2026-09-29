# Sharih | شارح

**An Arabic AI study platform that turns any PDF into structured, interactive lessons.**

Students upload a textbook or lecture PDF. Sharih reads it, splits it into lessons, and generates for each one a written explanation, narrated audio, an explainer video and a quiz, plus a tutor chat that answers questions about that lesson only.

## Features

- **PDF to learning path:** upload a file and get chapters and lessons in the right order
- **Multi-agent pipeline:** separate agents for reading and splitting, content writing, media production and tutoring
- **Narrated lessons:** Arabic voice-over generated per lesson
- **Explainer videos:** animated visuals rendered by a dedicated worker
- **Quizzes and progress tracking:** per-lesson quizzes with a progress dashboard
- **Lesson tutor:** chat grounded in the current lesson content
- **Demo mode:** pre-rendered content for offline presentations

## Architecture

```
PDF upload
   │
   ▼
Reader / Splitter agent ──► chapters & lessons
   │
   ▼
Content Generator agent ──► explanation + quiz
   │
   ▼
Media Producer agent ──► narration (TTS) + animated video
   │
   ▼
Dashboard · Lesson view · Quiz · Tutor chat
```

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, Recharts |
| Backend | Next.js Route Handlers, pdf-parse |
| AI | Anthropic API (LLM agents), ElevenLabs (Arabic TTS), Manim worker (video) |

## Getting Started

```bash
git clone https://github.com/8cy7/sharih.git
cd sharih
npm install
cp .env.example .env.local   # add your keys
npm run dev
```

Open http://localhost:3000

## Environment Variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | LLM agents |
| `ELEVENLABS_API_KEY` | Text-to-speech |
| `ELEVENLABS_VOICE_ID` | Arabic narrator voice |
| `MANIM_WORKER_URL` | Video rendering worker (optional) |

## Author

**Abdulaziz Alfahad** · Software Engineer · [github.com/8cy7](https://github.com/8cy7)
