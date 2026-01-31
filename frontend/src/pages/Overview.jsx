import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NubiaLogo } from './Home';

// Section Component
function Section({ id, title, children, className = "" }) {
  return (
    <section id={id} className={`mb-12 md:mb-16 ${className}`}>
      <h2 className="nubia-heading-3 mb-4 md:mb-6">{title}</h2>
      {children}
    </section>
  );
}

// Review Card Component - Warm aesthetic palette
const reviewColors = [
  { bg: 'bg-amber-100', avatar: 'bg-amber-600', text: 'text-amber-900' },
  { bg: 'bg-rose-100', avatar: 'bg-rose-500', text: 'text-rose-900' },
  { bg: 'bg-emerald-100', avatar: 'bg-emerald-600', text: 'text-emerald-900' },
  { bg: 'bg-orange-100', avatar: 'bg-orange-500', text: 'text-orange-900' },
  { bg: 'bg-teal-100', avatar: 'bg-teal-600', text: 'text-teal-900' },
  { bg: 'bg-purple-100', avatar: 'bg-purple-500', text: 'text-purple-900' },
];

function ReviewCard({ name, course, text, date, index = 0 }) {
  const colorScheme = reviewColors[index % reviewColors.length];
  
  return (
    <div className={`${colorScheme.bg} rounded-xl p-4 md:p-5 border border-black/5 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${colorScheme.avatar} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="font-sans text-sm font-semibold text-white">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`font-sans text-sm font-semibold ${colorScheme.text}`}>{name}</h4>
            <span className="font-sans text-xs text-gray-500 flex-shrink-0">{date}</span>
          </div>
          <p className="font-sans text-xs text-gray-600 mb-2 font-medium">{course}</p>
          <p className="font-serif text-sm text-gray-700 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [reviewText, setReviewText] = useState('');
  const [reviewUniversity, setReviewUniversity] = useState('');
  const [reviews, setReviews] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews from API on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        const savedReviews = localStorage.getItem('nubia-reviews');
        if (savedReviews) {
          try {
            setReviews(JSON.parse(savedReviews));
          } catch (e) {
            console.error('Error loading local reviews:', e);
          }
        }
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      const universityLabel = reviewUniversity || 'University Student';
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: reviewText,
            name: 'Anonymous',
            course: universityLabel
          })
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(prev => [data.review, ...prev]);
          setReviewText('');
          setReviewUniversity('');
          setSubmitStatus('Thank you! Your review is now public.');
        } else {
          throw new Error('Failed to submit');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        const newReview = {
          id: Date.now(),
          name: 'Anonymous',
          course: universityLabel,
          text: reviewText,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem('nubia-reviews', JSON.stringify(updatedReviews));
        setReviewText('');
        setReviewUniversity('');
        setSubmitStatus('Saved locally (server unavailable)');
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(''), 4000);
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <header className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-md">
            <NubiaLogo className="w-6 h-4 text-white" />
          </div>
          <h1 className="nubia-heading-1 text-2xl md:text-3xl">
            Platform Overview
          </h1>
        </div>
        <p className="nubia-body text-base text-nubia-text-secondary leading-relaxed">
          Explore all the features and resources Nubia offers for your academic success.
        </p>
      </header>

      {/* Section 1: Integrated Academic Resources */}
      <Section id="resources" title="Integrated Academic Resources">
        <div className="nubia-prose">
          <p>
            Each topic in Nubia includes a Resources section linking to trusted external materials. 
            These resources are selected based on academic credibility and relevance to your examinations.
          </p>
          
          <div className="mt-6 p-4 md:p-5 bg-nubia-surface-alt rounded-lg border border-nubia-border-subtle">
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-3">What you will find:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Textbook chapters from established finance publishers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Lecture notes and course materials from academic institutions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Supplementary PDFs and video explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Past examination resources where available</span>
              </li>
            </ul>
          </div>
          
          <p className="mt-6">
            All external links open in a new tab, keeping Nubia as your central workspace. 
            Resources are organized by topic, so you always know where to find deeper reading 
            for the concept you are studying.
          </p>
          
          <p className="mt-4 text-nubia-text-muted text-sm">
            Quality, relevance, and exam alignment take priority over volume. Nubia links only 
            to materials that add genuine value to your preparation.
          </p>
        </div>
      </Section>

      {/* Section 2: Personal Study Uploads */}
      <Section id="uploads" title="Personal Study Uploads">
        <div className="nubia-prose">
          <p>
            Nubia allows you to upload your own study materials and attach them to specific topics. 
            This transforms the platform into a personal academic archive that grows alongside your coursework.
          </p>
          
          <div className="mt-6 p-4 md:p-5 bg-nubia-surface-alt rounded-lg border border-nubia-border-subtle">
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-3">You can upload:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Notes</span>
              </div>
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>PDFs</span>
              </div>
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Images</span>
              </div>
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Videos</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border-l-2 border-nubia-accent bg-nubia-surface">
            <p className="text-sm text-nubia-text-secondary">
              <strong className="text-nubia-text">Privacy note:</strong> Your uploaded content is private by default. 
              Nubia is not a social platform or content-sharing network. The purpose is personal organization 
              and learning continuity, not public visibility.
            </p>
          </div>
          
          <p className="mt-6">
            By keeping your materials attached to relevant topics, you build a structured study system 
            that remains useful across semesters and exam periods.
          </p>
        </div>
      </Section>

      {/* Section 3: Why Nubia Avoids Random Web Searching */}
      <Section id="structured-learning" title="Why Nubia Avoids Random Web Searching">
        <div className="nubia-prose">
          <p>
            Open web searches for finance concepts often return inconsistent, outdated, or 
            incorrectly explained material. Students waste time evaluating sources instead of learning.
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-nubia-surface-alt flex items-center justify-center">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-1">Correctness</h4>
              <p className="text-xs text-nubia-text-secondary">Verified formulas and explanations you can trust</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-nubia-surface-alt flex items-center justify-center">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-1">Structure</h4>
              <p className="text-xs text-nubia-text-secondary">Organized by topic for logical study flow</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-nubia-surface-alt flex items-center justify-center">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-1">Relevance</h4>
              <p className="text-xs text-nubia-text-secondary">Aligned with university finance curriculum</p>
            </div>
          </div>
          
          <p className="mt-6">
            Nubia prioritizes academic integrity and time efficiency. By staying within one system, 
            you reduce confusion and maintain consistent study momentum.
          </p>
        </div>
      </Section>

      {/* Section 4: Feedback and Continuous Improvement */}
      <Section id="feedback" title="Feedback and Continuous Improvement">
        <div className="nubia-prose">
          <p>
            Nubia improves through student feedback. If you encounter issues or have suggestions, 
            your input helps refine the platform for all users.
          </p>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-nubia-surface rounded-lg border border-nubia-border">
              <svg className="w-5 h-5 text-nubia-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-sans text-sm font-semibold text-nubia-text">Report incorrect content</h4>
                <p className="text-sm text-nubia-text-secondary">Flag errors in formulas, explanations, or calculations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-nubia-surface rounded-lg border border-nubia-border">
              <svg className="w-5 h-5 text-nubia-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <h4 className="font-sans text-sm font-semibold text-nubia-text">Report broken links</h4>
                <p className="text-sm text-nubia-text-secondary">Let us know when external resources become unavailable</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-nubia-surface rounded-lg border border-nubia-border">
              <svg className="w-5 h-5 text-nubia-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <h4 className="font-sans text-sm font-semibold text-nubia-text">Suggest resources</h4>
                <p className="text-sm text-nubia-text-secondary">Recommend high-quality academic materials for inclusion</p>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-nubia-text-muted text-sm">
            Use the feedback form available on each topic page to submit your observations. 
            Constructive feedback contributes to gradual, meaningful improvements.
          </p>
        </div>
      </Section>

      {/* Student Reviews Section */}
      <Section id="reviews" title="Student Reviews">
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 rounded-2xl p-6 md:p-8 border border-rose-200/50">
          <p className="font-serif text-base text-gray-700 mb-6 leading-relaxed">
            Read what fellow students have to say about their experience with Nubia, 
            or share your own feedback to help improve the platform.
          </p>
          
          {/* Review Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-5 mb-6 border border-rose-200/30 shadow-sm">
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-3">Share Your Experience</h4>
            <p className="font-sans text-xs text-nubia-text-muted mb-4">Your feedback is anonymous and helps improve Nubia for all students.</p>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share how Nubia has helped your studies..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-nubia-border rounded-lg bg-nubia-surface focus:outline-none focus:ring-1 focus:ring-nubia-accent resize-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="review-university" className="block font-sans text-xs text-nubia-text-muted mb-1">Your university (optional)</label>
                <select
                  id="review-university"
                  value={reviewUniversity}
                  onChange={(e) => setReviewUniversity(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-nubia-text border border-nubia-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-nubia-accent appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="">Select your university...</option>
                  <option value="University of Botswana (UB)">University of Botswana (UB)</option>
                  <option value="BIUST">Botswana International University of Science & Technology (BIUST)</option>
                  <option value="Botswana Accountancy College (BAC)">Botswana Accountancy College (BAC)</option>
                  <option value="Botswana Open University (BOU)">Botswana Open University (BOU)</option>
                  <option value="Limkokwing University">Limkokwing University</option>
                  <option value="BA ISAGO University">BA ISAGO University</option>
                  <option value="Botho University">Botho University</option>
                  <option value="ABM University College">ABM University College</option>
                  <option value="GUC">Gaborone University College of Law and Professional Studies (GUC)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-sans text-sm font-medium text-white bg-nubia-accent rounded-lg hover:bg-nubia-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Anonymously'
                  )}
                </button>
                {submitStatus && (
                  <span className={`font-sans text-sm ${submitStatus.includes('unavailable') ? 'text-yellow-600' : 'text-green-600'}`}>{submitStatus}</span>
                )}
              </div>
            </form>
          </div>
          
          {/* Reviews List */}
          {isLoadingReviews ? (
            <div className="bg-white/60 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-nubia-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-sans text-sm text-nubia-text-muted">Loading reviews...</p>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white/60 rounded-xl p-6 text-center">
              <p className="font-sans text-sm text-nubia-text-muted">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {reviews.map((review, index) => (
                  <div key={review.id} className="w-72 flex-shrink-0">
                    <ReviewCard {...review} index={index} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* About Section */}
      <Section id="about" title="About Nubia">
        <div className="nubia-prose">
          <div className="nubia-card p-5 md:p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg">
                  <NubiaLogo className="w-12 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-sans text-lg font-semibold text-nubia-text mb-2">
                  Thatayotlhe Tsenang
                </h3>
                <p className="font-sans text-sm text-nubia-text-muted mb-4">
                  Creator and Developer
                </p>
                <p className="text-sm text-nubia-text-secondary leading-relaxed mb-4">
                  Nubia was created by Thatayotlhe Tsenang, a 21-year-old student at the University of Botswana. 
                  With a passion for both web development and financial engineering, Thatayotlhe built Nubia to 
                  address a real need: providing Batswana finance students with a reliable, structured, and 
                  locally relevant study companion.
                </p>
                <p className="text-sm text-nubia-text-secondary leading-relaxed mb-4">
                  The platform combines technical expertise in modern web technologies with a deep understanding 
                  of the challenges finance students face when preparing for coursework and examinations. 
                  Nubia represents the intersection of these skills: clean, functional design meets rigorous 
                  academic content.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-sans bg-nubia-surface-alt text-nubia-text-secondary rounded">
                    Web Development
                  </span>
                  <span className="px-2 py-1 text-xs font-sans bg-nubia-surface-alt text-nubia-text-secondary rounded">
                    Financial Engineering
                  </span>
                  <span className="px-2 py-1 text-xs font-sans bg-nubia-surface-alt text-nubia-text-secondary rounded">
                    University of Botswana
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border-l-2 border-rose-500 bg-gradient-to-r from-rose-50 to-transparent">
            <p className="text-sm text-nubia-text-secondary italic">
              "I built Nubia because I wanted something I could rely on during my own studies. 
              If it helps even one other student understand finance concepts better, then the 
              effort was worth it."
            </p>
            <p className="mt-2 font-sans text-xs text-nubia-text-muted">— Thatayotlhe Tsenang</p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="mt-20 pt-12 border-t border-nubia-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                <NubiaLogo className="w-5 h-3 text-white" />
              </div>
              <span className="font-sans text-lg font-semibold text-nubia-text">Nubia</span>
            </div>
            <p className="text-sm text-nubia-text-secondary mb-4 leading-relaxed">
              Your academic study companion for finance, mathematics, and beyond.
            </p>
            <p className="text-xs text-nubia-text-muted">
              Built for University Students.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/topics" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  Topics
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  Academic Search
                </Link>
              </li>
              <li>
                <Link to="/summarizer" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  PDF Summarizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/overview#about" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  About Nubia
                </Link>
              </li>
              <li>
                <a href="#roadmap" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors inline-flex items-center gap-1.5">
                  Roadmap
                  <span className="text-[10px] px-1.5 py-0.5 bg-nubia-accent/20 text-nubia-accent rounded">Beta</span>
                </a>
              </li>
              <li>
                <a href="#trust" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  Trust & Safety
                </a>
              </li>
              <li>
                <a href="mailto:tsenangthatayotlhe04@gmail.com" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Developers Column */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-4">Developers</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com/Thatayotlhe04/Nubia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
              </li>
              <li>
                <span className="text-sm text-nubia-text-muted inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                  API
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-400 rounded">Soon</span>
                </span>
              </li>
              <li>
                <a href="#changelog" className="text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-nubia-border-subtle">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-nubia-text-muted">
              <a href="#privacy" className="hover:text-nubia-text-secondary transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-nubia-text-secondary transition-colors">Terms of Service</a>
            </div>
            <p className="font-sans text-xs text-nubia-text-muted">
              © {currentYear} Nubia · v1.0 · Beta
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Overview;
