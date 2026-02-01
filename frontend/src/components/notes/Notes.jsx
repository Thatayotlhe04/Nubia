/**
 * Notes Component
 *
 * Personal notes feature for study topics.
 * - Works offline with localStorage for guests
 * - Syncs to cloud for authenticated users
 * - Supports topic-specific notes
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getNotes,
  saveNote,
  deleteNote,
  hasLocalNotesToMigrate,
  migrateLocalNotesToCloud,
} from '../../services/notesService';
import SignInCTA from '../auth/SignInCTA';

/**
 * Notes Component
 * @param {Object} props
 * @param {string} props.topicId - Topic ID for filtering notes
 * @param {string} props.topicTitle - Topic title for display
 * @param {Function} props.onOpenAuth - Callback to open auth modal
 */
function Notes({ topicId = null, topicTitle = '', onOpenAuth }) {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);

  // Load notes
  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getNotes(user, topicId);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, topicId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Check for migration opportunity on login
  useEffect(() => {
    if (isAuthenticated && hasLocalNotesToMigrate()) {
      setShowMigration(true);
    }
  }, [isAuthenticated]);

  // Listen for auth sign-in event
  useEffect(() => {
    const handleSignIn = () => {
      if (hasLocalNotesToMigrate()) {
        setShowMigration(true);
      }
      loadNotes();
    };

    window.addEventListener('nubia:auth:signin', handleSignIn);
    return () => window.removeEventListener('nubia:auth:signin', handleSignIn);
  }, [loadNotes]);

  const handleMigrate = async () => {
    setMigrationStatus('migrating');
    try {
      const result = await migrateLocalNotesToCloud(user);
      setMigrationStatus(`Migrated ${result.migrated} note(s)!`);
      await loadNotes();
      setTimeout(() => {
        setShowMigration(false);
        setMigrationStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('Migration failed. Please try again.');
    }
  };

  const handleSkipMigration = () => {
    setShowMigration(false);
  };

  const handleStartNewNote = () => {
    setEditingNote('new');
    setNoteTitle('');
    setNoteContent('');
    setIsExpanded(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsExpanded(true);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim() && !noteTitle.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        id: editingNote !== 'new' ? editingNote : undefined,
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent.trim(),
        topic_id: topicId,
      };

      await saveNote(user, noteData);
      await loadNotes();
      setEditingNote(null);
      setNoteTitle('');
      setNoteContent('');
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Delete this note?')) return;

    try {
      await deleteNote(user, noteId);
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCancel = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="mt-8 border-t border-nubia-border pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-nubia-text hover:text-nubia-accent transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <h3 className="font-semibold">My Notes</h3>
          {notes.length > 0 && (
            <span className="text-xs text-nubia-text-muted bg-nubia-surface-alt px-2 py-0.5 rounded-full">
              {notes.length}
            </span>
          )}
        </button>

        {isExpanded && !editingNote && (
          <button
            onClick={handleStartNewNote}
            className="flex items-center gap-1 text-sm text-nubia-accent hover:text-nubia-accent-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            Add note
          </button>
        )}
      </div>

      {/* Migration prompt */}
      {showMigration && (
        <div className="mb-4 p-4 bg-nubia-accent/10 border border-nubia-accent/30 rounded-lg">
          <p className="text-sm text-nubia-text mb-3">
            {migrationStatus === 'migrating' ? (
              'Migrating your notes...'
            ) : typeof migrationStatus === 'string' ? (
              migrationStatus
            ) : (
              "You have local notes! Would you like to sync them to your account?"
            )}
          </p>
          {!migrationStatus && (
            <div className="flex gap-2">
              <button
                onClick={handleMigrate}
                className="px-3 py-1.5 text-sm bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors"
              >
                Sync notes
              </button>
              <button
                onClick={handleSkipMigration}
                className="px-3 py-1.5 text-sm text-nubia-text-secondary hover:text-nubia-text transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Sign in CTA for guests */}
          {!isAuthenticated && notes.length > 0 && (
            <SignInCTA onOpenAuth={onOpenAuth} context="notes" variant="inline" />
          )}

          {/* Note editor */}
          {editingNote && (
            <div className="p-4 bg-nubia-surface border border-nubia-border rounded-lg">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full mb-3 px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none"
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your notes here..."
                rows={5}
                className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none resize-y"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-nubia-text-secondary hover:text-nubia-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-sm bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Notes list */}
          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block w-5 h-5 border-2 border-nubia-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 && !editingNote ? (
            <div className="text-center py-6 text-nubia-text-muted">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">
                {isAuthenticated
                  ? 'Your notes are synced to your account'
                  : 'Notes are saved locally in your browser'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-nubia-surface border border-nubia-border rounded-lg group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-nubia-text truncate">
                        {note.title || 'Untitled Note'}
                      </h4>
                      <p className="text-sm text-nubia-text-secondary mt-1 line-clamp-3 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-xs text-nubia-text-muted mt-2">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1.5 text-nubia-text-secondary hover:text-nubia-accent transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-nubia-text-secondary hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Storage indicator */}
          <div className="text-center text-xs text-nubia-text-muted pt-2">
            {isAuthenticated ? (
              <span className="flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Synced to cloud
              </span>
            ) : (
              <span>Saved locally in your browser</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
