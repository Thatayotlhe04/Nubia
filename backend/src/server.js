import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for feedback endpoint
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: { error: 'Too many feedback submissions. Please try again later.' }
});

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/topics - List all topics
app.get('/api/topics', (req, res) => {
  try {
    const topics = db.prepare(`
      SELECT id, title, description, category, display_order
      FROM topics
      ORDER BY display_order ASC
    `).all();

    res.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// GET /api/topics/:id - Get single topic with all related data
app.get('/api/topics/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Get topic
    const topic = db.prepare(`
      SELECT * FROM topics WHERE id = ?
    `).get(id);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Get formulas
    const formulas = db.prepare(`
      SELECT * FROM formulas 
      WHERE topic_id = ? 
      ORDER BY display_order ASC
    `).all(id);

    // Parse JSON fields in formulas
    const parsedFormulas = formulas.map(f => ({
      ...f,
      variables: JSON.parse(f.variables)
    }));

    // Get examples
    const examples = db.prepare(`
      SELECT * FROM examples 
      WHERE topic_id = ? 
      ORDER BY display_order ASC
    `).all(id);

    // Parse JSON fields in examples
    const parsedExamples = examples.map(e => ({
      ...e,
      steps: JSON.parse(e.steps)
    }));

    // Get calculator config
    const calculator = db.prepare(`
      SELECT * FROM calculators WHERE topic_id = ?
    `).get(id);

    const parsedCalculator = calculator ? {
      ...calculator,
      inputs: JSON.parse(calculator.inputs)
    } : null;

    res.json({
      topic: {
        ...topic,
        formulas: parsedFormulas,
        examples: parsedExamples,
        calculator: parsedCalculator
      }
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// GET /api/formulas - Get formulas with optional topic filter
app.get('/api/formulas', (req, res) => {
  try {
    const { topicId } = req.query;

    let query = 'SELECT * FROM formulas';
    let params = [];

    if (topicId) {
      query += ' WHERE topic_id = ?';
      params.push(topicId);
    }

    query += ' ORDER BY display_order ASC';

    const formulas = db.prepare(query).all(...params);

    const parsedFormulas = formulas.map(f => ({
      ...f,
      variables: JSON.parse(f.variables)
    }));

    res.json({ formulas: parsedFormulas });
  } catch (error) {
    console.error('Error fetching formulas:', error);
    res.status(500).json({ error: 'Failed to fetch formulas' });
  }
});

// GET /api/examples - Get examples with optional topic filter
app.get('/api/examples', (req, res) => {
  try {
    const { topicId } = req.query;

    let query = 'SELECT * FROM examples';
    let params = [];

    if (topicId) {
      query += ' WHERE topic_id = ?';
      params.push(topicId);
    }

    query += ' ORDER BY display_order ASC';

    const examples = db.prepare(query).all(...params);

    const parsedExamples = examples.map(e => ({
      ...e,
      steps: JSON.parse(e.steps)
    }));

    res.json({ examples: parsedExamples });
  } catch (error) {
    console.error('Error fetching examples:', error);
    res.status(500).json({ error: 'Failed to fetch examples' });
  }
});

// POST /api/feedback - Submit anonymous feedback
app.post('/api/feedback', feedbackLimiter, (req, res) => {
  try {
    const { message, pageContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
    }

    const result = db.prepare(`
      INSERT INTO feedback (message, page_context)
      VALUES (?, ?)
    `).run(message, pageContext || null);

    res.status(201).json({ 
      success: true, 
      id: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// GET /api/categories - Get unique categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT DISTINCT category FROM topics ORDER BY category ASC
    `).all();

    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Nubia API server running on port ${PORT}`);
});

export default app;
