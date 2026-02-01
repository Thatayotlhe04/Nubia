/**
 * Notes Service
 *
 * Handles notes storage with dual-mode support:
 * - Guest users: localStorage
 * - Authenticated users: Supabase database
 *
 * Features:
 * - Automatic storage mode detection
 * - Migration from localStorage to cloud on login
 * - Optimistic updates with error handling
 */
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

/**
 * Create a new note object
 * @param {Object} params - Note parameters
 * @returns {Object} Note object
 */
function createNote({ topicId = null, content = '', title = '' }) {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    topic_id: topicId,
    title: title || 'Untitled Note',
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Get all notes from localStorage
 * @returns {Array} Array of notes
 */
export function getLocalNotes() {
  return getStorageItem(STORAGE_KEYS.NOTES, []);
}

/**
 * Save notes to localStorage
 * @param {Array} notes - Notes to save
 */
export function saveLocalNotes(notes) {
  setStorageItem(STORAGE_KEYS.NOTES, notes);
}

/**
 * Get notes for the current user (local or cloud)
 * @param {Object} user - Current user object (null for guest)
 * @param {string} topicId - Optional topic filter
 * @returns {Promise<Array>} Array of notes
 */
export async function getNotes(user, topicId = null) {
  // Guest mode - use localStorage
  if (!user) {
    const notes = getLocalNotes();
    if (topicId) {
      return notes.filter(n => n.topic_id === topicId);
    }
    return notes;
  }

  // Authenticated mode - use Supabase
  const supabase = getSupabase();
  if (!supabase) {
    return getLocalNotes();
  }

  try {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (topicId) {
      query = query.eq('topic_id', topicId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      // Fallback to local notes on error
      return getLocalNotes();
    }

    return data || [];
  } catch (error) {
    console.error('Error in getNotes:', error);
    return getLocalNotes();
  }
}

/**
 * Save a note (create or update)
 * @param {Object} user - Current user object (null for guest)
 * @param {Object} noteData - Note data
 * @returns {Promise<Object>} Saved note
 */
export async function saveNote(user, noteData) {
  const now = new Date().toISOString();

  // Guest mode - use localStorage
  if (!user) {
    const notes = getLocalNotes();
    const existingIndex = notes.findIndex(n => n.id === noteData.id);

    let note;
    if (existingIndex >= 0) {
      // Update existing
      note = { ...notes[existingIndex], ...noteData, updated_at: now };
      notes[existingIndex] = note;
    } else {
      // Create new
      note = createNote(noteData);
      notes.unshift(note);
    }

    saveLocalNotes(notes);
    return note;
  }

  // Authenticated mode - use Supabase
  const supabase = getSupabase();
  if (!supabase) {
    // Fallback to local
    return saveNote(null, noteData);
  }

  try {
    if (noteData.id && !noteData.id.startsWith('note-')) {
      // Update existing cloud note
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: noteData.title,
          content: noteData.content,
          topic_id: noteData.topic_id,
          updated_at: now,
        })
        .eq('id', noteData.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new cloud note
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: noteData.title || 'Untitled Note',
          content: noteData.content || '',
          topic_id: noteData.topic_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
}

/**
 * Delete a note
 * @param {Object} user - Current user object (null for guest)
 * @param {string} noteId - Note ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteNote(user, noteId) {
  // Guest mode - use localStorage
  if (!user) {
    const notes = getLocalNotes();
    const filtered = notes.filter(n => n.id !== noteId);
    saveLocalNotes(filtered);
    return true;
  }

  // Authenticated mode - use Supabase
  const supabase = getSupabase();
  if (!supabase) {
    return deleteNote(null, noteId);
  }

  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

/**
 * Check if there are local notes to migrate
 * @returns {boolean} True if there are local notes
 */
export function hasLocalNotesToMigrate() {
  const notes = getLocalNotes();
  return notes.length > 0;
}

/**
 * Migrate local notes to cloud storage
 * @param {Object} user - Authenticated user
 * @returns {Promise<Object>} Migration result
 */
export async function migrateLocalNotesToCloud(user) {
  if (!user) {
    throw new Error('User must be authenticated to migrate notes');
  }

  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const localNotes = getLocalNotes();
  if (localNotes.length === 0) {
    return { migrated: 0, failed: 0 };
  }

  let migrated = 0;
  let failed = 0;

  for (const note of localNotes) {
    try {
      await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: note.title,
          content: note.content,
          topic_id: note.topic_id,
          created_at: note.created_at,
          updated_at: note.updated_at,
        });
      migrated++;
    } catch (error) {
      console.error('Error migrating note:', error);
      failed++;
    }
  }

  // Clear local notes after successful migration
  if (migrated > 0 && failed === 0) {
    saveLocalNotes([]);
  }

  return { migrated, failed };
}

/**
 * Get note count (for showing in UI)
 * @param {Object} user - Current user
 * @returns {Promise<number>} Note count
 */
export async function getNoteCount(user) {
  if (!user) {
    return getLocalNotes().length;
  }

  const supabase = getSupabase();
  if (!supabase) {
    return getLocalNotes().length;
  }

  try {
    const { count, error } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting note count:', error);
    return 0;
  }
}
