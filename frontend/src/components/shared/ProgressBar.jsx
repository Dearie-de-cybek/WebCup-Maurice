/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <motion.div
      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  </div>
);

export default ProgressBar;