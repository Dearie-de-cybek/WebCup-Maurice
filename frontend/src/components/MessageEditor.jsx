/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';

const MessageEditor = ({ pageData, setPageData, onNext, onPrev }) => {
  const handleChange = (field, value) => {
    setPageData({ ...pageData, [field]: value });
  };

  // Count words in the main message
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(pageData.mainMessage);
  const maxWords = 1000;
  const isOverLimit = wordCount > maxWords;
  const isNearLimit = wordCount > maxWords * 0.9; // 90% of limit

  const isValid = pageData.title && pageData.mainMessage && !isOverLimit;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={pageData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="My Epic Exit"
              className="w-full p-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Main Message
              </label>
              <div className={`text-sm flex items-center gap-2 ${
                isOverLimit 
                  ? 'text-red-600' 
                  : isNearLimit 
                    ? 'text-orange-600' 
                    : 'text-gray-500'
              }`}>
                {isOverLimit && <AlertCircle className="w-4 h-4" />}
                <span>{wordCount}/{maxWords} words</span>
              </div>
            </div>
            <textarea
              value={pageData.mainMessage}
              onChange={(e) => handleChange('mainMessage', e.target.value)}
              placeholder="Write your goodbye message here..."
              rows={8}
              className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 text-black focus:border-transparent resize-none ${
                isOverLimit 
                  ? 'border-red-300 bg-red-50' 
                  : isNearLimit 
                    ? 'border-orange-300 bg-orange-50' 
                    : 'border-gray-300'
              }`}
            />
            {isOverLimit && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Message too long! Please reduce by {wordCount - maxWords} words.
                  </span>
                </div>
              </div>
            )}
            {isNearLimit && !isOverLimit && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-orange-700 text-sm">
                  You're approaching the word limit. {maxWords - wordCount} words remaining.
                </span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={pageData.subMessage}
              onChange={(e) => handleChange('subMessage', e.target.value)}
              placeholder="A final thought..."
              className="w-full p-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Writing Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Writing Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be authentic to your chosen tone</li>
              <li>• Share specific memories or experiences</li>
              <li>• Consider your audience - who will read this?</li>
              <li>• End with how you want to be remembered</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          whileTap={{ scale: isValid ? 0.95 : 1 }}
          onClick={isValid ? onNext : undefined}
          disabled={!isValid}
          className={`px-8 py-3 rounded-lg font-bold inline-flex items-center gap-2 ${
            isValid
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default MessageEditor;