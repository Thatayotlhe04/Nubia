// Vercel Serverless Function for Review Replies
// Admin-only endpoint with password protection

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://xeehtoxfleyvydnqznxg.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZWh0b3hmbGV5dnlkbnF6bnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTkzMzAsImV4cCI6MjA4NTM3NTMzMH0.7ry95_wLdyTgDUwjQ4EO401HF31ddCrHV-1bGW72JbI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin password - change this to something secure!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nubia2026';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST - Submit a reply (admin only)
  if (req.method === 'POST') {
    try {
      const { review_id, reply_text, password } = req.body;

      // Verify admin password
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      if (!review_id || !reply_text || typeof reply_text !== 'string' || reply_text.trim().length === 0) {
        return res.status(400).json({ error: 'Review ID and reply text are required' });
      }

      if (reply_text.length > 500) {
        return res.status(400).json({ error: 'Reply too long (max 500 characters)' });
      }

      const { data, error } = await supabase
        .from('review_replies')
        .insert([{
          review_id: review_id,
          reply_text: reply_text.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      const reply = {
        id: data.id,
        text: data.reply_text,
        date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      return res.status(201).json({ success: true, reply });
    } catch (error) {
      console.error('Error saving reply:', error);
      return res.status(500).json({ error: 'Failed to save reply' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
