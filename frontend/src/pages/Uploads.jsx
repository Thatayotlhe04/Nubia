import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://xeehtoxfleyvydnqznxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZWh0b3hmbGV5dnlkbnF6bnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTkzMzAsImV4cCI6MjA4NTM3NTMzMH0.7ry95_wLdyTgDUwjQ4EO401HF31ddCrHV-1bGW72JbI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to convert file to base64 for localStorage persistence (fallback for non-logged in users)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper to convert base64 back to blob URL
const base64ToUrl = (base64) => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return URL.createObjectURL(blob);
};

function Uploads() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(new Set()); // Track files being uploaded
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const fileInputRef = useRef(null);

  // Load uploads - from Supabase if logged in, localStorage otherwise
  useEffect(() => {
    const loadUploads = async () => {
      setIsLoading(true);
      
      if (user) {
        // Load from Supabase Storage
        setSyncStatus('syncing');
        try {
          const { data: files, error } = await supabase.storage
            .from('user-uploads')
            .list(`${user.id}/`, {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            });
          
          if (error) {
            // Bucket might not exist yet, that's okay
            if (error.message.includes('not found')) {
              console.log('Storage bucket not set up yet - using local storage');
              loadFromLocalStorage();
              setSyncStatus('idle');
              return;
            }
            throw error;
          }
          
          // Get signed URLs for each file
          const uploadsWithUrls = await Promise.all(
            (files || []).filter(f => f.name !== '.emptyFolderPlaceholder').map(async (file) => {
              const { data: urlData } = await supabase.storage
                .from('user-uploads')
                .createSignedUrl(`${user.id}/${file.name}`, 3600); // 1 hour expiry
              
              return {
                id: file.id || file.name,
                name: file.name,
                size: (file.metadata?.size / 1024 / 1024 || 0).toFixed(2),
                date: new Date(file.created_at || Date.now()).toLocaleDateString(),
                url: urlData?.signedUrl || null,
                cloudSynced: true
              };
            })
          );
          
          setUploads(uploadsWithUrls);
          setSyncStatus('synced');
        } catch (error) {
          console.error('Error loading from Supabase:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
          setSyncStatus('error');
        }
      } else {
        // Not logged in - use localStorage
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    };
    
    const loadFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem('nubia-uploads');
        if (saved) {
          const parsed = JSON.parse(saved);
          const restored = parsed.map(upload => ({
            ...upload,
            url: base64ToUrl(upload.base64),
            cloudSynced: false
          }));
          setUploads(restored);
        }
      } catch (error) {
        console.error('Error loading uploads:', error);
      }
    };
    
    loadUploads();
  }, [user]);

  // Save to localStorage for non-logged in users
  useEffect(() => {
    if (isLoading || user) return; // Don't save if logged in (using cloud) or loading
    
    const saveToStorage = async () => {
      try {
        const toSave = uploads.map(({ url, file, cloudSynced, ...rest }) => rest);
        localStorage.setItem('nubia-uploads', JSON.stringify(toSave));
      } catch (error) {
        console.error('Error saving uploads:', error);
      }
    };
    
    saveToStorage();
  }, [uploads, isLoading, user]);

  // Upload file to Supabase Storage
  const uploadToCloud = async (file) => {
    if (!user) return null;
    
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get signed URL
    const { data: urlData } = await supabase.storage
      .from('user-uploads')
      .createSignedUrl(filePath, 3600);
    
    return {
      path: filePath,
      url: urlData?.signedUrl,
      fileName
    };
  };

  const handleFiles = useCallback(async (files) => {
    const validFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (validFiles.length === 0) return;
    
    // Add files with pending status
    const pendingUploads = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      date: new Date().toLocaleDateString(),
      url: URL.createObjectURL(file),
      file: file, // Keep file reference for cloud upload
      cloudSynced: false,
      uploading: true
    }));
    
    setUploads(prev => [...prev, ...pendingUploads]);
    
    // Process each file
    for (const pending of pendingUploads) {
      setUploadingFiles(prev => new Set([...prev, pending.id]));
      
      try {
        if (user) {
          // Upload to cloud
          setSyncStatus('syncing');
          const cloudData = await uploadToCloud(pending.file);
          
          setUploads(prev => prev.map(u => 
            u.id === pending.id 
              ? { ...u, url: cloudData.url, cloudSynced: true, uploading: false, cloudFileName: cloudData.fileName }
              : u
          ));
          setSyncStatus('synced');
        } else {
          // Store locally with base64
          const base64 = await fileToBase64(pending.file);
          setUploads(prev => prev.map(u => 
            u.id === pending.id 
              ? { ...u, base64, uploading: false }
              : u
          ));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Remove failed upload
        setUploads(prev => prev.filter(u => u.id !== pending.id));
        setSyncStatus('error');
      }
      
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(pending.id);
        return newSet;
      });
    }
  }, [user]);

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

  const removeUpload = useCallback(async (id) => {
    const upload = uploads.find(u => u.id === id);
    
    if (upload?.url) {
      URL.revokeObjectURL(upload.url);
    }
    
    // Remove from cloud if logged in and cloud synced
    if (user && upload?.cloudSynced && upload?.cloudFileName) {
      try {
        await supabase.storage
          .from('user-uploads')
          .remove([`${user.id}/${upload.cloudFileName}`]);
      } catch (error) {
        console.error('Error removing from cloud:', error);
      }
    }
    
    setUploads(prev => prev.filter(u => u.id !== id));
  }, [uploads, user]);

  const openPdf = useCallback((upload) => {
    window.open(upload.url, '_blank');
  }, []);

  // Refresh URLs (they expire after 1 hour)
  const refreshUrls = useCallback(async () => {
    if (!user) return;
    
    setSyncStatus('syncing');
    try {
      const refreshedUploads = await Promise.all(
        uploads.map(async (upload) => {
          if (upload.cloudSynced && upload.cloudFileName) {
            const { data: urlData } = await supabase.storage
              .from('user-uploads')
              .createSignedUrl(`${user.id}/${upload.cloudFileName}`, 3600);
            return { ...upload, url: urlData?.signedUrl || upload.url };
          }
          return upload;
        })
      );
      setUploads(refreshedUploads);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error refreshing URLs:', error);
      setSyncStatus('error');
    }
  }, [uploads, user]);

  return (
    <div className="py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">My Uploads</h1>
          </div>
          
          {/* Sync Status Indicator */}
          {user && (
            <div className="flex items-center gap-2">
              {syncStatus === 'syncing' && (
                <div className="flex items-center gap-2 text-sm text-amber-500">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Syncing...</span>
                </div>
              )}
              {syncStatus === 'synced' && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Synced to cloud</span>
                </div>
              )}
              {syncStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sync error</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Cloud Sync Info Banner */}
        {user ? (
          <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span><strong>Cloud sync enabled!</strong> Your files will sync across all devices logged into this account.</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Sign in</strong> to sync your uploads across all your devices (phone, tablet, desktop).</span>
            </div>
          </div>
        )}
        
        <p className="text-nubia-text-secondary">
          Upload your lecture notes, past papers, and study materials in PDF format.
          {user ? ' Files are stored securely in the cloud.' : ' Sign in to enable cloud sync.'}
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
                className={`flex items-center gap-4 p-4 bg-nubia-surface border border-nubia-border rounded-lg group ${upload.uploading ? 'opacity-70' : ''}`}
              >
                {/* PDF Icon with sync indicator */}
                <div className="flex-shrink-0 w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center relative">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13H10v4H8.5v-1.5H7V14h1.5v-1zm3 0h1.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H11.5v-4zm1.5 3v-2h-.5v2h.5zm2.5-3H18v1h-1.5v.5h1v1h-1v1.5H15v-4z"/>
                  </svg>
                  {/* Cloud sync badge */}
                  {user && upload.cloudSynced && !upload.uploading && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {/* Uploading spinner */}
                  {upload.uploading && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-nubia-text font-medium truncate">{upload.name}</p>
                  <p className="text-xs text-nubia-text-muted">
                    {upload.size} MB • Uploaded {upload.date}
                    {upload.uploading && ' • Uploading...'}
                    {user && upload.cloudSynced && !upload.uploading && ' • ☁️ Synced'}
                    {!user && ' • 💾 Local only'}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPdf(upload)}
                    disabled={upload.uploading || !upload.url}
                    className="p-2 rounded-md hover:bg-nubia-surface-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Open PDF"
                  >
                    <svg className="w-5 h-5 text-nubia-text-secondary hover:text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeUpload(upload.id)}
                    disabled={upload.uploading}
                    className="p-2 rounded-md hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {user ? (
            <>
              <li>• <strong className="text-green-400">☁️ Cloud sync enabled</strong> - Files sync across all your devices</li>
              <li>• Upload from phone, access on desktop (and vice versa)</li>
              <li>• Files are stored securely in your Supabase account</li>
              <li>• Maximum file size: 50MB per PDF</li>
            </>
          ) : (
            <>
              <li>• <strong className="text-amber-400">💾 Local storage only</strong> - Sign in for cloud sync</li>
              <li>• Files are saved in your browser and will persist across sessions</li>
              <li>• Clearing browser data will remove all saved uploads</li>
              <li>• Maximum recommended file size: 10MB per PDF</li>
            </>
          )}
          <li>• Supported format: PDF only</li>
          <li>• Click on the eye icon to view a PDF in a new tab</li>
        </ul>
      </div>
    </div>
  );
}

export default Uploads;
