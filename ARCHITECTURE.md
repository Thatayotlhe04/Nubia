# Nubia Architecture

This document describes the technical architecture and design decisions for Nubia.

## Overview

Nubia is a full-stack web application built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + SQLite (better-sqlite3)
- **Math Rendering**: KaTeX

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │                 React App                        │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │   │
│  │  │  Pages  │  │Components│  │  Calculator.js  │  │   │
│  │  └────┬────┘  └────┬────┘  └────────┬────────┘  │   │
│  │       │            │                │            │   │
│  │       └────────────┴────────────────┘            │   │
│  │                    │                             │   │
│  │              ┌─────┴─────┐                       │   │
│  │              │  api.js   │                       │   │
│  │              └─────┬─────┘                       │   │
│  └────────────────────┼─────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────┘
                        │ HTTP/JSON
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Express Server                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                  server.js                       │   │
│  │                                                  │   │
│  │   GET /api/topics    GET /api/formulas          │   │
│  │   GET /api/topics/:id   POST /api/feedback      │   │
│  │                                                  │   │
│  └─────────────────────┬───────────────────────────┘   │
│                        │                                │
│                  ┌─────┴─────┐                          │
│                  │   db.js   │                          │
│                  └─────┬─────┘                          │
└────────────────────────┼────────────────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  nubia.db   │
                  │  (SQLite)   │
                  └─────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
└── Layout
    ├── Header
    ├── Sidebar
    └── <Outlet>
        ├── Home (index route)
        └── Topic
            ├── TopicContent
            ├── FormulaBlock[]
            ├── Calculator
            ├── ExampleBlock[]
            └── FeedbackForm
```

### State Management

- **React Router** for navigation state
- **Local component state** for UI interactions
- **useOutletContext** for shared data between layout and pages

No global state management library is needed due to the read-heavy, content-focused nature of the application.

### Styling System

Tailwind CSS with a custom design system:

```
Colors:
  nubia-bg        #FAFAF8    Background
  nubia-surface   #FFFFFF    Cards, surfaces
  nubia-text      #1A1A1A    Primary text
  nubia-accent    #4A5568    Interactive elements

Typography:
  serif   Source Serif 4    Body text, content
  sans    DM Sans           UI, headings
  mono    JetBrains Mono    Formulas, code
```

## Backend Architecture

### Database Schema

```sql
topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,       -- Markdown-like content
  category TEXT NOT NULL,
  display_order INTEGER
)

formulas (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES topics(id),
  name TEXT NOT NULL,
  latex TEXT NOT NULL,         -- KaTeX-compatible LaTeX
  explanation TEXT NOT NULL,
  variables TEXT NOT NULL,     -- JSON array
  display_order INTEGER
)

examples (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES topics(id),
  title TEXT NOT NULL,
  scenario TEXT NOT NULL,
  steps TEXT NOT NULL,         -- JSON array
  final_answer TEXT NOT NULL,
  display_order INTEGER
)

calculators (
  id TEXT PRIMARY KEY,
  topic_id TEXT UNIQUE REFERENCES topics(id),
  title TEXT NOT NULL,
  inputs TEXT NOT NULL,        -- JSON array of input configs
  formula_key TEXT NOT NULL,   -- Links to calculator.js function
  output_label TEXT NOT NULL,
  output_unit TEXT,
  output_decimals INTEGER
)

feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  page_context TEXT,
  created_at DATETIME
)
```

### API Design

RESTful endpoints with JSON responses:

```javascript
// Success response
{ "topics": [...] }

// Single resource
{ "topic": { ... } }

// Error response
{ "error": "Message" }
```

## Calculator Engine

All calculations run client-side in `calculator.js`:

```javascript
// Formula functions are pure and deterministic
function calculateFutureValue(pv, r, n) {
  const rate = r > 1 ? r / 100 : r;
  return pv * Math.pow(1 + rate, n);
}

// Step generation for educational display
function generateFVSteps(inputs, result) {
  return [
    { label: 'Substitute values', content: '...' },
    { label: 'Calculate factor', content: '...' },
    { label: 'Final result', content: '...' }
  ];
}
```

Key design decisions:
1. **Client-side only**: No server round-trips for calculations
2. **Percentage handling**: Auto-converts percentages > 1 to decimals
3. **Step-by-step output**: Educational value through transparency

## Security Considerations

1. **Rate limiting** on feedback endpoint (10 requests per 15 minutes)
2. **Input validation** for all API endpoints
3. **No authentication required** (read-only educational content)
4. **CORS enabled** for development proxy

## Performance

1. **SQLite** for simple, fast local database
2. **Vite** for fast development and optimized production builds
3. **KaTeX** for fast math rendering (vs MathJax)
4. **Tailwind** purges unused CSS in production

## Extensibility

Adding a new topic:
1. Add topic data to `seed.js`
2. Include formulas, examples, calculator config
3. If new formula type, add function to `calculator.js`
4. Re-run `npm run seed`

Adding a new calculator type:
1. Add formula function to `calculator.js`
2. Add step generator function
3. Register in `calculate()` switch statement
4. Configure in database via seed
