// Vercel Serverless Function for Reviews
// Uses Supabase for persistent storage

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://xeehtoxfleyvydnqznxg.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZWh0b3hmbGV5dnlkbnF6bnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTkzMzAsImV4cCI6MjA4NTM3NTMzMH0.7ry95_wLdyTgDUwjQ4EO401HF31ddCrHV-1bGW72JbI';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (reviewsError) throw reviewsError;

      // Fetch all replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('review_replies')
        .select('*')
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      // Group replies by review_id
      const repliesByReview = (repliesData || []).reduce((acc, reply) => {
        if (!acc[reply.review_id]) acc[reply.review_id] = [];
        acc[reply.review_id].push({
          id: reply.id,
          text: reply.reply_text,
          date: new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
        return acc;
      }, {});

      // Transform to match frontend format
      const reviews = (reviewsData || []).map(r => ({
        id: r.id,
        text: r.text,
        name: r.name || 'Anonymous',
        course: r.course || 'Student',
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: r.created_at,
        replies: repliesByReview[r.id] || []
      }));

      return res.status(200).json({ reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews', reviews: [] });
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

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          text: text.trim(),
          name: (name && name.trim()) || 'Anonymous',
          course: (course && course.trim()) || 'Student'
        }])
        .select()
        .single();

      if (error) throw error;

      const review = {
        id: data.id,
        text: data.text,
        name: data.name,
        course: data.course,
        date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: data.created_at
      };

      return res.status(201).json({ success: true, review });
    } catch (error) {
      console.error('Error saving review:', error);
      return res.status(500).json({ error: 'Failed to save review' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
