/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffects = () => {
  // Morphing background shapes
  const morphingShapes = [...Array(6)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute opacity-20 pointer-events-none"
      style={{
        left: `${20 + i * 15}%`,
        top: `${10 + i * 12}%`,
        width: `${100 + i * 50}px`,
        height: `${100 + i * 50}px`,
      }}
      animate={{
        borderRadius: [
          "30% 70% 70% 30% / 30% 30% 70% 70%",
          "70% 30% 30% 70% / 70% 70% 30% 30%",
          "50% 50% 50% 50% / 50% 50% 50% 50%",
          "30% 70% 70% 30% / 30% 30% 70% 70%"
        ],
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1],
        background: [
          "linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(147, 51, 234, 0.3))",
          "linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))",
          "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(239, 68, 68, 0.3))"
        ]
      }}
      transition={{
        duration: 10 + i * 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  ));

  // Particle system
  const particles = [...Array(50)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
        opacity: [0, 1, 0],
        scale: [0, Math.random() * 2, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 8,
        ease: "easeInOut"
      }}
    />
  ));

  return (
    <div className="fixed inset-0">
      {/* Morphing shapes */}
      {morphingShapes}
      
      {/* Particle system */}
      {particles}
      
      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
    </div>
  );
};

export default BackgroundEffects;