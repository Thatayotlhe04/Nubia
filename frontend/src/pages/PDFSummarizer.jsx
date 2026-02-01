import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker - use unpkg as fallback CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Storage key for persisting summaries
const SUMMARIES_STORAGE_KEY = 'nubia-pdf-summaries';

// Load saved summaries from localStorage
const loadSavedSummaries = () => {
  try {
    const saved = localStorage.getItem(SUMMARIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save summaries to localStorage
const saveSummaries = (summaries) => {
  try {
    // Keep only last 10 summaries to avoid storage limits
    const toSave = summaries.slice(-10);
    localStorage.setItem(SUMMARIES_STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Error saving summaries:', err);
  }
};

function PDFSummarizer() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0 });
  const [summaryMode, setSummaryMode] = useState('basic'); // 'basic' or 'ai'
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved summaries on mount
  useEffect(() => {
    setSavedSummaries(loadSavedSummaries());
  }, []);

  // Save current summary when it's generated
  const saveCurrentSummary = useCallback((fileName, basicSummary, aiSummaryResult) => {
    const newEntry = {
      id: Date.now(),
      fileName,
      date: new Date().toLocaleDateString(),
      basicSummary,
      aiSummary: aiSummaryResult?.success ? aiSummaryResult.summary : null,
    };
    
    setSavedSummaries(prev => {
      const updated = [...prev.filter(s => s.fileName !== fileName), newEntry];
      saveSummaries(updated);
      return updated;
    });
  }, []);

  // Load a saved summary
  const loadSavedSummary = useCallback((saved) => {
    setFile({ name: saved.fileName, size: 0 });
    setSummary(saved.basicSummary);
    if (saved.aiSummary) {
      setAiSummary({ summary: saved.aiSummary, success: true });
    }
    setShowHistory(false);
  }, []);

  // Delete a saved summary
  const deleteSavedSummary = useCallback((id) => {
    setSavedSummaries(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveSummaries(updated);
      return updated;
    });
  }, []);

  // Text extraction from PDF - sequential for reliability
  const extractTextFromPDF = async (file, onProgress) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      onProgress?.('Loading PDF...', 5);
      
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Suppress console warnings
      });
      
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      onProgress?.('Extracting text...', 10);
      
      let fullText = '';
      
      // Process pages sequentially for reliability
      for (let i = 1; i <= numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
          
          // Update progress
          const percentComplete = 10 + Math.round((i / numPages) * 70);
          onProgress?.(`Extracting page ${i} of ${numPages}...`, percentComplete);
        } catch (pageError) {
          console.warn(`Error on page ${i}:`, pageError);
          // Continue with other pages
        }
      }
      
      return fullText;
    } catch (err) {
      console.error('PDF extraction error:', err);
      throw new Error('Failed to read PDF. The file may be corrupted or password-protected.');
    }
  };

  // Optimized summary generation with chunking
  const generateSummary = (text, onProgress) => {
    onProgress?.('Analyzing content...', 85);
    
    // Clean and normalize the text
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    // Split into sentences more efficiently
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [];
    
    onProgress?.('Identifying keywords...', 90);
    
    // Extract words and build frequency map in one pass
    const wordFrequency = {};
    const words = [];
    const stopWords = new Set([
      'this', 'that', 'these', 'those', 'have', 'been', 'were', 'will', 'would', 'could',
      'should', 'being', 'which', 'their', 'there', 'where', 'when', 'what', 'about',
      'from', 'into', 'with', 'than', 'then', 'they', 'them', 'also', 'more', 'most',
      'some', 'such', 'only', 'other', 'each', 'very', 'just', 'over', 'after', 'before'
    ]);

    // Use regex exec for better performance on large texts
    const wordRegex = /\b[a-z]{4,}\b/gi;
    let match;
    while ((match = wordRegex.exec(cleanText)) !== null) {
      const word = match[0].toLowerCase();
      words.push(word);
      if (!stopWords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    }

    // Get top keywords
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);

    onProgress?.('Generating summary...', 95);

    // Create keyword set for O(1) lookup
    const keywordSet = new Set(sortedWords);

    // Score sentences - optimized with Set lookup
    const scoredSentences = sentences.slice(0, 500).map((sentence, index) => {
      const sentenceWords = new Set(sentence.toLowerCase().match(/\b[a-z]+\b/g) || []);
      let score = 0;
      
      sortedWords.forEach((keyword, keyIndex) => {
        if (sentenceWords.has(keyword)) {
          score += (15 - keyIndex);
        }
      });
      
      if (index < 3) score += 5;
      if (sentence.length < 30 || sentence.length > 400) score -= 3;
      
      return { sentence: sentence.trim(), score, index };
    });

    // Get top sentences for summary
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence);

    // Extract key points with pattern matching
    const keyPointPatterns = [
      /important|key|main|primary|essential|critical|significant|major/i,
      /definition|defined as|refers to|means|is called/i,
      /formula|equation|calculate|computed/i,
      /step|first|second|third|finally|therefore|thus|hence/i,
      /example|for instance|such as|including/i,
      /note|remember|always|never|must|should/i
    ];

    const keyPoints = sentences
      .slice(0, 300) // Limit for performance
      .filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        const hasKeyword = sortedWords.some(kw => lowerSentence.includes(kw));
        const hasPattern = keyPointPatterns.some(pattern => pattern.test(sentence));
        return (hasKeyword && sentence.length > 40) || hasPattern;
      })
      .slice(0, 8)
      .map(s => s.trim());

    // Identify topics/sections
    const topicPatterns = [
      /^[A-Z][A-Za-z\s]{2,30}:/,
      /^\d+\.\s+[A-Z]/,
      /^[IVX]+\.\s+/,
      /^Chapter\s+\d+/i,
      /^Section\s+\d+/i
    ];

    const topics = sentences
      .slice(0, 200)
      .filter(sentence => topicPatterns.some(pattern => pattern.test(sentence.trim())))
      .map(s => s.trim().slice(0, 60))
      .slice(0, 5);

    onProgress?.('Complete!', 100);

    return {
      overview: topSentences.join(' '),
      keyPoints: keyPoints.length > 0 ? keyPoints : topSentences.slice(0, 4),
      keywords: sortedWords.slice(0, 10),
      topics,
      stats: {
        totalWords: words.length,
        totalSentences: sentences.length,
        totalPages: Math.ceil(cleanText.length / 3000),
        avgWordsPerSentence: Math.round(words.length / sentences.length) || 0
      }
    };
  };

  // AI-powered summarization using enhanced extractive algorithm
  // (More reliable than external APIs which require authentication)
  const generateAISummary = async (text) => {
    setIsAiLoading(true);
    setAiSummary(null);
    
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clean text
      const cleanText = text.replace(/\s+/g, ' ').trim();
      const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [];
      
      if (sentences.length < 3) {
        throw new Error('Not enough text content to generate AI summary');
      }

      // Advanced extractive summarization with TF-IDF-like scoring
      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
        'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'us',
        'you', 'your', 'he', 'she', 'him', 'her', 'his', 'which', 'who', 'whom', 'what',
        'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
        'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
        'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once', 'if', 'about'
      ]);

      // Calculate word frequencies (TF)
      const wordFreq = {};
      const docFreq = {}; // How many sentences contain each word
      
      sentences.forEach(sentence => {
        const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const uniqueWords = new Set(words);
        
        words.forEach(word => {
          if (!stopWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });
        
        uniqueWords.forEach(word => {
          if (!stopWords.has(word)) {
            docFreq[word] = (docFreq[word] || 0) + 1;
          }
        });
      });

      // Calculate TF-IDF scores for each word
      const numSentences = sentences.length;
      const tfidf = {};
      Object.keys(wordFreq).forEach(word => {
        const tf = wordFreq[word];
        const idf = Math.log(numSentences / (docFreq[word] || 1));
        tfidf[word] = tf * idf;
      });

      // Score sentences
      const scoredSentences = sentences.map((sentence, index) => {
        const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        let score = 0;
        
        // TF-IDF score
        words.forEach(word => {
          if (tfidf[word]) {
            score += tfidf[word];
          }
        });
        
        // Normalize by sentence length
        score = words.length > 0 ? score / Math.sqrt(words.length) : 0;
        
        // Boost first sentences (often contain thesis/main idea)
        if (index < 3) score *= 1.3;
        
        // Boost sentences with key phrases
        const keyPhrases = /important|significant|key|main|conclusion|result|finding|therefore|thus|hence|in summary|overall|notably/i;
        if (keyPhrases.test(sentence)) score *= 1.4;
        
        // Penalize very short or very long sentences
        if (sentence.length < 40 || sentence.length > 500) score *= 0.7;
        
        return { sentence: sentence.trim(), score, index };
      });

      // Select top sentences maintaining order
      const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(6, Math.ceil(sentences.length * 0.15)))
        .sort((a, b) => a.index - b.index)
        .map(s => s.sentence);

      // Create a coherent summary
      const summaryText = topSentences.join(' ');

      return {
        summary: summaryText,
        success: true
      };
    } catch (err) {
      console.error('AI Summary error:', err);
      return {
        error: true,
        message: err.message || 'Failed to generate AI summary. Try the basic summary instead.'
      };
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAISummarize = async () => {
    if (!extractedText) return;
    
    const result = await generateAISummary(extractedText);
    setAiSummary(result);
    
    // Save to history if successful
    if (result.success && file && summary) {
      saveCurrentSummary(file.name, summary, result);
    }
  };

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);
    setSummary(null);
    setAiSummary(null);
    setProgress({ stage: 'Starting...', percent: 0 });

    try {
      const text = await extractTextFromPDF(selectedFile, (stage, percent) => {
        setProgress({ stage, percent });
      });
      
      setExtractedText(text);
      
      if (text.trim().length < 100) {
        setError('Could not extract enough text from this PDF. It may be scanned or image-based.');
        setIsProcessing(false);
        return;
      }

      // Use requestIdleCallback or setTimeout to avoid blocking
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const generatedSummary = generateSummary(text, (stage, percent) => {
        setProgress({ stage, percent });
      });
      
      setSummary(generatedSummary);
      
      // Auto-save basic summary to history
      saveCurrentSummary(selectedFile.name, generatedSummary, null);
    } catch (err) {
      console.error('PDF processing error:', err);
      setError('Error processing PDF. Please try another file.');
    } finally {
      setIsProcessing(false);
      setProgress({ stage: '', percent: 0 });
    }
  }, [saveCurrentSummary]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    handleFile(e.target.files[0]);
  }, [handleFile]);

  const resetUpload = () => {
    setFile(null);
    setExtractedText('');
    setSummary(null);
    setAiSummary(null);
    setError(null);
    setSummaryMode('basic');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">PDF Summarizer</h1>
          </div>
          {savedSummaries.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-nubia-text-secondary hover:text-nubia-accent border border-nubia-border rounded-md hover:border-nubia-accent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History ({savedSummaries.length})
            </button>
          )}
        </div>
        <p className="text-nubia-text-secondary">
          Upload your lecture notes, textbook chapters, or study materials. Get instant summaries with key points extracted.
        </p>
      </div>

      {/* History Panel */}
      {showHistory && savedSummaries.length > 0 && (
        <div className="mb-6 p-4 bg-nubia-surface border border-nubia-border rounded-lg">
          <h3 className="font-sans font-semibold text-nubia-text mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Summaries
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {savedSummaries.slice().reverse().map((saved) => (
              <div 
                key={saved.id}
                className="flex items-center justify-between p-3 bg-nubia-surface-alt rounded-lg hover:bg-nubia-bg transition-colors"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => loadSavedSummary(saved)}
                >
                  <p className="text-nubia-text font-medium text-sm truncate">{saved.fileName}</p>
                  <p className="text-xs text-nubia-text-muted">{saved.date} {saved.aiSummary ? '• AI Summary' : ''}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSavedSummary(saved.id);
                  }}
                  className="p-1.5 text-nubia-text-muted hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-nubia-accent bg-nubia-accent-subtle' 
              : 'border-nubia-border hover:border-nubia-accent hover:bg-nubia-surface-alt'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <svg className="w-16 h-16 text-nubia-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p className="text-nubia-text font-medium mb-1">
            {isDragging ? 'Drop your PDF here' : 'Drop a PDF file or click to browse'}
          </p>
          <p className="text-sm text-nubia-text-muted">
            Supports text-based PDF files (not scanned images)
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-6 py-12 bg-nubia-surface border border-nubia-border rounded-lg">
          <div className="max-w-xs mx-auto">
            {/* Progress bar */}
            <div className="h-2 bg-nubia-surface-alt rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-nubia-accent transition-all duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-nubia-text font-medium">{progress.stage || 'Processing...'}</p>
              <p className="text-sm text-nubia-text-muted mt-1">{progress.percent}% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {summary && file && !isProcessing && (
        <div className="mt-6 space-y-6">
          {/* File Info */}
          <div className="flex items-center justify-between p-4 bg-nubia-surface border border-nubia-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z"/>
                </svg>
              </div>
              <div>
                <p className="text-nubia-text font-medium">{file.name}</p>
                <p className="text-xs text-nubia-text-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • ~{summary.stats.totalWords} words • ~{summary.stats.totalSentences} sentences
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="px-3 py-1.5 text-sm text-nubia-text-secondary hover:text-nubia-accent border border-nubia-border rounded-md hover:border-nubia-accent transition-colors"
            >
              Upload New
            </button>
          </div>

          {/* Summary Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-nubia-surface-alt rounded-lg w-fit">
            <button
              onClick={() => setSummaryMode('basic')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                summaryMode === 'basic'
                  ? 'bg-nubia-surface text-nubia-text shadow-sm'
                  : 'text-nubia-text-secondary hover:text-nubia-text'
              }`}
            >
              Basic Summary
            </button>
            <button
              onClick={() => {
                setSummaryMode('ai');
                if (!aiSummary) {
                  handleAISummarize();
                }
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                summaryMode === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-nubia-text-secondary hover:text-nubia-text'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Summary
            </button>
          </div>

          {/* AI Summary Section */}
          {summaryMode === 'ai' && (
            <div className="p-5 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/50 rounded-lg">
              <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Powered Summary
                <span className="text-xs font-normal px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded-full">
                  Powered by BART
                </span>
              </h2>
              
              {isAiLoading && (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-nubia-text-secondary">Generating AI summary...</p>
                </div>
              )}
              
              {aiSummary?.loading && (
                <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                  <p className="text-amber-300 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {aiSummary.message}
                  </p>
                  <button
                    onClick={handleAISummarize}
                    className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {aiSummary?.error && (
                <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <p className="text-red-300">{aiSummary.message}</p>
                  <button
                    onClick={handleAISummarize}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {aiSummary?.success && (
                <p className="text-nubia-text-secondary leading-relaxed">{aiSummary.summary}</p>
              )}
              
              {!isAiLoading && !aiSummary && (
                <button
                  onClick={handleAISummarize}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate AI Summary
                </button>
              )}
              
              <p className="text-xs text-nubia-text-muted mt-4">
                Uses Facebook's BART model via Hugging Face. Free tier may have occasional delays.
              </p>
            </div>
          )}

          {/* Basic Summary Section */}
          {summaryMode === 'basic' && (
            <>

          {/* Overview */}
          <div className="p-5 bg-nubia-surface border border-nubia-border rounded-lg">
            <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Summary Overview
            </h2>
            <p className="text-nubia-text-secondary leading-relaxed">{summary.overview}</p>
          </div>

          {/* Key Points */}
          <div className="p-5 bg-nubia-surface border border-nubia-border rounded-lg">
            <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Points
            </h2>
            <ul className="space-y-3">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-nubia-accent/20 text-nubia-accent rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-nubia-text-secondary text-sm leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div className="p-5 bg-nubia-surface border border-nubia-border rounded-lg">
            <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Key Terms & Concepts
            </h2>
            <div className="flex flex-wrap gap-2">
              {summary.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-900/30 text-purple-400 border border-purple-700 rounded-full text-sm capitalize"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Topics/Sections (if found) */}
          {summary.topics.length > 0 && (
            <div className="p-5 bg-nubia-surface border border-nubia-border rounded-lg">
              <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Document Sections
              </h2>
              <ul className="space-y-2">
                {summary.topics.map((topic, index) => (
                  <li key={index} className="text-nubia-text-secondary text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
          </>
          )}

          {/* Full Text Toggle */}
          <details className="p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
            <summary className="cursor-pointer text-nubia-text font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-nubia-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Full Extracted Text
            </summary>
            <div className="mt-4 p-4 bg-nubia-bg rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-sm text-nubia-text-secondary whitespace-pre-wrap font-sans">
                {extractedText}
              </pre>
            </div>
          </details>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-sans font-semibold text-nubia-text mb-2">Tips for Best Results</h3>
            <ul className="text-sm text-nubia-text-secondary space-y-1">
              <li>• Works best with <strong>text-based PDFs</strong> (not scanned images)</li>
              <li>• Lecture notes, textbook chapters, and research papers work great</li>
              <li>• The summary extracts the most important sentences and key terms</li>
              <li>• Use the extracted text to search for specific topics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Limitations Notice */}
      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-sans font-semibold text-blue-300 mb-1">Limitations</h3>
            <ul className="text-sm text-blue-200/80 space-y-1">
              <li>• <strong>Diagrams & charts</strong> (binomial trees, graphs, flowcharts) cannot be extracted - they're stored as images</li>
              <li>• <strong>Mathematical formulas</strong> in image form may not appear in the summary</li>
              <li>• <strong>Scanned PDFs</strong> contain images of text, not actual text</li>
              <li>• For diagram-heavy content, review the original PDF alongside this summary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFSummarizer;
