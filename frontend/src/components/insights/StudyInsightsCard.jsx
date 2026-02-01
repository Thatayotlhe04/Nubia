import React, { useState, useEffect } from 'react';
import { useStudyInsights } from '../../contexts/StudyInsightsContext';

function StudyInsightsCard() {
  const { metrics, isActive, formatSessionTime } = useStudyInsights();
  const [currentCard, setCurrentCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cards data
  const cards = [
    {
      id: 'time',
      label: 'Study Time',
      value: formatSessionTime(metrics.sessionTime),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      id: 'topics',
      label: 'Topics Explored',
      value: metrics.topicsViewed?.length || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      id: 'formulas',
      label: 'Formulas Viewed',
      value: metrics.formulasOpened || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      id: 'calculators',
      label: 'Calculations',
      value: metrics.calculatorsUsed || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
    },
  ];

  // Auto-rotate cards every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCard(prev => (prev + 1) % cards.length);
        setIsAnimating(false);
      }, 200);
    }, 4000);

    return () => clearInterval(interval);
  }, [cards.length]);

  const handleCardClick = (index) => {
    if (index !== currentCard) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCard(index);
        setIsAnimating(false);
      }, 200);
    }
  };

  const currentCardData = cards[currentCard];

  return (
    <div className="relative">
      {/* Main Card */}
      <div 
        className={`${currentCardData.bgColor} rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentCardData.color} flex items-center justify-center text-white shadow-sm`}>
              {currentCardData.icon}
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Today's Study
            </span>
          </div>
          {/* Activity indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {isActive ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Metric */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-sans">
            {currentCardData.value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentCardData.label}
          </p>
        </div>

        {/* Card navigation dots */}
        <div className="flex items-center justify-center gap-2">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentCard
                  ? 'w-6 h-2 bg-gradient-to-r ' + currentCardData.color
                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`View ${card.label}`}
            />
          ))}
        </div>
      </div>

      {/* Stacked card previews */}
      <div className="absolute -bottom-2 left-2 right-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-b-xl -z-10 opacity-50" />
      <div className="absolute -bottom-4 left-4 right-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-b-xl -z-20 opacity-30" />
    </div>
  );
}

export default StudyInsightsCard;
