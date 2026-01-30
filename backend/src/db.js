import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '..', 'data');
const dbPath = join(dataDir, 'nubia.db');

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize SQL.js
const SQL = await initSqlJs();

// Load existing database or create new one
let db;
if (existsSync(dbPath)) {
  const buffer = readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.run(`
  -- Topics table
  CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  -- Formulas table
  CREATE TABLE IF NOT EXISTS formulas (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    name TEXT NOT NULL,
    latex TEXT NOT NULL,
    explanation TEXT NOT NULL,
    variables TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
  )
`);

db.run(`
  -- Examples table
  CREATE TABLE IF NOT EXISTS examples (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    title TEXT NOT NULL,
    scenario TEXT NOT NULL,
    steps TEXT NOT NULL,
    final_answer TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
  )
`);

db.run(`
  -- Calculator configs table
  CREATE TABLE IF NOT EXISTS calculators (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    inputs TEXT NOT NULL,
    formula_key TEXT NOT NULL,
    output_label TEXT NOT NULL,
    output_unit TEXT,
    output_decimals INTEGER DEFAULT 2,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
  )
`);

db.run(`
  -- Feedback table
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    page_context TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create indexes
db.run('CREATE INDEX IF NOT EXISTS idx_formulas_topic ON formulas(topic_id)');
db.run('CREATE INDEX IF NOT EXISTS idx_examples_topic ON examples(topic_id)');
db.run('CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category)');
db.run('CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(display_order)');

// Save database helper
export function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
}

// Wrapper to make sql.js API more like better-sqlite3
const dbWrapper = {
  prepare(sql) {
    return {
      run(...params) {
        db.run(sql, params);
        saveDatabase();
        return { changes: db.getRowsModified() };
      },
      get(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      }
    };
  },
  exec(sql) {
    db.run(sql);
    saveDatabase();
  }
};

export default dbWrapper;
