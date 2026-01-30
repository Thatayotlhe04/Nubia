import React, { useState, useRef, useCallback } from 'react';

function Uploads() {
  const [uploads, setUploads] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const newUploads = Array.from(files)
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // MB
        date: new Date().toLocaleDateString(),
        url: URL.createObjectURL(file),
        file: file
      }));
    
    if (newUploads.length > 0) {
      setUploads(prev => [...prev, ...newUploads]);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeUpload = useCallback((id) => {
    setUploads(prev => {
      const upload = prev.find(u => u.id === id);
      if (upload?.url) {
        URL.revokeObjectURL(upload.url);
      }
      return prev.filter(u => u.id !== id);
    });
  }, []);

  const openPdf = useCallback((upload) => {
    window.open(upload.url, '_blank');
  }, []);

  return (
    <div className="py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">My Uploads</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Upload your lecture notes, past papers, and study materials in PDF format. Files are stored locally in your browser.
        </p>
      </div>
      
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-nubia-accent bg-nubia-accent-subtle' 
            : 'border-nubia-border hover:border-nubia-accent hover:bg-nubia-surface-alt'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        
        <svg className="w-12 h-12 text-nubia-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="text-nubia-text font-medium mb-1">
          {isDragging ? 'Drop your PDF here' : 'Drop PDF files here or click to browse'}
        </p>
        <p className="text-sm text-nubia-text-muted">
          Only PDF files are accepted
        </p>
      </div>
      
      {/* Uploaded Files */}
      {uploads.length > 0 && (
        <div className="mt-8">
          <h2 className="font-sans text-lg font-semibold text-nubia-text mb-4">
            Uploaded Files ({uploads.length})
          </h2>
          
          <div className="space-y-3">
            {uploads.map(upload => (
              <div 
                key={upload.id}
                className="flex items-center gap-4 p-4 bg-nubia-surface border border-nubia-border rounded-lg group"
              >
                {/* PDF Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13H10v4H8.5v-1.5H7V14h1.5v-1zm3 0h1.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H11.5v-4zm1.5 3v-2h-.5v2h.5zm2.5-3H18v1h-1.5v.5h1v1h-1v1.5H15v-4z"/>
                  </svg>
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-nubia-text font-medium truncate">{upload.name}</p>
                  <p className="text-xs text-nubia-text-muted">
                    {upload.size} MB • Uploaded {upload.date}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPdf(upload)}
                    className="p-2 rounded-md hover:bg-nubia-surface-alt transition-colors"
                    title="Open PDF"
                  >
                    <svg className="w-5 h-5 text-nubia-text-secondary hover:text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeUpload(upload.id)}
                    className="p-2 rounded-md hover:bg-red-900/20 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-5 h-5 text-nubia-text-secondary hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {uploads.length === 0 && (
        <div className="mt-8 text-center py-8">
          <svg className="w-16 h-16 text-nubia-text-muted mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-nubia-text-muted">No files uploaded yet</p>
        </div>
      )}
      
      {/* Info Section */}
      <div className="mt-8 p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <h2 className="font-sans text-lg font-semibold text-nubia-text mb-3">📁 About Your Uploads</h2>
        <ul className="space-y-2 text-sm text-nubia-text-secondary">
          <li>• Files are stored locally in your browser and will persist until you clear browser data</li>
          <li>• Maximum recommended file size: 25MB per PDF</li>
          <li>• Supported format: PDF only</li>
          <li>• Click on the eye icon to view a PDF in a new tab</li>
        </ul>
      </div>
    </div>
  );
}

export default Uploads;
