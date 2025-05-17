/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20"
  >
    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
      {React.cloneElement(icon, { className: "w-8 h-8" })}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

export default FeatureCard;