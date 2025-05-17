/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => (
  <div className="fixed inset-0 pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

export default FloatingElements;