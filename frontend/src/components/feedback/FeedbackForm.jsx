import React, { useState } from 'react';
import { submitFeedback } from '../../utils/api';

function FeedbackForm({ pageContext }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setStatus('submitting');
    
    try {
      await submitFeedback(message, pageContext);
      setStatus('success');
      setMessage('');
      setTimeout(() => {
        setStatus('idle');
        setIsExpanded(false);
      }, 3000);
    } catch (error) {
      console.error('Feedback submission failed:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="nubia-feedback-form">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 font-sans text-sm text-nubia-text-muted hover:text-nubia-text transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          Found an error or have a suggestion?
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="animate-fade-in">
          <label htmlFor="feedback" className="block font-sans text-sm font-medium text-nubia-text-secondary mb-2">
            Your feedback
          </label>
          
          <textarea
            id="feedback"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Found an error in a formula? Have a suggestion? Let us know..."
            className="nubia-textarea h-28"
            maxLength={2000}
            disabled={status === 'submitting'}
          />
          
          <div className="mt-3 flex items-center justify-between">
            <span className="font-sans text-xs text-nubia-text-muted">
              {message.length}/2000 characters
            </span>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setMessage('');
                }}
                className="font-sans text-sm text-nubia-text-muted hover:text-nubia-text transition-colors"
                disabled={status === 'submitting'}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="nubia-button"
                disabled={!message.trim() || status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <div className="mt-3 p-3 bg-nubia-success-subtle border border-nubia-success/20 rounded-md animate-fade-in">
              <p className="font-sans text-sm text-nubia-success">
                Thank you for your feedback! It helps us improve Nubia.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-3 p-3 bg-nubia-error-subtle border border-nubia-error/20 rounded-md animate-fade-in">
              <p className="font-sans text-sm text-nubia-error">
                Failed to send feedback. Please try again later.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default FeedbackForm;
