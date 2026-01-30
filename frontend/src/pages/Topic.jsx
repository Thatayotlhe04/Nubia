import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopic } from '../utils/api';
import TopicContent from '../components/content/TopicContent';
import { FormulaBlock } from '../components/content/FormulaBlock';
import ExampleBlock from '../components/content/ExampleBlock';
import Calculator from '../components/calculator/Calculator';
import FeedbackForm from '../components/feedback/FeedbackForm';

function Topic() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTopic() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTopic(topicId);
        setTopic(data);
      } catch (err) {
        console.error('Failed to load topic:', err);
        setError('Failed to load topic. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadTopic();
  }, [topicId]);

  // Loading state
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-nubia-surface-alt rounded animate-pulse" />
          <div className="h-6 w-96 bg-nubia-surface-alt rounded animate-pulse" />
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-5 bg-nubia-surface-alt rounded animate-pulse" style={{ width: `${90 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <p className="font-sans text-base text-nubia-error mb-4">{error}</p>
          <Link to="/" className="nubia-button">
            Return to overview
          </Link>
        </div>
      </div>
    );
  }

  // Not found state
  if (!topic) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <h1 className="nubia-heading-2 mb-2">Topic not found</h1>
          <p className="nubia-body-small mb-6">
            The topic you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="nubia-button">
            Return to overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          to="/" 
          className="font-sans text-sm text-nubia-text-muted hover:text-nubia-text transition-colors"
        >
          ← Back to overview
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="nubia-heading-1 mb-3">
          {topic.title}
        </h1>
        <p className="font-serif text-lg text-nubia-text-secondary max-w-reading">
          {topic.description}
        </p>
      </header>

      {/* Content */}
      <section className="nubia-section">
        <TopicContent content={topic.content} />
      </section>

      {/* Formulas */}
      {topic.formulas && topic.formulas.length > 0 && (
        <section className="nubia-section">
          <h2 className="nubia-heading-2 mb-6">Formulas</h2>
          <div className="space-y-6">
            {topic.formulas.map(formula => (
              <FormulaBlock key={formula.id} formula={formula} />
            ))}
          </div>
        </section>
      )}

      {/* Calculator */}
      {topic.calculator && (
        <section className="nubia-section">
          <h2 className="nubia-heading-2 mb-6">Calculator</h2>
          <Calculator config={topic.calculator} />
        </section>
      )}

      {/* Worked Examples */}
      {topic.examples && topic.examples.length > 0 && (
        <section className="nubia-section">
          <h2 className="nubia-heading-2 mb-6">Worked Examples</h2>
          <div className="space-y-6">
            {topic.examples.map(example => (
              <ExampleBlock key={example.id} example={example} />
            ))}
          </div>
        </section>
      )}

      {/* Feedback */}
      <FeedbackForm pageContext={`topic:${topicId}`} />
    </article>
  );
}

export default Topic;
