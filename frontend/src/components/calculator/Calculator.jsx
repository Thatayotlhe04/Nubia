import React, { useState, useEffect, useCallback } from 'react';
import { calculate, formatCurrency, formatPercentage, formatNumber, generateCalculationSteps } from '../../utils/calculator';

/**
 * Interactive calculator component
 * All calculations run client-side
 */
function Calculator({ config }) {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize inputs with defaults
  useEffect(() => {
    if (config?.inputs) {
      const initialInputs = {};
      config.inputs.forEach(input => {
        if (input.type === 'cashflow-series') {
          initialInputs[input.id] = input.default || [];
        } else {
          initialInputs[input.id] = input.default ?? '';
        }
      });
      setInputs(initialInputs);
    }
  }, [config]);

  // Perform calculation
  const performCalculation = useCallback(() => {
    if (!config) return;

    // Validate all inputs
    const newErrors = {};
    let hasErrors = false;

    config.inputs.forEach(input => {
      const value = inputs[input.id];
      
      if (input.type === 'cashflow-series') {
        if (!Array.isArray(value) || value.length === 0) {
          newErrors[input.id] = 'At least one cash flow is required';
          hasErrors = true;
        }
      } else if (input.type !== 'select') {
        const num = parseFloat(value);
        if (isNaN(num)) {
          newErrors[input.id] = 'Please enter a valid number';
          hasErrors = true;
        } else if (input.min !== undefined && num < input.min) {
          newErrors[input.id] = `Minimum value is ${input.min}`;
          hasErrors = true;
        } else if (input.max !== undefined && num > input.max) {
          newErrors[input.id] = `Maximum value is ${input.max}`;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      setResult(null);
      setSteps([]);
      return;
    }

    // Prepare inputs for calculation
    const calcInputs = {};
    config.inputs.forEach(input => {
      if (input.type === 'cashflow-series') {
        calcInputs[input.id] = inputs[input.id].map(v => parseFloat(v) || 0);
      } else if (input.type === 'percentage') {
        calcInputs[input.id] = parseFloat(inputs[input.id]);
      } else {
        calcInputs[input.id] = parseFloat(inputs[input.id]);
      }
    });

    try {
      const calculatedResult = calculate(config.formula_key, calcInputs);
      setResult(calculatedResult);
      setSteps(generateCalculationSteps(config.formula_key, calcInputs, calculatedResult));
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ _general: 'Calculation failed. Please check your inputs.' });
      setResult(null);
      setSteps([]);
    }
  }, [config, inputs]);

  // Recalculate when inputs change
  useEffect(() => {
    const timer = setTimeout(performCalculation, 100);
    return () => clearTimeout(timer);
  }, [inputs, performCalculation]);

  // Handle input changes
  const handleInputChange = (id, value) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  // Handle cashflow series changes
  const handleCashflowChange = (id, index, value) => {
    setInputs(prev => {
      const newCashflows = [...(prev[id] || [])];
      newCashflows[index] = value;
      return { ...prev, [id]: newCashflows };
    });
  };

  const addCashflow = (id, maxPeriods) => {
    setInputs(prev => {
      const current = prev[id] || [];
      if (current.length >= maxPeriods) return prev;
      return { ...prev, [id]: [...current, ''] };
    });
  };

  const removeCashflow = (id, index) => {
    setInputs(prev => {
      const newCashflows = [...(prev[id] || [])];
      newCashflows.splice(index, 1);
      return { ...prev, [id]: newCashflows };
    });
  };

  // Format result for display
  const formatResult = (value) => {
    if (value === null || value === undefined) return '—';
    
    if (config.output_unit === 'BWP') {
      return formatCurrency(value, config.output_decimals || 2);
    } else if (config.output_unit === '%') {
      return formatPercentage(value, config.output_decimals || 2);
    }
    return formatNumber(value, config.output_decimals || 2);
  };

  if (!config) return null;

  return (
    <div className="nubia-calculator">
      <h3 className="nubia-calculator-title">
        {config.title}
      </h3>

      {/* Input fields */}
      <div className="space-y-5">
        {config.inputs.map(input => (
          <div key={input.id} className="nubia-input-group">
            <label htmlFor={input.id} className="nubia-input-label">
              {input.label}
              {input.unit && input.type !== 'select' && (
                <span className="ml-1 text-nubia-text-muted font-normal">
                  ({input.unit})
                </span>
              )}
            </label>

            {input.type === 'select' ? (
              <select
                id={input.id}
                value={inputs[input.id] || ''}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
                className="nubia-select"
              >
                {input.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : input.type === 'cashflow-series' ? (
              <div className="space-y-2">
                {(inputs[input.id] || []).map((cf, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-sans text-sm text-nubia-text-muted w-16">
                      Year {index + 1}
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={cf}
                        onChange={(e) => handleCashflowChange(input.id, index, e.target.value)}
                        className="nubia-input pr-14"
                        placeholder="0"
                        step={input.step || 0.01}
                      />
                      <span className="nubia-input-unit">{input.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCashflow(input.id, index)}
                      className="p-2 text-nubia-text-muted hover:text-nubia-error transition-colors"
                      aria-label={`Remove year ${index + 1}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {(inputs[input.id]?.length || 0) < (input.maxPeriods || 20) && (
                  <button
                    type="button"
                    onClick={() => addCashflow(input.id, input.maxPeriods || 20)}
                    className="nubia-button-secondary w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Year
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <input
                  id={input.id}
                  type="number"
                  value={inputs[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  className={`nubia-input ${input.unit ? 'pr-14' : ''} ${errors[input.id] ? 'border-nubia-error' : ''}`}
                  placeholder={input.placeholder}
                  min={input.min}
                  max={input.max}
                  step={input.step || 'any'}
                />
                {input.unit && (
                  <span className="nubia-input-unit">{input.unit}</span>
                )}
              </div>
            )}

            {errors[input.id] && (
              <p className="mt-1.5 font-sans text-xs text-nubia-error">
                {errors[input.id]}
              </p>
            )}

            {input.help && !errors[input.id] && (
              <p className="nubia-input-help">{input.help}</p>
            )}
          </div>
        ))}
      </div>

      {/* General error */}
      {errors._general && (
        <div className="mt-4 p-4 bg-nubia-error-subtle border border-nubia-error/20 rounded-lg">
          <p className="font-sans text-sm text-nubia-error">{errors._general}</p>
        </div>
      )}

      {/* Result */}
      {result !== null && !errors._general && (
        <div className="nubia-result">
          <div className="nubia-result-label">
            {config.output_label}
          </div>
          <div className="nubia-result-value">
            {formatResult(result)}
          </div>

          {/* Calculation steps */}
          {steps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-nubia-accent/20">
              <details className="group">
                <summary className="font-sans text-sm text-nubia-accent cursor-pointer hover:underline">
                  Show calculation steps
                </summary>
                <div className="mt-3 space-y-2">
                  {steps.map((step, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-sans text-nubia-text-secondary">
                        {step.label}:
                      </span>
                      <span className="ml-2 font-mono text-nubia-text">
                        {step.content}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calculator;
