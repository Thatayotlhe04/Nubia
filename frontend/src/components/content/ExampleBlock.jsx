import React, { useState } from 'react';

/**
 * Displays a worked example with expandable steps
 */
function ExampleBlock({ example }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="nubia-example">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="nubia-example-header w-full text-left flex items-center justify-between cursor-pointer hover:bg-nubia-bg-warm transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="nubia-example-title">
          {example.title}
        </span>
        <svg 
          className={`w-5 h-5 text-nubia-text-muted transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="nubia-example-body animate-fade-in">
          {/* Scenario */}
          <div className="nubia-example-scenario">
            {example.scenario}
          </div>

          {/* Solution steps */}
          <div className="mt-6">
            <h4 className="font-sans text-sm font-semibold text-nubia-text-muted uppercase tracking-wider mb-4">
              Solution
            </h4>
            
            <div className="space-y-1">
              {example.steps.map((step, index) => (
                <div key={index} className="nubia-example-step">
                  <div className="flex items-start">
                    <span className="nubia-example-step-number">
                      {step.step || index + 1}
                    </span>
                    <span className="nubia-example-step-title">
                      {step.description}
                    </span>
                  </div>
                  <div className="nubia-example-step-content">
                    {step.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final answer */}
          <div className="nubia-example-answer">
            <strong className="font-sans text-sm font-semibold text-nubia-success">
              Answer:
            </strong>
            <span className="ml-2">{example.final_answer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExampleBlock;
