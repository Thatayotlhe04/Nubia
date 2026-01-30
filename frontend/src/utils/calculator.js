/**
 * Nubia Calculator Engine
 * 
 * All calculations are deterministic and run entirely in the browser.
 * This module contains the mathematical formulas and calculation logic.
 */

/**
 * Format a number as currency (BWP)
 */
export function formatCurrency(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  
  const formatted = new Intl.NumberFormat('en-BW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  
  return `P${formatted}`;
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a plain number
 */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-BW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Validate a numeric input
 */
export function validateInput(value, config) {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number' };
  }
  
  if (config.min !== undefined && num < config.min) {
    return { valid: false, error: `Value must be at least ${config.min}` };
  }
  
  if (config.max !== undefined && num > config.max) {
    return { valid: false, error: `Value must be at most ${config.max}` };
  }
  
  return { valid: true, value: num };
}

/**
 * FORMULA: Future Value of a Single Sum
 * FV = PV × (1 + r)^n
 */
export function calculateFutureValue(pv, r, n) {
  // Convert percentage to decimal if needed
  const rate = r > 1 ? r / 100 : r;
  return pv * Math.pow(1 + rate, n);
}

/**
 * FORMULA: Present Value of a Single Sum
 * PV = FV / (1 + r)^n
 */
export function calculatePresentValue(fv, r, n) {
  const rate = r > 1 ? r / 100 : r;
  return fv / Math.pow(1 + rate, n);
}

/**
 * FORMULA: Compound Interest with Periodic Compounding
 * FV = PV × (1 + r/m)^(m×n)
 */
export function calculateCompoundInterest(pv, r, m, n) {
  const rate = r > 1 ? r / 100 : r;
  return pv * Math.pow(1 + rate / m, m * n);
}

/**
 * FORMULA: Effective Annual Rate (EAR)
 * EAR = (1 + r/m)^m - 1
 */
export function calculateEAR(r, m) {
  const rate = r > 1 ? r / 100 : r;
  return (Math.pow(1 + rate / m, m) - 1) * 100;
}

/**
 * FORMULA: Net Present Value (NPV)
 * NPV = -C₀ + Σ(Ct / (1 + r)^t)
 */
export function calculateNPV(initialInvestment, discountRate, cashflows) {
  const rate = discountRate > 1 ? discountRate / 100 : discountRate;
  
  let npv = -initialInvestment;
  
  for (let t = 0; t < cashflows.length; t++) {
    npv += cashflows[t] / Math.pow(1 + rate, t + 1);
  }
  
  return npv;
}

/**
 * Generate calculation steps for display
 */
export function generateCalculationSteps(formulaKey, inputs, result) {
  switch (formulaKey) {
    case 'fv-single-sum':
      return generateFVSteps(inputs, result);
    case 'pv-single-sum':
      return generatePVSteps(inputs, result);
    case 'compound-interest-formula':
      return generateCompoundSteps(inputs, result);
    case 'npv-formula':
      return generateNPVSteps(inputs, result);
    default:
      return [];
  }
}

function generateFVSteps(inputs, result) {
  const { pv, r, n } = inputs;
  const rate = r / 100;
  const factor = Math.pow(1 + rate, n);
  
  return [
    {
      label: 'Substitute values into formula',
      content: `FV = P${formatNumber(pv, 2)} × (1 + ${rate.toFixed(4)})^${n}`
    },
    {
      label: 'Calculate the compound factor',
      content: `(1 + ${rate.toFixed(4)})^${n} = ${factor.toFixed(4)}`
    },
    {
      label: 'Calculate final result',
      content: `FV = P${formatNumber(pv, 2)} × ${factor.toFixed(4)} = P${formatNumber(result, 2)}`
    }
  ];
}

function generatePVSteps(inputs, result) {
  const { fv, r, n } = inputs;
  const rate = r / 100;
  const factor = Math.pow(1 + rate, n);
  
  return [
    {
      label: 'Substitute values into formula',
      content: `PV = P${formatNumber(fv, 2)} ÷ (1 + ${rate.toFixed(4)})^${n}`
    },
    {
      label: 'Calculate the discount factor',
      content: `(1 + ${rate.toFixed(4)})^${n} = ${factor.toFixed(4)}`
    },
    {
      label: 'Calculate final result',
      content: `PV = P${formatNumber(fv, 2)} ÷ ${factor.toFixed(4)} = P${formatNumber(result, 2)}`
    }
  ];
}

function generateCompoundSteps(inputs, result) {
  const { pv, r, m, n } = inputs;
  const rate = r / 100;
  const periodicRate = rate / m;
  const totalPeriods = m * n;
  const factor = Math.pow(1 + periodicRate, totalPeriods);
  
  return [
    {
      label: 'Calculate periodic interest rate',
      content: `r/m = ${rate.toFixed(4)} ÷ ${m} = ${periodicRate.toFixed(6)}`
    },
    {
      label: 'Calculate total compounding periods',
      content: `m × n = ${m} × ${n} = ${totalPeriods}`
    },
    {
      label: 'Calculate the compound factor',
      content: `(1 + ${periodicRate.toFixed(6)})^${totalPeriods} = ${factor.toFixed(4)}`
    },
    {
      label: 'Calculate final result',
      content: `FV = P${formatNumber(pv, 2)} × ${factor.toFixed(4)} = P${formatNumber(result, 2)}`
    }
  ];
}

function generateNPVSteps(inputs, result) {
  const { c0, r, cashflows } = inputs;
  const rate = r / 100;
  
  const steps = [
    {
      label: 'Initial investment',
      content: `-P${formatNumber(c0, 2)}`
    }
  ];
  
  let runningPV = 0;
  cashflows.forEach((cf, i) => {
    const pv = cf / Math.pow(1 + rate, i + 1);
    runningPV += pv;
    steps.push({
      label: `Present value of Year ${i + 1} cash flow`,
      content: `P${formatNumber(cf, 2)} ÷ (1 + ${rate.toFixed(4)})^${i + 1} = P${formatNumber(pv, 2)}`
    });
  });
  
  steps.push({
    label: 'Sum of present values',
    content: `P${formatNumber(runningPV, 2)}`
  });
  
  steps.push({
    label: 'Calculate NPV',
    content: `NPV = P${formatNumber(runningPV, 2)} - P${formatNumber(c0, 2)} = P${formatNumber(result, 2)}`
  });
  
  return steps;
}

/**
 * Main calculation dispatcher
 * Routes to the appropriate formula based on formula key
 */
export function calculate(formulaKey, inputs) {
  switch (formulaKey) {
    case 'fv-single-sum':
      return calculateFutureValue(inputs.pv, inputs.r, inputs.n);
      
    case 'pv-single-sum':
      return calculatePresentValue(inputs.fv, inputs.r, inputs.n);
      
    case 'compound-interest-formula':
      return calculateCompoundInterest(inputs.pv, inputs.r, inputs.m, inputs.n);
      
    case 'effective-annual-rate':
      return calculateEAR(inputs.r, inputs.m);
      
    case 'npv-formula':
      return calculateNPV(inputs.c0, inputs.r, inputs.cashflows);
      
    default:
      throw new Error(`Unknown formula: ${formulaKey}`);
  }
}
