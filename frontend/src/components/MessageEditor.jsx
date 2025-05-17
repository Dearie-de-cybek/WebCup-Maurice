/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MessageEditor = ({ pageData, setPageData, onNext, onPrev }) => {
  const handleChange = (field, value) => {
    setPageData({ ...pageData, [field]: value });
  };

  const isValid = pageData.title && pageData.mainMessage;

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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Message
            </label>
            <textarea
              value={pageData.mainMessage}
              onChange={(e) => handleChange('mainMessage', e.target.value)}
              placeholder="Write your goodbye message here..."
              rows={8}
              className="w-full p-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
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
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
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