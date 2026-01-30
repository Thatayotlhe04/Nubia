import React, { useEffect, useRef } from 'react';
import katex from 'katex';

/**
 * Renders LaTeX formulas using KaTeX
 */
function Formula({ latex, displayMode = true, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode,
          throwOnError: false,
          errorColor: '#9B4F4F',
          trust: false,
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX render error:', error);
        containerRef.current.textContent = latex;
      }
    }
  }, [latex, displayMode]);

  return (
    <span 
      ref={containerRef} 
      className={`nubia-formula-latex ${className}`}
      aria-label={`Mathematical formula: ${latex}`}
    />
  );
}

/**
 * Formula block with name, formula, and explanation
 */
function FormulaBlock({ formula }) {
  return (
    <div className="nubia-formula-block">
      <div className="nubia-formula-name">
        {formula.name}
      </div>
      
      <Formula latex={formula.latex} />
      
      {formula.explanation && (
        <p className="nubia-formula-explanation">
          {formula.explanation}
        </p>
      )}

      {formula.variables && formula.variables.length > 0 && (
        <div className="mt-4 pt-4 border-t border-nubia-border-subtle">
          <h4 className="font-sans text-sm font-medium text-nubia-text-secondary mb-3">
            Variables
          </h4>
          <table className="nubia-variable-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {formula.variables.map((variable, index) => (
                <tr key={index}>
                  <td>
                    <Formula latex={variable.symbol} displayMode={false} />
                  </td>
                  <td className="font-sans">{variable.name}</td>
                  <td>{variable.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export { Formula, FormulaBlock };
export default Formula;
