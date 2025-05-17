/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PreviewPage = ({ pageData, onPrev }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPageUrl(`theend.page/${Math.random().toString(36).substring(7)}`);
    setIsPublished(true);
    setIsPublishing(false);
  };

  if (isPublished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-full" />
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Your Exit Page is Live! 🎉
          </h3>
          
          <p className="text-gray-600 mb-8">
            Share this link with everyone who needs to see your farewell
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="font-mono text-lg text-purple-600">{pageUrl}</p>
          </div>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold">
              Copy Link
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold">
              Share on Social
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Final Preview</h3>
          
          <div className="bg-gray-900 rounded-lg p-6 text-white min-h-64">
            <h1 className="text-2xl font-bold mb-4">{pageData.title}</h1>
            <p className="text-lg mb-4">{pageData.mainMessage}</p>
            {pageData.subMessage && (
              <p className="text-sm opacity-75">{pageData.subMessage}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Ready to Go Live?</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Tone</span>
              <span className="font-semibold capitalize">{pageData.tone}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Title</span>
              <span className="font-semibold">{pageData.title}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Message Length</span>
              <span className="font-semibold">{pageData.mainMessage.length} chars</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            Once published, your page will be available to anyone with the link. 
            You can always edit or delete it later.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          disabled={isPublishing}
        >
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePublish}
          disabled={isPublishing}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-3 rounded-lg font-bold min-w-48"
        >
          {isPublishing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Publishing...
            </span>
          ) : (
            'Publish Page'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default PreviewPage;