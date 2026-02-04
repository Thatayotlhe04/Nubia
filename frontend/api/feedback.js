// Vercel Serverless Function for Feedback
// Uses Supabase for persistent storage

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - requires env vars to be set
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!supabase) {
    return res.status(503).json({ error: 'Service unavailable: database not configured' });
  }

  // POST - Submit feedback
  if (req.method === 'POST') {
    try {
      const { message, pageContext, email, university } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Feedback message is required' });
      }

      if (message.length > 2000) {
        return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
      }

      // Validate email if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          message: message.trim(),
          page_context: pageContext || null,
          email: email || null,
          university: university || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ 
        success: true, 
        message: 'Feedback submitted successfully'
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
      return res.status(500).json({ error: 'Failed to save feedback' });
    }
  }

  // GET - Fetch feedback (for admin view)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return res.status(200).json({ feedback: data || [] });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return res.status(500).json({ error: 'Failed to fetch feedback', feedback: [] });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
