/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Download, Twitter, Facebook, LinkIcon } from 'lucide-react';
import LivePreview from './shared/LivePreview';
// import { storePage } from '../services/pages';

const PreviewPage = ({ pageData, onPrev }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [pageSlug, setPageSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSlug = () => {
    const words = ['epic', 'final', 'goodbye', 'farewell', 'end', 'exit', 'last', 'ultimate'];
    const animals = ['dragon', 'phoenix', 'unicorn', 'tiger', 'eagle', 'wolf', 'lion', 'shark'];
    const numbers = Math.floor(Math.random() * 1000);
    
    const word = words[Math.floor(Math.random() * words.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    
    return `${word}-${animal}-${numbers}`;
  };

  const savePageData = (slug, data) => {
    try {
      // In production, files would be uploaded to server Mike and Uche
      const lightweightData = {
        ...data,
        // Replace actual file data with metadata only
        backgroundImage: data.backgroundImage ? {
          name: data.backgroundImage.name,
          size: data.backgroundImage.size,
          hasImage: true
        } : null,
        music: data.music ? {
          name: data.music.name,
          size: data.music.size || null,
          preset: data.music.preset || null,
          hasAudio: !!data.music.url && !data.music.preset
        } : null,
        createdAt: new Date().toISOString(),
        views: 0
      };

      const pages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
      pages[slug] = lightweightData;
      localStorage.setItem('theend_pages', JSON.stringify(pages));
      
      // Store the actual page data with files in sessionStorage for current session
      const fullData = {
        ...data,
        createdAt: new Date().toISOString(),
        views: 0
      };
      sessionStorage.setItem(`theend_page_${slug}`, JSON.stringify(fullData));
      
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        // Storage quota exceeded, let's clear old pages and try again
        try {
          const pages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
          const pageKeys = Object.keys(pages);
          
          // If we have more than 5 pages, remove the oldest ones
          if (pageKeys.length >= 5) {
            const sortedPages = pageKeys
              .map(key => ({ key, createdAt: pages[key].createdAt }))
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
            // Remove oldest pages
            for (let i = 0; i < Math.min(3, sortedPages.length); i++) {
              delete pages[sortedPages[i].key];
              sessionStorage.removeItem(`theend_page_${sortedPages[i].key}`);
            }
            
            localStorage.setItem('theend_pages', JSON.stringify(pages));
          }
          
          // Try saving again with cleaned storage
          savePageData(slug, data);
        } catch (secondError) {
          console.error('Failed to save page data even after cleanup:', secondError);
          throw new Error('Storage quota exceeded. Please try with smaller files or clear browser storage.');
        }
      } else {
        throw error;
      }
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Get the authentication token from local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add all text fields from pageData
      formData.append('title', pageData.title);
      formData.append('tone', pageData.tone);
      formData.append('mainMessage', pageData.mainMessage);
      formData.append('subMessage', pageData.subMessage);
      formData.append('animationStyle', pageData.animationStyle);
      formData.append('backgroundColor', pageData.backgroundColor);
      formData.append('fontFamily', pageData.fontFamily);
      formData.append('textColor', pageData.textColor);
      formData.append('textSize', pageData.textSize);
      
      // Add music data if exists (as a JSON string)
      if (pageData.music) {
        formData.append('music', JSON.stringify(pageData.music));
      }
      
      // Add images if they exist
      if (pageData.images && pageData.images.length > 0) {
        pageData.images.forEach((image, index) => {
          // If image is a File object, append it directly
          if (image instanceof File) {
            formData.append('images', image);
          } 
          // If image is a URL/path or object with URL, you might need to fetch it first
          // This depends on how your page editor handles images
        });
      }
      
      // Add background image if exists
      if (pageData.backgroundImage) {
        if (pageData.backgroundImage instanceof File) {
          formData.append('backgroundImage', pageData.backgroundImage);
        }
      }
      
      // Make the API call to store the page data
      const response = await fetch('http://localhost:8080/api/pages/store', {
        method: 'POST',
        headers: {
          // Don't set Content-Type header, it will be automatically set with boundary by browser
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: formData
      });
      
      if (!response.ok) {
        // Try to get error details from the response
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || '';
        } catch (e) {
          // If we can't parse the error response, just use the status text
          errorDetails = response.statusText;
        }
        
        throw new Error(`Server responded with ${response.status}: ${errorDetails}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Use the slug returned from the API
      const slug = data.page.slug;
      
      // If your local state needs to be updated with the saved data
      await savePageData(slug, pageData);
      
      setPageSlug(slug);
      setIsPublished(true);
    } catch (error) {
      console.error('Error publishing page:', error);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to publish page. Please try again.';
      alert(`Publication failed: ${errorMessage}\n\nTip: Try using smaller image files (< 1MB) or remove background music.`);
    } finally {
      setIsPublishing(false);
    }
  };

  const getShareUrl = () => {
    return `${window.location.origin}/view/${pageSlug}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShareUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToSocial = (platform) => {
    const url = getShareUrl();
    const text = `Check out my goodbye page: ${pageData.title}`;
    
    const socialUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(socialUrls[platform], '_blank', 'noopener,noreferrer');
  };

  const downloadPageData = () => {
    const dataToDownload = {
      ...pageData,
      generatedUrl: getShareUrl(),
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageSlug}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isPublished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-2xl">✓</span>
            </motion.div>
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Your Exit Page is Live! 🎉
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Share this link with everyone who needs to see your farewell
          </motion.p>
          
          {/* URL Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 p-4 rounded-lg mb-8 border-2 border-dashed border-gray-200"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg text-purple-600 break-all">
                {getShareUrl()}
              </p>
              <button
                onClick={copyToClipboard}
                className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {copied ? '✓ Copied!' : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <button
              onClick={() => window.open(getShareUrl(), '_blank')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
            >
              <LinkIcon className="w-5 h-5" />
              View Your Page
            </button>
            
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 border-2 border-purple-500 text-purple-500 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all"
            >
              <Copy className="w-5 h-5" />
              Copy Link
            </button>
          </motion.div>

          {/* Social Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-sm text-gray-600 mb-4">Share on social media:</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => shareToSocial('twitter')}
                className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Download Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={downloadPageData}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download page data
            </button>
          </motion.div>

          {/* Page Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500"
          >
            <p>Page ID: <span className="font-mono">{pageSlug}</span></p>
            <p>Created: {new Date().toLocaleDateString()}</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Pre-publish preview
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Page Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Page Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Tone</span>
              <span className="font-semibold capitalize">
                {pageData.tone ? pageData.tone.replace('-', ' ') : 'None'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Title</span>
              <span className="font-semibold truncate max-w-32" title={pageData.title}>
                {pageData.title || 'Untitled'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Message Length</span>
              <span className="font-semibold">
                {pageData.mainMessage ? pageData.mainMessage.length : 0} chars
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Background Image</span>
              <span className="font-semibold">
                {pageData.backgroundImage ? '✓ Uploaded' : '✗ None'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Background Music</span>
              <span className="font-semibold">
                {pageData.music ? '✓ Added' : '✗ None'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Once published, your page will be publicly accessible 
              via a unique link. You can always edit or delete it later.
            </p>
          </div>
        </div>
        
        {/* Live Preview */}
        <div className="lg:col-span-2">
          <LivePreview pageData={pageData} />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          disabled={isPublishing}
        >
          Back to Customize
        </motion.button>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`/view/preview?data=${encodeURIComponent(JSON.stringify(pageData))}`, '_blank')}
            className="px-6 py-3 border border-purple-500 text-purple-500 rounded-lg font-semibold hover:bg-purple-50"
            disabled={isPublishing}
          >
            Full Preview
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-3 rounded-lg font-bold min-w-48 flex items-center justify-center"
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Publishing...
              </span>
            ) : (
              'Publish Page'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;