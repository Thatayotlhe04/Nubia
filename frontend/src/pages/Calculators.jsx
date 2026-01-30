import React, { useState } from 'react';
import { NubiaLogo } from './Home';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Simple Present Value Calculator
function PresentValueCalculator() {
  const [fv, setFv] = useState('');
  const [rate, setRate] = useState('');
  const [periods, setPeriods] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const futureValue = parseFloat(fv);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(periods);
    
    if (isNaN(futureValue) || isNaN(r) || isNaN(n)) {
      setResult({ error: 'Please enter valid numbers' });
      return;
    }
    
    const pv = futureValue / Math.pow(1 + r, n);
    setResult({
      pv: pv.toFixed(2),
      formula: `PV = \\frac{${futureValue}}{(1 + ${(r).toFixed(4)})^{${n}}} = ${pv.toFixed(2)}`
    });
  };

  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-6">
      <h3 className="font-sans text-lg font-semibold text-nubia-text mb-4">Present Value (PV)</h3>
      <div className="mb-4 text-sm text-nubia-text-secondary">
        <InlineMath math="PV = \frac{FV}{(1 + r)^n}" />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Future Value (FV)
          </label>
          <input
            type="number"
            value={fv}
            onChange={(e) => setFv(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 10000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Interest Rate (% per period)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 5"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Number of Periods (n)
          </label>
          <input
            type="number"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 3"
          />
        </div>
        
        <button
          onClick={calculate}
          className="w-full py-2 px-4 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors font-medium"
        >
          Calculate
        </button>
        
        {result && (
          <div className={`p-4 rounded-md ${result.error ? 'bg-red-900/20 text-red-400' : 'bg-nubia-accent-subtle'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div>
                <p className="text-nubia-text font-semibold mb-2">Present Value: P{result.pv}</p>
                <div className="text-sm text-nubia-text-secondary overflow-x-auto">
                  <BlockMath math={result.formula} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Future Value Calculator
function FutureValueCalculator() {
  const [pv, setPv] = useState('');
  const [rate, setRate] = useState('');
  const [periods, setPeriods] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const presentValue = parseFloat(pv);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(periods);
    
    if (isNaN(presentValue) || isNaN(r) || isNaN(n)) {
      setResult({ error: 'Please enter valid numbers' });
      return;
    }
    
    const futureValue = presentValue * Math.pow(1 + r, n);
    setResult({
      fv: futureValue.toFixed(2),
      formula: `FV = ${presentValue} \\times (1 + ${(r).toFixed(4)})^{${n}} = ${futureValue.toFixed(2)}`
    });
  };

  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-6">
      <h3 className="font-sans text-lg font-semibold text-nubia-text mb-4">Future Value (FV)</h3>
      <div className="mb-4 text-sm text-nubia-text-secondary">
        <InlineMath math="FV = PV \times (1 + r)^n" />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Present Value (PV)
          </label>
          <input
            type="number"
            value={pv}
            onChange={(e) => setPv(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 5000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Interest Rate (% per period)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 5"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Number of Periods (n)
          </label>
          <input
            type="number"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 3"
          />
        </div>
        
        <button
          onClick={calculate}
          className="w-full py-2 px-4 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors font-medium"
        >
          Calculate
        </button>
        
        {result && (
          <div className={`p-4 rounded-md ${result.error ? 'bg-red-900/20 text-red-400' : 'bg-nubia-accent-subtle'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div>
                <p className="text-nubia-text font-semibold mb-2">Future Value: P{result.fv}</p>
                <div className="text-sm text-nubia-text-secondary overflow-x-auto">
                  <BlockMath math={result.formula} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// NPV Calculator
function NPVCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [rate, setRate] = useState('');
  const [cashFlows, setCashFlows] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const investment = parseFloat(initialInvestment);
    const r = parseFloat(rate) / 100;
    const flows = cashFlows.split(',').map(cf => parseFloat(cf.trim()));
    
    if (isNaN(investment) || isNaN(r) || flows.some(isNaN)) {
      setResult({ error: 'Please enter valid numbers. Use commas to separate cash flows.' });
      return;
    }
    
    let npv = -investment;
    flows.forEach((cf, i) => {
      npv += cf / Math.pow(1 + r, i + 1);
    });
    
    setResult({
      npv: npv.toFixed(2),
      profitable: npv > 0
    });
  };

  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-6">
      <h3 className="font-sans text-lg font-semibold text-nubia-text mb-4">Net Present Value (NPV)</h3>
      <div className="mb-4 text-sm text-nubia-text-secondary">
        <InlineMath math="NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}" />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Initial Investment (Cost)
          </label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 100000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Discount Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 10"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Future Cash Flows (comma-separated)
          </label>
          <input
            type="text"
            value={cashFlows}
            onChange={(e) => setCashFlows(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 30000, 40000, 50000"
          />
          <p className="text-xs text-nubia-text-muted mt-1">Enter cash flows for each period, separated by commas</p>
        </div>
        
        <button
          onClick={calculate}
          className="w-full py-2 px-4 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors font-medium"
        >
          Calculate
        </button>
        
        {result && (
          <div className={`p-4 rounded-md ${result.error ? 'bg-red-900/20 text-red-400' : 'bg-nubia-accent-subtle'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div>
                <p className="text-nubia-text font-semibold mb-2">NPV: P{result.npv}</p>
                <p className={`text-sm ${result.profitable ? 'text-green-400' : 'text-red-400'}`}>
                  {result.profitable ? '✓ This investment is profitable (NPV > 0)' : '✗ This investment is not profitable (NPV < 0)'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Compound Interest Calculator
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compounding, setCompounding] = useState('1');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(compounding);
    
    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      setResult({ error: 'Please enter valid numbers' });
      return;
    }
    
    const amount = p * Math.pow(1 + r/n, n * t);
    const interest = amount - p;
    
    setResult({
      amount: amount.toFixed(2),
      interest: interest.toFixed(2)
    });
  };

  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-6">
      <h3 className="font-sans text-lg font-semibold text-nubia-text mb-4">Compound Interest</h3>
      <div className="mb-4 text-sm text-nubia-text-secondary">
        <InlineMath math="A = P(1 + \frac{r}{n})^{nt}" />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Principal (P)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 10000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 8"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Time (years)
          </label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
            placeholder="e.g., 5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nubia-text-secondary mb-1">
            Compounding Frequency
          </label>
          <select
            value={compounding}
            onChange={(e) => setCompounding(e.target.value)}
            className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text focus:border-nubia-accent focus:outline-none"
          >
            <option value="1">Annually (n=1)</option>
            <option value="2">Semi-annually (n=2)</option>
            <option value="4">Quarterly (n=4)</option>
            <option value="12">Monthly (n=12)</option>
            <option value="365">Daily (n=365)</option>
          </select>
        </div>
        
        <button
          onClick={calculate}
          className="w-full py-2 px-4 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors font-medium"
        >
          Calculate
        </button>
        
        {result && (
          <div className={`p-4 rounded-md ${result.error ? 'bg-red-900/20 text-red-400' : 'bg-nubia-accent-subtle'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div className="space-y-1">
                <p className="text-nubia-text font-semibold">Final Amount: P{result.amount}</p>
                <p className="text-nubia-text-secondary text-sm">Interest Earned: P{result.interest}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Calculators() {
  return (
    <div className="py-8 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">Interactive Calculators</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Practice financial calculations with these interactive tools. Each calculator shows the formula and step-by-step workings.
        </p>
      </div>
      
      {/* Calculators Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <PresentValueCalculator />
        <FutureValueCalculator />
        <NPVCalculator />
        <CompoundInterestCalculator />
      </div>
      
      {/* Tips Section */}
      <div className="mt-8 p-6 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3">💡 Calculator Tips</h2>
        <ul className="space-y-2 text-sm text-nubia-text-secondary">
          <li>• <strong>Present Value:</strong> Use when you know the future amount and want to find today's value</li>
          <li>• <strong>Future Value:</strong> Use when you know today's amount and want to find the future value</li>
          <li>• <strong>NPV:</strong> Use to evaluate investment projects - positive NPV means profitable</li>
          <li>• <strong>Compound Interest:</strong> Use to see how money grows with different compounding frequencies</li>
        </ul>
      </div>
    </div>
  );
}

export default Calculators;
