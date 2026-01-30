import React, { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker - use unpkg as fallback CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

function PDFSummarizer() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0 });
  const fileInputRef = useRef(null);

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

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);
    setSummary(null);
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
    } catch (err) {
      console.error('PDF processing error:', err);
      setError('Error processing PDF. Please try another file.');
    } finally {
      setIsProcessing(false);
      setProgress({ stage: '', percent: 0 });
    }
  }, []);

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
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">PDF Summarizer</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Upload your lecture notes, textbook chapters, or study materials. Get instant summaries with key points extracted.
        </p>
      </div>

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
    </div>
  );
}

export default PDFSummarizer;
