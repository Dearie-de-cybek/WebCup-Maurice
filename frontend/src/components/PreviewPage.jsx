import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageViewer from './PageViewer';
import { publishPage } from './publishUtils';

const PreviewPage = ({ 
  pageData, 
  setPageData, 
  onNext, 
  onPrev, 
  isFirstStep, 
  isLastStep 
}) => {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Ensure required fields are present
      if (!pageData.title) {
        alert('Please add a title to your page before publishing.');
        setIsPublishing(false);
        return;
      }

      if (!pageData.mainMessage) {
        alert('Please add a main message to your page before publishing.');
        setIsPublishing(false);
        return;
      }

      // Publish the page
      const result = await publishPage(pageData);
      
      if (result.success) {
        setPublishResult(result);
        console.log('Page published successfully:', result);
      } else {
        alert('Failed to publish page: ' + result.error);
      }
    } catch (error) {
      console.error('Publishing error:', error);
      alert('An error occurred while publishing. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleViewPublishedPage = () => {
    if (publishResult) {
      // Navigate to the published page
      navigate(`/page/${publishResult.slug}`);
    }
  };

  const handleShareLink = async () => {
    if (!publishResult) return;

    const shareUrl = publishResult.fullUrl;

    if (navigator.share) {
      try {
        await navigator.share({
          title: pageData.title,
          text: `Check out my farewell page: ${pageData.title}`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.log('Error copying to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  const handleCreateAnother = () => {
    navigate('/pagebuilder');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // If page is published, show success screen
  if (publishResult) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Your Page is Live!
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Your farewell page has been published successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Your page URL:</p>
            <div className="flex items-center justify-center gap-3">
              <code className="bg-white px-4 py-2 rounded border text-sm flex-1 text-left">
                {publishResult.fullUrl}
              </code>
              <button
                onClick={() => copyToClipboard(publishResult.fullUrl)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleViewPublishedPage}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5" />
              View Your Page
            </motion.button>

            <motion.button
              onClick={handleShareLink}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
              Share Link
            </motion.button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Want to create another farewell page?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCreateAnother}
                className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Create Another
              </button>
              <button
                onClick={handleGoHome}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Preview Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 text-center">
            Preview Your Page
          </h3>
          <p className="text-gray-600 text-center mt-2">
            This is how your farewell page will appear to visitors
          </p>
        </div>
        
        <div className="h-96 overflow-auto">
          <PageViewer previewData={pageData} />
        </div>
      </div>

      {/* Publishing Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Publish?
          </h3>
          <p className="text-gray-600">
            Once published, your page will be accessible via a unique link that you can share with others.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-blue-900 mb-2">What happens when you publish:</h4>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Your page gets a unique, shareable URL</li>
            <li>• It becomes accessible to anyone with the link</li>
            <li>• View counts and votes will be tracked</li>
            <li>• You can share it on social media, email, or anywhere</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <motion.button 
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!isPublishing ? { scale: 1.05 } : {}}
            whileTap={!isPublishing ? { scale: 0.95 } : {}}
          >
            {isPublishing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Publish Page
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;