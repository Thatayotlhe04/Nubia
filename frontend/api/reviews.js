// Vercel Serverless Function for Reviews
// Uses Vercel KV (Redis) for persistent storage

// In-memory fallback storage (resets on cold start, but works for demo)
// For production, connect to Vercel KV, Supabase, or another database
let reviewsStore = [];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Fetch all reviews
  if (req.method === 'GET') {
    try {
      // Sort by date (newest first)
      const sortedReviews = [...reviewsStore].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      return res.status(200).json({ reviews: sortedReviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  // POST - Submit a new review
  if (req.method === 'POST') {
    try {
      const { text, name, course } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Review text is required' });
      }

      if (text.length > 1000) {
        return res.status(400).json({ error: 'Review too long (max 1000 characters)' });
      }

      const newReview = {
        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        name: (name && name.trim()) || 'Anonymous',
        course: (course && course.trim()) || 'UB Student',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
      };

      // Add to store
      reviewsStore.unshift(newReview);

      // Keep only last 100 reviews to prevent memory issues
      if (reviewsStore.length > 100) {
        reviewsStore = reviewsStore.slice(0, 100);
      }

      return res.status(201).json({ 
        success: true, 
        review: newReview 
      });
    } catch (error) {
      console.error('Error saving review:', error);
      return res.status(500).json({ error: 'Failed to save review' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
