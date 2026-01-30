# Nubia

A premium finance study companion designed specifically for Motswana university students, particularly those studying finance-related courses at the University of Botswana.

## Philosophy

Nubia provides structured educational content, clear explanations, mathematically correct formulas, and interactive calculators—all delivered through a calm, editorial interface.

**Nubia is NOT:**
- A fintech app or trading platform
- A dashboard or AI chatbot
- A social platform or collaborative editor

**Nubia IS:**
- A structured learning tool
- A finance study companion
- A deterministic calculator system
- Content-driven and scalable

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone or navigate to the project
cd nubia

# Install all dependencies
npm run install:all

# Seed the database with initial content
npm run seed

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Project Structure

```
nubia/
├── package.json              # Root (concurrently, scripts)
├── README.md                 # This file
├── ARCHITECTURE.md           # System design documentation
│
├── backend/                  # Express.js API server
│   ├── package.json
│   ├── data/
│   │   └── nubia.db         # SQLite database (created on seed)
│   └── src/
│       ├── server.js        # Main Express application
│       ├── db.js            # Database connection & schema
│       └── seed.js          # Initial content seeding
│
└── frontend/                 # React application
    ├── index.html           # Single HTML entry point
    ├── package.json
    ├── vite.config.js
    ├── postcss.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Root component with routing
        │
        ├── pages/
        │   ├── Home.jsx     # Landing page with topic list
        │   └── Topic.jsx    # Individual topic view
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.jsx
        │   │   ├── Header.jsx
        │   │   └── Sidebar.jsx
        │   │
        │   ├── content/
        │   │   ├── TopicContent.jsx
        │   │   ├── FormulaBlock.jsx
        │   │   └── ExampleBlock.jsx
        │   │
        │   ├── calculator/
        │   │   └── Calculator.jsx
        │   │
        │   └── feedback/
        │       └── FeedbackForm.jsx
        │
        ├── utils/
        │   ├── api.js       # API client
        │   └── calculator.js # Calculation engine
        │
        └── styles/
            └── index.css    # Tailwind CSS styles
```

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | List all topics |
| GET | `/api/topics/:id` | Get single topic with formulas, examples, calculator |
| GET | `/api/formulas` | Get formulas (optional `?topicId=`) |
| GET | `/api/examples` | Get examples (optional `?topicId=`) |
| POST | `/api/feedback` | Submit anonymous feedback |
| GET | `/api/categories` | List all categories |

## Design Principles

1. **Calm & Editorial**: Muted colors, generous whitespace, serif typography for reading
2. **Academic Focus**: Content optimized for study and comprehension
3. **Deterministic Calculations**: All math runs client-side with step-by-step breakdowns
4. **Botswana Context**: Examples use BWP currency and local scenarios

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

### Example Response

```json
GET /api/topics/time-value-of-money

{
  "topic": {
    "id": "time-value-of-money",
    "title": "Time Value of Money",
    "description": "Understanding the relationship between present and future value",
    "content": "...",
    "formulas": [...],
    "examples": [...],
    "calculator": {...}
  }
}
```

## Adding New Topics

Nubia scales by adding content as data, not complexity as code.

### Step 1: Add the Topic

```sql
INSERT INTO topics (id, title, description, content, category, display_order)
VALUES (
  'internal-rate-of-return',
  'Internal Rate of Return',
  'Finding the discount rate that makes NPV equal to zero',
  '... content in markdown-like format ...',
  'capital-budgeting',
  4
);
```

### Step 2: Add Formulas

```sql
INSERT INTO formulas (id, topic_id, name, latex, explanation, variables, display_order)
VALUES (
  'irr-formula',
  'internal-rate-of-return',
  'Internal Rate of Return',
  '0 = -C_0 + \\sum_{t=1}^{n} \\frac{C_t}{(1 + IRR)^t}',
  'The IRR is the rate that makes the NPV equal to zero.',
  '[{"symbol": "IRR", "name": "Internal Rate of Return", "description": "The discount rate being solved for"}]',
  1
);
```

### Step 3: Add Examples

```sql
INSERT INTO examples (id, topic_id, title, scenario, steps, final_answer, display_order)
VALUES (
  'irr-example-1',
  'internal-rate-of-return',
  'Evaluating a Equipment Purchase',
  'Scenario text...',
  '[{"step": 1, "description": "...", "content": "..."}]',
  'The IRR is approximately 15.2%...',
  1
);
```

### Step 4: Add Calculator Config (Optional)

```sql
INSERT INTO calculators (id, topic_id, title, inputs, formula_key, output_label, output_unit, output_decimals)
VALUES (
  'irr-calculator',
  'internal-rate-of-return',
  'IRR Calculator',
  '[{"id": "c0", "label": "Initial Investment", "type": "number", ...}]',
  'irr-formula',
  'Internal Rate of Return',
  '%',
  2
);
```

**No code changes required.** The frontend dynamically renders based on data structure.

## Calculator Engine

All calculations run client-side in the browser. The backend never performs calculations.

Available formulas:
- `fv-single-sum`: Future Value of a Single Sum
- `pv-single-sum`: Present Value of a Single Sum
- `compound-interest-formula`: Compound Interest with Periodic Compounding
- `effective-annual-rate`: Effective Annual Rate (EAR)
- `npv-formula`: Net Present Value

To add new calculation functions, edit `frontend/src/utils/calculator.js`.

## Design System

### Colors

```css
--nubia-bg: #FAFAF8        /* Page background */
--nubia-surface: #FFFFFF    /* Cards, panels */
--nubia-text: #1A1A1A       /* Primary text */
--nubia-accent: #4A5568     /* Interactive elements */
--nubia-border: #E5E5E3     /* Borders */
```

### Typography

- **Body text**: Source Serif 4 (serif)
- **UI elements**: DM Sans (sans-serif)
- **Formulas/code**: JetBrains Mono (monospace)

### Principles

1. Editorial, documentation-style layout
2. Strong hierarchy
3. High whitespace
4. Calm and professional tone
5. Minimal motion (150–200ms max)

## License

Educational use only. Not for commercial distribution.

---

Built for finance students at any University in Botswana.