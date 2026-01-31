import React, { useState } from 'react';
import { submitFeedback } from '../../utils/api';

function FeedbackForm({ pageContext }) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [wantsReply, setWantsReply] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setStatus('submitting');
    
    try {
      await submitFeedback(message, pageContext, wantsReply ? email : null, university || null);
      setStatus('success');
      setMessage('');
      setEmail('');
      setUniversity('');
      setWantsReply(false);
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
          
          {/* University selection */}
          <div className="mt-3">
            <label htmlFor="university" className="block font-sans text-xs text-nubia-text-muted mb-1">
              Your university (optional)
            </label>
            <select
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3 py-2 text-sm text-nubia-text border border-nubia-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-nubia-accent appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              disabled={status === 'submitting'}
            >
              <option value="">Select your university...</option>
              <option value="University of Botswana">University of Botswana (UB)</option>
              <option value="Botswana International University of Science and Technology">BIUST</option>
              <option value="Botswana Accountancy College">Botswana Accountancy College (BAC)</option>
              <option value="Botswana Open University">Botswana Open University (BOU)</option>
              <option value="Limkokwing University">Limkokwing University</option>
              <option value="BA ISAGO University">BA ISAGO University</option>
              <option value="Botho University">Botho University</option>
              <option value="ABM University College">ABM University College</option>
              <option value="Gaborone University College of Law and Professional Studies">GUC</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Optional email for reply */}
          <div className="mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wantsReply}
                onChange={(e) => setWantsReply(e.target.checked)}
                className="w-4 h-4 rounded border-nubia-border text-nubia-accent focus:ring-nubia-accent"
                disabled={status === 'submitting'}
              />
              <span className="font-sans text-sm text-nubia-text-secondary">
                I'd like to receive a reply
              </span>
            </label>
            
            {wantsReply && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-2 w-full px-3 py-2 text-sm border border-nubia-border rounded-lg bg-nubia-surface focus:outline-none focus:ring-1 focus:ring-nubia-accent"
                disabled={status === 'submitting'}
              />
            )}
          </div>
          
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
                  setEmail('');
                  setUniversity('');
                  setWantsReply(false);
                }}
                className="font-sans text-sm text-nubia-text-muted hover:text-nubia-text transition-colors"
                disabled={status === 'submitting'}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="nubia-button"
                disabled={!message.trim() || status === 'submitting' || (wantsReply && !email.trim())}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <div className="mt-3 p-3 bg-nubia-success-subtle border border-nubia-success/20 rounded-md animate-fade-in">
              <p className="font-sans text-sm text-nubia-success">
                Thank you for your feedback! {wantsReply ? "We'll reply to your email soon." : "It helps us improve Nubia."}
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
