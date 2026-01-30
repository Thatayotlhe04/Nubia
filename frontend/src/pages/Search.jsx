import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// Comprehensive academic resources database - Finance, Math, Statistics, Physics, Economics
const credibleResources = [
  // ==================== FINANCE ====================
  {
    id: 'tvm-1',
    topic: 'Time Value of Money',
    category: 'Finance',
    title: 'Understanding Present and Future Value',
    description: 'Comprehensive guide explaining the core concepts of time value of money, including present value, future value, and discount rates.',
    keywords: ['present value', 'future value', 'tvm', 'time value', 'discount rate', 'pv', 'fv', 'finance'],
    formula: 'PV = \\frac{FV}{(1+r)^n}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/t/timevalueofmoney.asp',
    credibility: 'Investopedia is a leading financial education website reviewed by certified financial planners.',
    type: 'Article'
  },
  {
    id: 'tvm-2',
    topic: 'Time Value of Money',
    category: 'Finance',
    title: 'Time Value of Money - Khan Academy',
    description: 'Free video lectures explaining time value of money concepts with visual examples and practice problems.',
    keywords: ['present value', 'future value', 'tvm', 'time value', 'video', 'lecture', 'finance'],
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial',
    credibility: 'Khan Academy is a nonprofit educational organization providing free courses used by millions worldwide.',
    type: 'Video Course'
  },
  {
    id: 'ci-1',
    topic: 'Compound Interest',
    category: 'Finance',
    title: 'Compound Interest Formula and Calculator',
    description: 'Detailed explanation of compound interest with interactive calculator and real-world examples.',
    keywords: ['compound interest', 'compounding', 'interest rate', 'principal', 'annual', 'monthly'],
    formula: 'A = P(1 + \\frac{r}{n})^{nt}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
    credibility: 'Investopedia content is reviewed by qualified financial professionals.',
    type: 'Article'
  },
  {
    id: 'npv-1',
    topic: 'Net Present Value',
    category: 'Finance',
    title: 'NPV - Net Present Value Definition and Formula',
    description: 'Complete guide to NPV calculation, interpretation, and use in capital budgeting decisions.',
    keywords: ['npv', 'net present value', 'capital budgeting', 'investment', 'cash flow', 'discount'],
    formula: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/n/npv.asp',
    credibility: 'Investopedia is a trusted financial education resource.',
    type: 'Article'
  },
  {
    id: 'npv-2',
    topic: 'Net Present Value',
    category: 'Finance',
    title: 'NPV and IRR - Harvard Business School',
    description: 'Academic perspective on net present value and internal rate of return from a leading business school.',
    keywords: ['npv', 'irr', 'internal rate of return', 'harvard', 'academic', 'business'],
    source: 'Harvard Business School Online',
    sourceUrl: 'https://online.hbs.edu/blog/post/how-to-calculate-npv',
    credibility: 'Harvard Business School is one of the world\'s leading business education institutions.',
    type: 'Academic Article'
  },
  {
    id: 'ann-1',
    topic: 'Annuities',
    category: 'Finance',
    title: 'Understanding Annuities: Types and Calculations',
    description: 'Comprehensive guide to ordinary annuities, annuities due, and perpetuities with formulas.',
    keywords: ['annuity', 'ordinary annuity', 'annuity due', 'perpetuity', 'payment', 'pmt'],
    formula: 'PV_{annuity} = PMT \\times \\frac{1-(1+r)^{-n}}{r}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/a/annuity.asp',
    credibility: 'Investopedia provides peer-reviewed financial education content.',
    type: 'Article'
  },
  {
    id: 'ir-1',
    topic: 'Interest Rates',
    category: 'Finance',
    title: 'Effective Annual Rate vs Nominal Rate',
    description: 'Understanding the difference between stated (nominal) interest rates and effective annual rates.',
    keywords: ['ear', 'apr', 'nominal rate', 'effective rate', 'annual', 'interest'],
    formula: 'EAR = (1 + \\frac{r}{n})^n - 1',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/e/effectiveinterest.asp',
    credibility: 'Investopedia content is reviewed by industry professionals.',
    type: 'Article'
  },
  {
    id: 'bond-1',
    topic: 'Bond Valuation',
    category: 'Finance',
    title: 'Bond Valuation: Calculation and Formula',
    description: 'How to calculate the present value of bonds using coupon payments and face value.',
    keywords: ['bond', 'valuation', 'coupon', 'yield', 'face value', 'par value', 'fixed income'],
    formula: 'P = \\sum_{t=1}^{n} \\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^n}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/b/bond-valuation.asp',
    credibility: 'Investopedia is a trusted financial education platform.',
    type: 'Article'
  },
  {
    id: 'stock-1',
    topic: 'Stock Valuation',
    category: 'Finance',
    title: 'Stock Valuation Methods: DCF and DDM',
    description: 'Overview of stock valuation techniques including discounted cash flow and dividend discount models.',
    keywords: ['stock', 'valuation', 'dcf', 'ddm', 'dividend', 'equity', 'shares'],
    formula: 'P_0 = \\frac{D_1}{r-g}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/s/stockvaluation.asp',
    credibility: 'Investopedia provides peer-reviewed financial content.',
    type: 'Article'
  },
  {
    id: 'capm-1',
    topic: 'Capital Asset Pricing Model',
    category: 'Finance',
    title: 'CAPM - Capital Asset Pricing Model',
    description: 'Explanation of CAPM formula, beta, and systematic risk in portfolio management.',
    keywords: ['capm', 'beta', 'systematic risk', 'market risk', 'expected return', 'sml'],
    formula: 'E(R_i) = R_f + \\beta_i(E(R_m) - R_f)',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/c/capm.asp',
    credibility: 'Investopedia is a leading financial education resource.',
    type: 'Article'
  },
  {
    id: 'wacc-1',
    topic: 'Cost of Capital',
    category: 'Finance',
    title: 'WACC - Weighted Average Cost of Capital',
    description: 'How to calculate a company\'s cost of capital using debt and equity components.',
    keywords: ['wacc', 'cost of capital', 'cost of equity', 'cost of debt', 'capital structure'],
    formula: 'WACC = \\frac{E}{V}R_e + \\frac{D}{V}R_d(1-T)',
    source: 'Corporate Finance Institute',
    sourceUrl: 'https://corporatefinanceinstitute.com/resources/valuation/what-is-wacc-formula/',
    credibility: 'CFI is a globally recognized financial education provider.',
    type: 'Professional Guide'
  },
  // Taxation Resources
  {
    id: 'tax-1',
    topic: 'Taxation',
    category: 'Finance',
    title: 'Introduction to Taxation - Khan Academy',
    description: 'Understanding tax systems, progressive vs regressive taxes, and how taxation affects personal finance.',
    keywords: ['taxation', 'tax', 'income tax', 'progressive tax', 'regressive tax', 'tax system'],
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/economics-finance-domain/core-finance/taxes-topic',
    credibility: 'Khan Academy provides free, accessible education on taxation basics.',
    type: 'Video Course'
  },
  {
    id: 'tax-2',
    topic: 'Corporate Taxation',
    category: 'Finance',
    title: 'Corporate Tax Basics - Investopedia',
    description: 'Guide to corporate taxation, tax rates, deductions, and tax planning strategies for businesses.',
    keywords: ['corporate tax', 'business tax', 'tax rate', 'deduction', 'tax planning', 'corporate finance'],
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/c/corporatetax.asp',
    credibility: 'Investopedia is a trusted financial education resource.',
    type: 'Article'
  },
  {
    id: 'tax-3',
    topic: 'Tax Policy',
    category: 'Economics',
    title: 'Tax Policy - MIT OCW Public Finance',
    description: 'Academic course on tax theory, optimal taxation, and public finance policy analysis.',
    keywords: ['tax policy', 'public finance', 'optimal taxation', 'fiscal policy', 'government', 'mit'],
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/14-41-public-finance-and-public-policy-fall-2010/',
    credibility: 'MIT\'s public finance course covers taxation theory comprehensively.',
    type: 'University Course'
  },
  {
    id: 'tax-4',
    topic: 'International Taxation',
    category: 'Finance',
    title: 'International Tax Principles',
    description: 'Transfer pricing, tax treaties, cross-border taxation, and multinational tax planning.',
    keywords: ['international tax', 'transfer pricing', 'tax treaty', 'cross-border', 'multinational', 'global tax'],
    source: 'OECD',
    sourceUrl: 'https://www.oecd.org/tax/',
    credibility: 'OECD is the authoritative source for international tax standards.',
    type: 'Government Resource'
  },
  {
    id: 'gs-tax-1',
    topic: 'Taxation Research',
    category: 'Finance',
    title: 'Google Scholar: Taxation Research',
    description: 'Academic papers on tax policy, tax avoidance, corporate taxation, and fiscal effects.',
    keywords: ['taxation', 'tax', 'tax policy', 'tax avoidance', 'fiscal', 'corporate tax', 'income tax', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=taxation+policy+economics',
    credibility: 'Peer-reviewed taxation research from economics and accounting journals.',
    type: 'Academic Database'
  },
  {
    id: 'tax-5',
    topic: 'Personal Taxation',
    category: 'Finance',
    title: 'Personal Income Tax Guide',
    description: 'Understanding personal income tax, tax brackets, deductions, credits, and tax-efficient investing.',
    keywords: ['personal tax', 'income tax', 'tax bracket', 'deduction', 'tax credit', 'tax return'],
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/i/incometax.asp',
    credibility: 'Comprehensive personal tax education from trusted financial resource.',
    type: 'Article'
  },
  {
    id: 'tax-6',
    topic: 'Tax Accounting',
    category: 'Finance',
    title: 'Tax Accounting Principles',
    description: 'Deferred taxes, tax provisions, GAAP vs tax reporting, and corporate tax accounting.',
    keywords: ['tax accounting', 'deferred tax', 'tax provision', 'gaap', 'financial reporting', 'accounting'],
    source: 'Corporate Finance Institute',
    sourceUrl: 'https://corporatefinanceinstitute.com/resources/accounting/deferred-tax-asset/',
    credibility: 'CFI provides professional-level tax accounting education.',
    type: 'Professional Guide'
  },

  // ==================== MATHEMATICS ====================
  {
    id: 'math-calc-1',
    topic: 'Calculus',
    category: 'Mathematics',
    title: 'Differential Calculus - MIT OpenCourseWare',
    description: 'Complete MIT course on single variable calculus covering derivatives, limits, and applications.',
    keywords: ['calculus', 'derivative', 'differentiation', 'limits', 'mit', 'math'],
    formula: '\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/',
    credibility: 'MIT OCW provides free access to MIT course materials used by millions globally.',
    type: 'University Course'
  },
  {
    id: 'math-calc-2',
    topic: 'Calculus',
    category: 'Mathematics',
    title: 'Integral Calculus - Khan Academy',
    description: 'Video lectures on integration techniques, definite integrals, and applications of integration.',
    keywords: ['calculus', 'integral', 'integration', 'antiderivative', 'area', 'khan'],
    formula: '\\int_a^b f(x)dx = F(b) - F(a)',
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/math/calculus-1',
    credibility: 'Khan Academy is a nonprofit providing free world-class education.',
    type: 'Video Course'
  },
  {
    id: 'math-calc-3',
    topic: 'Multivariable Calculus',
    category: 'Mathematics',
    title: 'Multivariable Calculus - MIT',
    description: 'Covers partial derivatives, multiple integrals, vector calculus, and applications.',
    keywords: ['multivariable', 'partial derivative', 'gradient', 'vector calculus', 'mit'],
    formula: '\\nabla f = \\frac{\\partial f}{\\partial x}\\hat{i} + \\frac{\\partial f}{\\partial y}\\hat{j} + \\frac{\\partial f}{\\partial z}\\hat{k}',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/',
    credibility: 'MIT OpenCourseWare is a trusted academic resource.',
    type: 'University Course'
  },
  {
    id: 'math-la-1',
    topic: 'Linear Algebra',
    category: 'Mathematics',
    title: 'Linear Algebra - Gilbert Strang (MIT)',
    description: 'Legendary MIT course covering vectors, matrices, eigenvalues, and linear transformations.',
    keywords: ['linear algebra', 'matrix', 'vector', 'eigenvalue', 'eigenvector', 'strang'],
    formula: 'A\\vec{x} = \\lambda\\vec{x}',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    credibility: 'Prof. Strang\'s linear algebra course is one of the most popular mathematics courses online.',
    type: 'University Course'
  },
  {
    id: 'math-la-2',
    topic: 'Linear Algebra',
    category: 'Mathematics',
    title: 'Essence of Linear Algebra - 3Blue1Brown',
    description: 'Visual and intuitive explanations of linear algebra concepts with beautiful animations.',
    keywords: ['linear algebra', 'vectors', 'matrices', 'transformation', 'visual', '3blue1brown'],
    source: '3Blue1Brown',
    sourceUrl: 'https://www.3blue1brown.com/topics/linear-algebra',
    credibility: '3Blue1Brown is renowned for making complex mathematics visually intuitive.',
    type: 'Video Series'
  },
  {
    id: 'math-diffeq-1',
    topic: 'Differential Equations',
    category: 'Mathematics',
    title: 'Differential Equations - MIT OCW',
    description: 'Covers ODEs, systems of equations, Laplace transforms, and numerical methods.',
    keywords: ['differential equation', 'ode', 'pde', 'laplace', 'solve', 'mit'],
    formula: '\\frac{dy}{dx} + P(x)y = Q(x)',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/',
    credibility: 'MIT OpenCourseWare provides rigorous academic content.',
    type: 'University Course'
  },
  {
    id: 'math-trig-1',
    topic: 'Trigonometry',
    category: 'Mathematics',
    title: 'Trigonometry - Khan Academy',
    description: 'Complete trigonometry course: unit circle, identities, graphs, and applications.',
    keywords: ['trigonometry', 'sin', 'cos', 'tan', 'unit circle', 'identities', 'trig'],
    formula: '\\sin^2\\theta + \\cos^2\\theta = 1',
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/math/trigonometry',
    credibility: 'Khan Academy provides free, high-quality education.',
    type: 'Video Course'
  },
  {
    id: 'math-discrete-1',
    topic: 'Discrete Mathematics',
    category: 'Mathematics',
    title: 'Mathematics for Computer Science - MIT',
    description: 'Covers logic, proofs, number theory, counting, and graph theory.',
    keywords: ['discrete math', 'logic', 'proof', 'combinatorics', 'graph theory', 'sets'],
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
    credibility: 'MIT\'s foundational mathematics course for CS students.',
    type: 'University Course'
  },

  // ==================== STATISTICS ====================
  {
    id: 'stat-intro-1',
    topic: 'Introduction to Statistics',
    category: 'Statistics',
    title: 'Statistics and Probability - Khan Academy',
    description: 'Comprehensive course on descriptive statistics, probability, and inferential statistics.',
    keywords: ['statistics', 'probability', 'mean', 'median', 'mode', 'standard deviation'],
    formula: '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n}x_i',
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/math/statistics-probability',
    credibility: 'Khan Academy is trusted by millions of students worldwide.',
    type: 'Video Course'
  },
  {
    id: 'stat-intro-2',
    topic: 'Introduction to Statistics',
    category: 'Statistics',
    title: 'Introduction to Statistics - MIT OCW',
    description: 'MIT\'s introductory statistics course covering data analysis and probability.',
    keywords: ['statistics', 'probability', 'mit', 'data analysis', 'inference'],
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/',
    credibility: 'MIT OCW is a leading provider of free academic courses.',
    type: 'University Course'
  },
  {
    id: 'stat-prob-1',
    topic: 'Probability Theory',
    category: 'Statistics',
    title: 'Probability Theory - Harvard',
    description: 'Harvard\'s Statistics 110 course - comprehensive probability theory with applications.',
    keywords: ['probability', 'bayes', 'conditional', 'random variable', 'distribution', 'harvard'],
    formula: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}',
    source: 'Harvard University',
    sourceUrl: 'https://projects.iq.harvard.edu/stat110',
    credibility: 'Harvard\'s most popular statistics course, taught by Prof. Joe Blitzstein.',
    type: 'University Course'
  },
  {
    id: 'stat-dist-1',
    topic: 'Probability Distributions',
    category: 'Statistics',
    title: 'Common Probability Distributions',
    description: 'Guide to normal, binomial, Poisson, and other common probability distributions.',
    keywords: ['distribution', 'normal', 'binomial', 'poisson', 'exponential', 'probability'],
    formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
    source: 'Stat Trek',
    sourceUrl: 'https://stattrek.com/probability-distributions/probability-distribution',
    credibility: 'Stat Trek is a trusted resource for statistics education.',
    type: 'Article'
  },
  {
    id: 'stat-hyp-1',
    topic: 'Hypothesis Testing',
    category: 'Statistics',
    title: 'Hypothesis Testing Explained',
    description: 'Understanding null hypothesis, p-values, confidence intervals, and statistical significance.',
    keywords: ['hypothesis', 'p-value', 'significance', 'null', 'alternative', 'test', 't-test', 'z-test'],
    formula: 'z = \\frac{\\bar{x} - \\mu}{\\sigma/\\sqrt{n}}',
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample',
    credibility: 'Khan Academy provides clear, accessible statistics education.',
    type: 'Video Course'
  },
  {
    id: 'stat-reg-1',
    topic: 'Regression Analysis',
    category: 'Statistics',
    title: 'Linear Regression - Penn State',
    description: 'Comprehensive guide to simple and multiple linear regression analysis.',
    keywords: ['regression', 'linear regression', 'correlation', 'r-squared', 'least squares'],
    formula: 'y = \\beta_0 + \\beta_1 x + \\epsilon',
    source: 'Penn State Eberly College of Science',
    sourceUrl: 'https://online.stat.psu.edu/stat501/',
    credibility: 'Penn State\'s STAT 501 is a rigorous regression methods course.',
    type: 'University Course'
  },
  {
    id: 'stat-bayes-1',
    topic: 'Bayesian Statistics',
    category: 'Statistics',
    title: 'Bayesian Statistics Fundamentals',
    description: 'Introduction to Bayesian inference, prior and posterior distributions.',
    keywords: ['bayesian', 'bayes', 'prior', 'posterior', 'inference', 'probability'],
    formula: 'P(\\theta|X) = \\frac{P(X|\\theta)P(\\theta)}{P(X)}',
    source: 'Count Bayesie',
    sourceUrl: 'https://www.countbayesie.com/blog/2015/2/18/hans-solo-and-bayesian-priors',
    credibility: 'Popular blog making Bayesian statistics accessible and fun.',
    type: 'Article'
  },

  // ==================== PHYSICS ====================
  {
    id: 'phys-mech-1',
    topic: 'Classical Mechanics',
    category: 'Physics',
    title: 'Classical Mechanics - MIT OCW',
    description: 'MIT\'s foundational physics course covering Newtonian mechanics, energy, and momentum.',
    keywords: ['mechanics', 'newton', 'force', 'motion', 'energy', 'momentum', 'physics'],
    formula: 'F = ma',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/',
    credibility: 'MIT\'s Physics I course is the foundation for physics education.',
    type: 'University Course'
  },
  {
    id: 'phys-mech-2',
    topic: 'Classical Mechanics',
    category: 'Physics',
    title: 'Khan Academy Physics',
    description: 'Covers kinematics, forces, work, energy, and momentum with clear explanations.',
    keywords: ['physics', 'kinematics', 'velocity', 'acceleration', 'force', 'energy'],
    formula: 'v = v_0 + at',
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/science/physics',
    credibility: 'Khan Academy is a trusted free educational resource.',
    type: 'Video Course'
  },
  {
    id: 'phys-em-1',
    topic: 'Electromagnetism',
    category: 'Physics',
    title: 'Electricity and Magnetism - MIT',
    description: 'Covers electric fields, circuits, magnetism, and Maxwell\'s equations.',
    keywords: ['electricity', 'magnetism', 'electromagnetic', 'circuit', 'maxwell', 'field'],
    formula: '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/',
    credibility: 'MIT Physics II is a rigorous electromagnetism course.',
    type: 'University Course'
  },
  {
    id: 'phys-thermo-1',
    topic: 'Thermodynamics',
    category: 'Physics',
    title: 'Thermodynamics - Khan Academy',
    description: 'Laws of thermodynamics, heat, work, and entropy explained clearly.',
    keywords: ['thermodynamics', 'heat', 'entropy', 'temperature', 'energy', 'law'],
    formula: '\\Delta S \\geq 0',
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/science/physics/thermodynamics',
    credibility: 'Khan Academy provides accessible science education.',
    type: 'Video Course'
  },
  {
    id: 'phys-quantum-1',
    topic: 'Quantum Mechanics',
    category: 'Physics',
    title: 'Quantum Physics - MIT OCW',
    description: 'Introduction to wave-particle duality, uncertainty principle, and quantum states.',
    keywords: ['quantum', 'wave function', 'schrodinger', 'uncertainty', 'particle'],
    formula: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/',
    credibility: 'MIT\'s Quantum Physics course is world-renowned.',
    type: 'University Course'
  },
  {
    id: 'phys-wave-1',
    topic: 'Waves and Optics',
    category: 'Physics',
    title: 'Vibrations and Waves - MIT',
    description: 'Covers wave motion, interference, diffraction, and optics.',
    keywords: ['waves', 'optics', 'interference', 'diffraction', 'light', 'sound'],
    formula: 'v = f\\lambda',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/',
    credibility: 'MIT Physics III provides comprehensive wave mechanics education.',
    type: 'University Course'
  },
  {
    id: 'phys-rel-1',
    topic: 'Relativity',
    category: 'Physics',
    title: 'Special Relativity - Stanford',
    description: 'Leonard Susskind\'s lectures on special relativity and spacetime.',
    keywords: ['relativity', 'einstein', 'spacetime', 'lorentz', 'time dilation'],
    formula: 'E = mc^2',
    source: 'Stanford Online',
    sourceUrl: 'https://www.youtube.com/playlist?list=PL6i60qoDQhQGaGbbg-4aSwXJvxOqO6o5e',
    credibility: 'Stanford\'s Leonard Susskind is a world-famous theoretical physicist.',
    type: 'Video Lectures'
  },

  // ==================== ECONOMICS ====================
  {
    id: 'econ-micro-1',
    topic: 'Microeconomics',
    category: 'Economics',
    title: 'Principles of Microeconomics - MIT',
    description: 'Supply and demand, consumer theory, market structures, and welfare economics.',
    keywords: ['microeconomics', 'supply', 'demand', 'equilibrium', 'elasticity', 'market'],
    formula: 'Q_d = Q_s',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2018/',
    credibility: 'MIT\'s intro economics course is academically rigorous.',
    type: 'University Course'
  },
  {
    id: 'econ-micro-2',
    topic: 'Microeconomics',
    category: 'Economics',
    title: 'Microeconomics - Khan Academy',
    description: 'Clear explanations of supply, demand, elasticity, and consumer choice.',
    keywords: ['microeconomics', 'supply', 'demand', 'consumer', 'producer', 'surplus'],
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/economics-finance-domain/microeconomics',
    credibility: 'Khan Academy makes economics accessible to everyone.',
    type: 'Video Course'
  },
  {
    id: 'econ-macro-1',
    topic: 'Macroeconomics',
    category: 'Economics',
    title: 'Principles of Macroeconomics - MIT',
    description: 'GDP, inflation, unemployment, monetary and fiscal policy.',
    keywords: ['macroeconomics', 'gdp', 'inflation', 'unemployment', 'policy', 'growth'],
    formula: 'GDP = C + I + G + (X - M)',
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/14-02-principles-of-macroeconomics-fall-2023/',
    credibility: 'MIT\'s macroeconomics course is widely respected.',
    type: 'University Course'
  },
  {
    id: 'econ-game-1',
    topic: 'Game Theory',
    category: 'Economics',
    title: 'Game Theory - Yale (Ben Polak)',
    description: 'Famous Yale course on strategic thinking, Nash equilibrium, and applications.',
    keywords: ['game theory', 'nash', 'equilibrium', 'strategy', 'payoff', 'prisoner dilemma'],
    source: 'Yale Open Courses',
    sourceUrl: 'https://oyc.yale.edu/economics/econ-159',
    credibility: 'Yale\'s Open Courses provide Ivy League education for free.',
    type: 'University Course'
  },
  {
    id: 'econ-econometrics-1',
    topic: 'Econometrics',
    category: 'Economics',
    title: 'Introduction to Econometrics - MIT',
    description: 'Statistical methods for economic data analysis and causal inference.',
    keywords: ['econometrics', 'regression', 'causal', 'instrumental', 'ols', 'inference'],
    source: 'MIT OpenCourseWare',
    sourceUrl: 'https://ocw.mit.edu/courses/14-32-econometrics-spring-2007/',
    credibility: 'MIT\'s econometrics course is academically rigorous.',
    type: 'University Course'
  },
  {
    id: 'econ-behavioral-1',
    topic: 'Behavioral Economics',
    category: 'Economics',
    title: 'Behavioral Economics - Duke (Dan Ariely)',
    description: 'Understanding irrational behavior in economic decisions.',
    keywords: ['behavioral', 'psychology', 'irrational', 'bias', 'decision', 'ariely'],
    source: 'Coursera / Duke University',
    sourceUrl: 'https://www.coursera.org/learn/duke-behavioral-economics',
    credibility: 'Dan Ariely is a renowned behavioral economist.',
    type: 'Online Course'
  },

  // ==================== GOOGLE SCHOLAR & ACADEMIC PAPERS ====================
  // Finance Academic Papers
  {
    id: 'gs-finance-1',
    topic: 'Asset Pricing',
    category: 'Finance',
    title: 'Google Scholar: Asset Pricing Research',
    description: 'Search academic papers on asset pricing, CAPM, factor models, and risk premiums from peer-reviewed journals.',
    keywords: ['asset pricing', 'capm', 'fama french', 'factor model', 'risk premium', 'academic', 'research', 'paper'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=asset+pricing+models+finance',
    credibility: 'Google Scholar indexes peer-reviewed academic papers from reputable journals worldwide.',
    type: 'Academic Database'
  },
  {
    id: 'gs-finance-2',
    topic: 'Corporate Finance',
    category: 'Finance',
    title: 'Google Scholar: Capital Structure Research',
    description: 'Academic papers on capital structure, Modigliani-Miller, leverage, and financing decisions.',
    keywords: ['capital structure', 'modigliani miller', 'leverage', 'debt', 'equity', 'financing', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=capital+structure+corporate+finance',
    credibility: 'Access to thousands of peer-reviewed corporate finance papers.',
    type: 'Academic Database'
  },
  {
    id: 'gs-finance-3',
    topic: 'Portfolio Theory',
    category: 'Finance',
    title: 'Google Scholar: Portfolio Management Research',
    description: 'Academic research on portfolio optimization, diversification, and modern portfolio theory.',
    keywords: ['portfolio', 'markowitz', 'optimization', 'diversification', 'efficient frontier', 'mpt', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=portfolio+optimization+markowitz',
    credibility: 'Peer-reviewed research from leading finance journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-finance-4',
    topic: 'Market Efficiency',
    category: 'Finance',
    title: 'Google Scholar: Efficient Market Hypothesis',
    description: 'Research papers on EMH, market anomalies, behavioral finance, and price discovery.',
    keywords: ['efficient market', 'emh', 'market anomaly', 'behavioral finance', 'price discovery', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=efficient+market+hypothesis+finance',
    credibility: 'Academic papers from top finance and economics journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-finance-5',
    topic: 'Derivatives',
    category: 'Finance',
    title: 'Google Scholar: Options and Derivatives Research',
    description: 'Academic papers on options pricing, Black-Scholes, futures, and derivatives markets.',
    keywords: ['options', 'derivatives', 'black scholes', 'futures', 'hedging', 'pricing', 'academic'],
    formula: 'C = S_0N(d_1) - Ke^{-rT}N(d_2)',
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=options+pricing+black+scholes',
    credibility: 'Peer-reviewed derivatives research from academic journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-finance-6',
    topic: 'Risk Management',
    category: 'Finance',
    title: 'Google Scholar: Risk Management Research',
    description: 'Academic papers on VaR, risk measurement, hedging strategies, and financial risk.',
    keywords: ['risk management', 'var', 'value at risk', 'hedging', 'credit risk', 'market risk', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=financial+risk+management+var',
    credibility: 'Research from risk management and finance journals.',
    type: 'Academic Database'
  },

  // Mathematics Academic Papers
  {
    id: 'gs-math-1',
    topic: 'Number Theory',
    category: 'Mathematics',
    title: 'Google Scholar: Number Theory Research',
    description: 'Academic papers on prime numbers, cryptography, algebraic number theory, and analytic methods.',
    keywords: ['number theory', 'prime numbers', 'cryptography', 'algebraic', 'fermat', 'riemann', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=number+theory+mathematics',
    credibility: 'Peer-reviewed mathematics papers from leading journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-math-2',
    topic: 'Analysis',
    category: 'Mathematics',
    title: 'Google Scholar: Mathematical Analysis Research',
    description: 'Academic papers on real analysis, complex analysis, functional analysis, and measure theory.',
    keywords: ['analysis', 'real analysis', 'complex analysis', 'functional analysis', 'measure theory', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=mathematical+analysis+real+complex',
    credibility: 'Research from top mathematics journals worldwide.',
    type: 'Academic Database'
  },
  {
    id: 'gs-math-3',
    topic: 'Applied Mathematics',
    category: 'Mathematics',
    title: 'Google Scholar: Applied Mathematics Research',
    description: 'Academic papers on numerical methods, optimization, mathematical modeling, and applications.',
    keywords: ['applied mathematics', 'numerical methods', 'optimization', 'modeling', 'simulation', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=applied+mathematics+numerical+methods',
    credibility: 'Peer-reviewed applied mathematics research.',
    type: 'Academic Database'
  },

  // Statistics Academic Papers
  {
    id: 'gs-stat-1',
    topic: 'Statistical Methods',
    category: 'Statistics',
    title: 'Google Scholar: Statistical Methodology Research',
    description: 'Academic papers on regression, ANOVA, non-parametric methods, and statistical inference.',
    keywords: ['statistical methods', 'regression', 'anova', 'inference', 'estimation', 'hypothesis testing', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=statistical+methods+regression+inference',
    credibility: 'Papers from top statistics journals like JASA, Biometrika, and Annals of Statistics.',
    type: 'Academic Database'
  },
  {
    id: 'gs-stat-2',
    topic: 'Machine Learning',
    category: 'Statistics',
    title: 'Google Scholar: Machine Learning Research',
    description: 'Academic papers on supervised learning, neural networks, deep learning, and statistical learning.',
    keywords: ['machine learning', 'deep learning', 'neural network', 'classification', 'prediction', 'ai', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=machine+learning+deep+learning+statistics',
    credibility: 'Research from JMLR, NeurIPS, ICML, and other leading ML venues.',
    type: 'Academic Database'
  },
  {
    id: 'gs-stat-3',
    topic: 'Biostatistics',
    category: 'Statistics',
    title: 'Google Scholar: Biostatistics Research',
    description: 'Academic papers on clinical trials, survival analysis, epidemiology, and medical statistics.',
    keywords: ['biostatistics', 'clinical trial', 'survival analysis', 'epidemiology', 'medical statistics', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=biostatistics+clinical+trials+survival+analysis',
    credibility: 'Peer-reviewed biostatistics research from medical and statistical journals.',
    type: 'Academic Database'
  },

  // Physics Academic Papers
  {
    id: 'gs-phys-1',
    topic: 'Quantum Physics',
    category: 'Physics',
    title: 'Google Scholar: Quantum Mechanics Research',
    description: 'Academic papers on quantum computing, entanglement, quantum field theory, and foundations.',
    keywords: ['quantum mechanics', 'quantum computing', 'entanglement', 'qft', 'wave function', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=quantum+mechanics+entanglement+computing',
    credibility: 'Research from Physical Review, Nature Physics, and other leading journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-phys-2',
    topic: 'Condensed Matter',
    category: 'Physics',
    title: 'Google Scholar: Condensed Matter Research',
    description: 'Academic papers on superconductivity, semiconductors, materials physics, and solid state.',
    keywords: ['condensed matter', 'superconductivity', 'semiconductor', 'solid state', 'materials', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=condensed+matter+physics+superconductivity',
    credibility: 'Peer-reviewed condensed matter physics research.',
    type: 'Academic Database'
  },
  {
    id: 'gs-phys-3',
    topic: 'Astrophysics',
    category: 'Physics',
    title: 'Google Scholar: Astrophysics Research',
    description: 'Academic papers on cosmology, black holes, dark matter, and astronomical observations.',
    keywords: ['astrophysics', 'cosmology', 'black hole', 'dark matter', 'dark energy', 'astronomy', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=astrophysics+cosmology+dark+matter',
    credibility: 'Research from ApJ, MNRAS, A&A, and other astronomy journals.',
    type: 'Academic Database'
  },

  // Economics Academic Papers
  {
    id: 'gs-econ-1',
    topic: 'Development Economics',
    category: 'Economics',
    title: 'Google Scholar: Development Economics Research',
    description: 'Academic papers on poverty, growth, inequality, and economic development.',
    keywords: ['development economics', 'poverty', 'growth', 'inequality', 'developing countries', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=development+economics+poverty+growth',
    credibility: 'Research from AER, QJE, Econometrica, and development journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-econ-2',
    topic: 'Labor Economics',
    category: 'Economics',
    title: 'Google Scholar: Labor Economics Research',
    description: 'Academic papers on employment, wages, human capital, and labor markets.',
    keywords: ['labor economics', 'employment', 'wages', 'human capital', 'unemployment', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=labor+economics+employment+wages',
    credibility: 'Peer-reviewed labor economics research.',
    type: 'Academic Database'
  },
  {
    id: 'gs-econ-3',
    topic: 'International Trade',
    category: 'Economics',
    title: 'Google Scholar: International Trade Research',
    description: 'Academic papers on trade policy, tariffs, globalization, and comparative advantage.',
    keywords: ['international trade', 'tariffs', 'globalization', 'comparative advantage', 'exports', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=international+trade+economics+tariffs',
    credibility: 'Research from leading international economics journals.',
    type: 'Academic Database'
  },

  // Additional Academic Resources - Open Access Journals
  {
    id: 'arxiv-1',
    topic: 'Quantitative Finance',
    category: 'Finance',
    title: 'arXiv: Quantitative Finance Papers',
    description: 'Preprints and working papers on quantitative finance, algorithmic trading, and financial mathematics.',
    keywords: ['quantitative finance', 'algorithmic trading', 'financial mathematics', 'preprint', 'arxiv', 'academic'],
    source: 'arXiv.org',
    sourceUrl: 'https://arxiv.org/list/q-fin/recent',
    credibility: 'arXiv is a trusted preprint server hosted by Cornell University.',
    type: 'Preprint Server'
  },
  {
    id: 'arxiv-2',
    topic: 'Mathematics',
    category: 'Mathematics',
    title: 'arXiv: Mathematics Papers',
    description: 'Latest mathematics research including algebra, analysis, geometry, and applied math.',
    keywords: ['mathematics', 'algebra', 'geometry', 'topology', 'preprint', 'arxiv', 'research'],
    source: 'arXiv.org',
    sourceUrl: 'https://arxiv.org/list/math/recent',
    credibility: 'arXiv hosts preprints from mathematicians worldwide.',
    type: 'Preprint Server'
  },
  {
    id: 'arxiv-3',
    topic: 'Statistics',
    category: 'Statistics',
    title: 'arXiv: Statistics Papers',
    description: 'Preprints on statistical theory, machine learning, methodology, and applications.',
    keywords: ['statistics', 'machine learning', 'methodology', 'preprint', 'arxiv', 'research'],
    source: 'arXiv.org',
    sourceUrl: 'https://arxiv.org/list/stat/recent',
    credibility: 'Leading preprint server for statistics research.',
    type: 'Preprint Server'
  },
  {
    id: 'arxiv-4',
    topic: 'Physics',
    category: 'Physics',
    title: 'arXiv: Physics Papers',
    description: 'Preprints across all physics subdisciplines from researchers worldwide.',
    keywords: ['physics', 'quantum', 'condensed matter', 'high energy', 'preprint', 'arxiv', 'research'],
    source: 'arXiv.org',
    sourceUrl: 'https://arxiv.org/list/physics/recent',
    credibility: 'The original preprint server, foundational to physics research.',
    type: 'Preprint Server'
  },
  {
    id: 'arxiv-5',
    topic: 'Economics',
    category: 'Economics',
    title: 'arXiv: Economics Papers',
    description: 'Working papers on economic theory, econometrics, and quantitative economics.',
    keywords: ['economics', 'econometrics', 'economic theory', 'preprint', 'arxiv', 'research'],
    source: 'arXiv.org',
    sourceUrl: 'https://arxiv.org/list/econ/recent',
    credibility: 'Growing repository of economics research.',
    type: 'Preprint Server'
  },

  // NBER and SSRN
  {
    id: 'nber-1',
    topic: 'Economics Research',
    category: 'Economics',
    title: 'NBER Working Papers',
    description: 'Working papers from the National Bureau of Economic Research on all economics topics.',
    keywords: ['nber', 'working paper', 'economics', 'research', 'policy', 'macroeconomics', 'academic'],
    source: 'NBER',
    sourceUrl: 'https://www.nber.org/papers',
    credibility: 'NBER is the premier economics research organization in the United States.',
    type: 'Working Papers'
  },
  {
    id: 'ssrn-1',
    topic: 'Finance Research',
    category: 'Finance',
    title: 'SSRN Finance Network',
    description: 'Working papers and preprints on all finance topics from researchers worldwide.',
    keywords: ['ssrn', 'working paper', 'finance', 'research', 'preprint', 'academic'],
    source: 'SSRN',
    sourceUrl: 'https://www.ssrn.com/index.cfm/en/fin/',
    credibility: 'SSRN is the leading social science research network.',
    type: 'Working Papers'
  },
  {
    id: 'ssrn-2',
    topic: 'Economics Research',
    category: 'Economics',
    title: 'SSRN Economics Network',
    description: 'Working papers on economics, public policy, and related social sciences.',
    keywords: ['ssrn', 'working paper', 'economics', 'policy', 'research', 'academic'],
    source: 'SSRN',
    sourceUrl: 'https://www.ssrn.com/index.cfm/en/ern/',
    credibility: 'SSRN hosts research from leading economists globally.',
    type: 'Working Papers'
  },

  // Free Textbooks
  {
    id: 'openstax-1',
    topic: 'Statistics',
    category: 'Statistics',
    title: 'OpenStax: Introductory Statistics',
    description: 'Free peer-reviewed statistics textbook covering descriptive stats, probability, and inference.',
    keywords: ['statistics', 'textbook', 'free', 'openstax', 'intro', 'probability', 'inference'],
    source: 'OpenStax',
    sourceUrl: 'https://openstax.org/details/books/introductory-statistics',
    credibility: 'OpenStax textbooks are peer-reviewed and used at thousands of institutions.',
    type: 'Free Textbook'
  },
  {
    id: 'openstax-2',
    topic: 'Calculus',
    category: 'Mathematics',
    title: 'OpenStax: Calculus (3 volumes)',
    description: 'Complete free calculus textbook series covering single and multivariable calculus.',
    keywords: ['calculus', 'textbook', 'free', 'openstax', 'derivative', 'integral', 'multivariable'],
    source: 'OpenStax',
    sourceUrl: 'https://openstax.org/details/books/calculus-volume-1',
    credibility: 'Peer-reviewed, free textbooks from Rice University.',
    type: 'Free Textbook'
  },
  {
    id: 'openstax-3',
    topic: 'Physics',
    category: 'Physics',
    title: 'OpenStax: University Physics (3 volumes)',
    description: 'Comprehensive free physics textbook covering mechanics, E&M, and modern physics.',
    keywords: ['physics', 'textbook', 'free', 'openstax', 'mechanics', 'electromagnetism', 'quantum'],
    source: 'OpenStax',
    sourceUrl: 'https://openstax.org/details/books/university-physics-volume-1',
    credibility: 'Free, peer-reviewed physics textbook used at universities worldwide.',
    type: 'Free Textbook'
  },
  {
    id: 'openstax-4',
    topic: 'Microeconomics',
    category: 'Economics',
    title: 'OpenStax: Principles of Economics',
    description: 'Free economics textbook covering micro and macroeconomics principles.',
    keywords: ['economics', 'textbook', 'free', 'openstax', 'microeconomics', 'macroeconomics'],
    source: 'OpenStax',
    sourceUrl: 'https://openstax.org/details/books/principles-economics-3e',
    credibility: 'Peer-reviewed free textbook from OpenStax.',
    type: 'Free Textbook'
  },

  // Additional Finance Topics
  {
    id: 'gs-banking-1',
    topic: 'Banking',
    category: 'Finance',
    title: 'Google Scholar: Banking Research',
    description: 'Academic papers on bank regulation, lending, monetary policy transmission, and financial stability.',
    keywords: ['banking', 'bank regulation', 'lending', 'monetary policy', 'financial stability', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=banking+regulation+financial+stability',
    credibility: 'Research from Journal of Banking & Finance, JFE, and other finance journals.',
    type: 'Academic Database'
  },
  {
    id: 'gs-corporate-1',
    topic: 'Corporate Governance',
    category: 'Finance',
    title: 'Google Scholar: Corporate Governance Research',
    description: 'Academic papers on board structure, executive compensation, shareholder rights, and agency theory.',
    keywords: ['corporate governance', 'board', 'executive compensation', 'shareholder', 'agency', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=corporate+governance+board+structure',
    credibility: 'Peer-reviewed corporate governance research.',
    type: 'Academic Database'
  },
  {
    id: 'gs-ipo-1',
    topic: 'IPO and Capital Markets',
    category: 'Finance',
    title: 'Google Scholar: IPO Research',
    description: 'Academic papers on IPO underpricing, SEOs, capital raising, and market microstructure.',
    keywords: ['ipo', 'underpricing', 'capital markets', 'seo', 'equity issuance', 'academic'],
    source: 'Google Scholar',
    sourceUrl: 'https://scholar.google.com/scholar?q=ipo+underpricing+capital+markets',
    credibility: 'Research from top finance and accounting journals.',
    type: 'Academic Database'
  },

  // CFA Institute Resources
  {
    id: 'cfa-1',
    topic: 'Investment Management',
    category: 'Finance',
    title: 'CFA Institute Research Foundation',
    description: 'Professional research publications on portfolio management, ethics, and investment practices.',
    keywords: ['cfa', 'investment', 'portfolio', 'professional', 'ethics', 'research'],
    source: 'CFA Institute',
    sourceUrl: 'https://www.cfainstitute.org/research/foundation',
    credibility: 'CFA Institute is the global association of investment professionals.',
    type: 'Professional Research'
  },

  // Federal Reserve Research
  {
    id: 'fed-1',
    topic: 'Monetary Economics',
    category: 'Economics',
    title: 'Federal Reserve Research Papers',
    description: 'Working papers on monetary policy, financial markets, and economic analysis.',
    keywords: ['federal reserve', 'monetary policy', 'interest rates', 'fed', 'central bank', 'research'],
    source: 'Federal Reserve',
    sourceUrl: 'https://www.federalreserve.gov/econres/feds/index.htm',
    credibility: 'Research from the U.S. central bank economists.',
    type: 'Government Research'
  },

  // World Bank Research
  {
    id: 'worldbank-1',
    topic: 'Development Economics',
    category: 'Economics',
    title: 'World Bank Research Papers',
    description: 'Working papers on development, poverty, growth, and global economic issues.',
    keywords: ['world bank', 'development', 'poverty', 'growth', 'international', 'research'],
    source: 'World Bank',
    sourceUrl: 'https://www.worldbank.org/en/research',
    credibility: 'Research from World Bank economists on global development.',
    type: 'International Organization'
  },

  // IMF Research
  {
    id: 'imf-1',
    topic: 'International Finance',
    category: 'Economics',
    title: 'IMF Working Papers',
    description: 'Research on international monetary systems, exchange rates, and global financial stability.',
    keywords: ['imf', 'international', 'exchange rate', 'monetary', 'global', 'research'],
    source: 'International Monetary Fund',
    sourceUrl: 'https://www.imf.org/en/Publications/WP',
    credibility: 'Research from IMF economists on global finance.',
    type: 'International Organization'
  }
];

// Category colors
const categoryColors = {
  'Finance': 'bg-emerald-900/30 text-emerald-400 border-emerald-700',
  'Mathematics': 'bg-blue-900/30 text-blue-400 border-blue-700',
  'Statistics': 'bg-purple-900/30 text-purple-400 border-purple-700',
  'Physics': 'bg-orange-900/30 text-orange-400 border-orange-700',
  'Economics': 'bg-cyan-900/30 text-cyan-400 border-cyan-700'
};

// Type colors
const typeColors = {
  'Article': 'bg-slate-800/50 text-slate-300 border-slate-600',
  'Video Course': 'bg-red-900/30 text-red-400 border-red-700',
  'Video Series': 'bg-red-900/30 text-red-400 border-red-700',
  'Video Lectures': 'bg-red-900/30 text-red-400 border-red-700',
  'Professional Guide': 'bg-green-900/30 text-green-400 border-green-700',
  'Government Resource': 'bg-amber-900/30 text-amber-400 border-amber-700',
  'Academic Article': 'bg-indigo-900/30 text-indigo-400 border-indigo-700',
  'Professional Certification Material': 'bg-teal-900/30 text-teal-400 border-teal-700',
  'Academic Lecture': 'bg-rose-900/30 text-rose-400 border-rose-700',
  'University Course': 'bg-violet-900/30 text-violet-400 border-violet-700',
  'Online Course': 'bg-pink-900/30 text-pink-400 border-pink-700',
  'Academic Database': 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
  'Preprint Server': 'bg-lime-900/30 text-lime-400 border-lime-700',
  'Working Papers': 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-700',
  'Free Textbook': 'bg-sky-900/30 text-sky-400 border-sky-700',
  'Professional Research': 'bg-teal-900/30 text-teal-400 border-teal-700',
  'Government Research': 'bg-amber-900/30 text-amber-400 border-amber-700',
  'International Organization': 'bg-emerald-900/30 text-emerald-400 border-emerald-700'
};

// Search function
function searchResources(query, selectedCategory = 'All') {
  let filtered = credibleResources;
  
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(r => r.category === selectedCategory);
  }
  
  if (!query || query.trim() === '') return filtered.slice(0, 12);
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  
  return filtered
    .map(resource => {
      let score = 0;
      
      searchTerms.forEach(term => {
        if (resource.keywords.some(k => k.toLowerCase() === term)) score += 10;
        else if (resource.keywords.some(k => k.toLowerCase().includes(term))) score += 5;
        if (resource.category.toLowerCase().includes(term)) score += 9;
        if (resource.title.toLowerCase().includes(term)) score += 8;
        if (resource.topic.toLowerCase().includes(term)) score += 7;
        if (resource.description.toLowerCase().includes(term)) score += 3;
      });
      
      return { ...resource, score };
    })
    .filter(resource => resource.score > 0)
    .sort((a, b) => b.score - a.score);
}

function SearchResultCard({ resource }) {
  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-5 hover:border-nubia-accent/50 transition-colors">
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${categoryColors[resource.category]}`}>
          {resource.category}
        </span>
        <span className="text-xs font-medium text-nubia-accent bg-nubia-accent-subtle px-2 py-0.5 rounded">
          {resource.topic}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${typeColors[resource.type] || 'bg-gray-900/30 text-gray-400 border-gray-700'}`}>
          {resource.type}
        </span>
      </div>
      
      <h3 className="font-sans text-lg font-semibold text-nubia-text mb-2">{resource.title}</h3>
      <p className="text-sm text-nubia-text-secondary mb-3">{resource.description}</p>
      
      {resource.formula && (
        <div className="bg-nubia-bg rounded-md p-3 mb-3 overflow-x-auto">
          <InlineMath math={resource.formula} />
        </div>
      )}
      
      <div className="border-t border-nubia-border pt-3 mt-3">
        <div className="flex items-start gap-2 mb-2">
          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-nubia-text">{resource.source}</p>
            <p className="text-xs text-nubia-text-muted">{resource.credibility}</p>
          </div>
        </div>
        
        <a 
          href={resource.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-nubia-accent hover:text-nubia-accent-hover transition-colors mt-2"
        >
          <span>Visit Source</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

const categories = ['All', 'Finance', 'Mathematics', 'Statistics', 'Physics', 'Economics'];

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'All');

  const results = useMemo(() => searchResources(query, selectedCategory), [query, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputValue);
    const params = {};
    if (inputValue) params.q = inputValue;
    if (selectedCategory !== 'All') params.cat = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const params = {};
    if (query) params.q = query;
    if (cat !== 'All') params.cat = cat;
    setSearchParams(params);
  };

  const suggestions = {
    'All': ['Taxation', 'Calculus', 'Present Value', 'Probability', 'Newton', 'Supply Demand'],
    'Finance': ['Taxation', 'NPV', 'Compound Interest', 'CAPM', 'Bond Valuation', 'WACC', 'Derivatives'],
    'Mathematics': ['Calculus', 'Linear Algebra', 'Differential Equations', 'Trigonometry', 'Algebra'],
    'Statistics': ['Probability', 'Hypothesis Testing', 'Regression', 'Bayesian', 'Machine Learning'],
    'Physics': ['Mechanics', 'Electromagnetism', 'Quantum', 'Thermodynamics', 'Relativity'],
    'Economics': ['Microeconomics', 'Macroeconomics', 'Game Theory', 'GDP', 'Taxation', 'Trade']
  };

  return (
    <div className="py-8 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">Search Academic Resources</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Find credible resources across <span className="text-emerald-400">Finance</span>, <span className="text-blue-400">Mathematics</span>, <span className="text-purple-400">Statistics</span>, <span className="text-orange-400">Physics</span>, and <span className="text-cyan-400">Economics</span>.
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nubia-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search calculus, probability, NPV, quantum physics..."
            className="w-full pl-12 pr-24 py-3 bg-nubia-surface border border-nubia-border rounded-lg text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-nubia-accent text-white'
                  : 'bg-nubia-surface border border-nubia-border text-nubia-text-secondary hover:border-nubia-accent hover:text-nubia-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {!query && (
        <div className="mb-8">
          <p className="text-sm text-nubia-text-muted mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {(suggestions[selectedCategory] || suggestions['All']).map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  setInputValue(suggestion);
                  setQuery(suggestion);
                  const params = { q: suggestion };
                  if (selectedCategory !== 'All') params.cat = selectedCategory;
                  setSearchParams(params);
                }}
                className="px-3 py-1.5 bg-nubia-surface border border-nubia-border rounded-full text-sm text-nubia-text-secondary hover:border-nubia-accent hover:text-nubia-accent transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-nubia-text-secondary">
            {query ? (
              <>Found <span className="font-semibold text-nubia-text">{results.length}</span> results for "{query}"{selectedCategory !== 'All' && ` in ${selectedCategory}`}</>
            ) : (
              <>Showing <span className="font-semibold text-nubia-text">{results.length}</span> resources{selectedCategory !== 'All' && ` in ${selectedCategory}`}</>
            )}
          </p>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setInputValue('');
                setSearchParams(selectedCategory !== 'All' ? { cat: selectedCategory } : {});
              }}
              className="text-sm text-nubia-accent hover:text-nubia-accent-hover transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
        
        {results.length === 0 && query ? (
          <div className="text-center py-8 bg-nubia-surface border border-nubia-border rounded-lg">
            <svg className="w-12 h-12 text-nubia-text-muted mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-nubia-text font-medium mb-2">No local results for "{query}"</p>
            <p className="text-sm text-nubia-text-muted mb-6">Search directly on academic databases below:</p>
            
            {/* Dynamic External Search Links */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto px-4">
              <a
                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-nubia-bg border border-nubia-border rounded-lg hover:border-yellow-500 hover:bg-yellow-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5 12 0z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-nubia-text group-hover:text-yellow-400 transition-colors">Google Scholar</p>
                  <p className="text-xs text-nubia-text-muted">Peer-reviewed papers</p>
                </div>
                <svg className="w-4 h-4 text-nubia-text-muted ml-auto group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a
                href={`https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-nubia-bg border border-nubia-border rounded-lg hover:border-lime-500 hover:bg-lime-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-lime-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lime-400 font-bold text-sm">arXiv</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-nubia-text group-hover:text-lime-400 transition-colors">arXiv.org</p>
                  <p className="text-xs text-nubia-text-muted">Preprints & research</p>
                </div>
                <svg className="w-4 h-4 text-nubia-text-muted ml-auto group-hover:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a
                href={`https://papers.ssrn.com/sol3/results.cfm?txtKey_Words=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-nubia-bg border border-nubia-border rounded-lg hover:border-fuchsia-500 hover:bg-fuchsia-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-fuchsia-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-fuchsia-400 font-bold text-xs">SSRN</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-nubia-text group-hover:text-fuchsia-400 transition-colors">SSRN</p>
                  <p className="text-xs text-nubia-text-muted">Working papers</p>
                </div>
                <svg className="w-4 h-4 text-nubia-text-muted ml-auto group-hover:text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a
                href={`https://www.jstor.org/action/doBasicSearch?Query=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-nubia-bg border border-nubia-border rounded-lg hover:border-red-500 hover:bg-red-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 font-bold text-xs">JSTOR</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-nubia-text group-hover:text-red-400 transition-colors">JSTOR</p>
                  <p className="text-xs text-nubia-text-muted">Academic journals</p>
                </div>
                <svg className="w-4 h-4 text-nubia-text-muted ml-auto group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-nubia-bg border border-nubia-border rounded-lg hover:border-blue-500 hover:bg-blue-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold text-xs">PM</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-nubia-text group-hover:text-blue-400 transition-colors">PubMed</p>
                  <p className="text-xs text-nubia-text-muted">Biomedical research</p>
                </div>
                <svg className="w-4 h-4 text-nubia-text-muted ml-auto group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a
                href={`https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-nubia-bg border border-nubia-border rounded-lg hover:border-indigo-500 hover:bg-indigo-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-400 font-bold text-xs">S2</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-nubia-text group-hover:text-indigo-400 transition-colors">Semantic Scholar</p>
                  <p className="text-xs text-nubia-text-muted">AI-powered search</p>
                </div>
                <svg className="w-4 h-4 text-nubia-text-muted ml-auto group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-nubia-surface border border-nubia-border rounded-lg">
            <p className="text-nubia-text font-medium mb-2">Enter a search term to find resources</p>
            <p className="text-sm text-nubia-text-muted">Or try one of the popular searches above</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {results.map(resource => (
                <SearchResultCard key={resource.id} resource={resource} />
              ))}
            </div>
            
            {/* Always show external search options after results */}
            {query && (
              <div className="mt-6 p-4 bg-nubia-surface-alt border border-nubia-border rounded-lg">
                <p className="text-sm text-nubia-text-secondary mb-3">
                  <span className="font-medium text-nubia-text">Want more?</span> Search "{query}" directly on academic databases:
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-900/20 text-yellow-400 border border-yellow-700 rounded-full text-sm hover:bg-yellow-900/40 transition-colors"
                  >
                    Google Scholar
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href={`https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-900/20 text-lime-400 border border-lime-700 rounded-full text-sm hover:bg-lime-900/40 transition-colors"
                  >
                    arXiv
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href={`https://papers.ssrn.com/sol3/results.cfm?txtKey_Words=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-900/20 text-fuchsia-400 border border-fuchsia-700 rounded-full text-sm hover:bg-fuchsia-900/40 transition-colors"
                  >
                    SSRN
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.jstor.org/action/doBasicSearch?Query=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-700 rounded-full text-sm hover:bg-red-900/40 transition-colors"
                  >
                    JSTOR
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900/20 text-indigo-400 border border-indigo-700 rounded-full text-sm hover:bg-indigo-900/40 transition-colors"
                  >
                    Semantic Scholar
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-8 p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h2 className="font-sans text-lg font-semibold text-nubia-text mb-2">Credible Academic Sources</h2>
            <p className="text-sm text-nubia-text-secondary mb-3">All resources from verified institutions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-nubia-text-secondary">
              <div>
                <li>• <strong>MIT OpenCourseWare</strong> - Free MIT courses</li>
                <li>• <strong>Khan Academy</strong> - Non-profit education</li>
                <li>• <strong>Harvard University</strong> - Statistics 110</li>
              </div>
              <div>
                <li>• <strong>Yale Open Courses</strong> - Free lectures</li>
                <li>• <strong>CFA Institute</strong> - Finance certification</li>
                <li>• <strong>3Blue1Brown</strong> - Visual math</li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
