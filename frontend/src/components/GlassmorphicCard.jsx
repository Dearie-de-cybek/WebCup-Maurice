import React from 'react';
import { motion } from 'framer-motion';

const GlassmorphicCard = ({ 
  title, 
  mainMessage, 
  subMessage, 
  tone = 'default',
  className = '',
  children 
}) => {
  // Get tone-specific styling
  const getToneStyles = (tone) => {
    const styles = {
      dramatic: {
        background: 'rgba(20, 20, 20, 0.6)',
        border: 'rgba(139, 0, 0, 0.3)',
        shadow: '0 25px 50px -12px rgba(139, 0, 0, 0.25)',
        glow: 'rgba(139, 0, 0, 0.1)'
      },
      ironic: {
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'rgba(255, 193, 7, 0.3)',
        shadow: '0 25px 50px -12px rgba(255, 193, 7, 0.25)',
        glow: 'rgba(255, 193, 7, 0.1)'
      },
      cringe: {
        background: 'rgba(255, 105, 180, 0.2)',
        border: 'rgba(255, 105, 180, 0.4)',
        shadow: '0 25px 50px -12px rgba(255, 105, 180, 0.3)',
        glow: 'rgba(255, 105, 180, 0.1)'
      },
      classy: {
        background: 'rgba(31, 41, 55, 0.8)',
        border: 'rgba(156, 163, 175, 0.3)',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        glow: 'rgba(156, 163, 175, 0.1)'
      },
      touching: {
        background: 'rgba(251, 191, 36, 0.15)',
        border: 'rgba(251, 191, 36, 0.3)',
        shadow: '0 25px 50px -12px rgba(251, 191, 36, 0.25)',
        glow: 'rgba(251, 191, 36, 0.1)'
      },
      absurd: {
        background: 'rgba(147, 51, 234, 0.2)',
        border: 'rgba(34, 197, 94, 0.3)',
        shadow: '0 25px 50px -12px rgba(147, 51, 234, 0.25)',
        glow: 'rgba(147, 51, 234, 0.1)'
      },
      'passive-aggressive': {
        background: 'rgba(37, 99, 235, 0.2)',
        border: 'rgba(37, 99, 235, 0.3)',
        shadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)',
        glow: 'rgba(37, 99, 235, 0.1)'
      },
      honest: {
        background: 'rgba(107, 114, 128, 0.2)',
        border: 'rgba(107, 114, 128, 0.3)',
        shadow: '0 25px 50px -12px rgba(107, 114, 128, 0.25)',
        glow: 'rgba(107, 114, 128, 0.1)'
      },
      default: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'rgba(255, 255, 255, 0.2)',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        glow: 'rgba(255, 255, 255, 0.05)'
      }
    };
    
    return styles[tone] || styles.default;
  };

  const toneStyle = getToneStyles(tone);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl backdrop-blur-xl ${className}`}
      style={{
        background: toneStyle.background,
        borderColor: toneStyle.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: toneStyle.shadow
      }}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${toneStyle.glow}, transparent 70%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${toneStyle.glow}, transparent 70%)`,
            `radial-gradient(circle at 70% 70%, ${toneStyle.glow}, transparent 70%)`,
            `radial-gradient(circle at 30% 30%, ${toneStyle.glow}, transparent 70%)`
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        {title && (
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {title}
          </motion.h1>
        )}

        {mainMessage && (
          <motion.div
            className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="whitespace-pre-wrap">{mainMessage}</p>
          </motion.div>
        )}

        {subMessage && (
          <motion.p
            className="text-base md:text-lg opacity-80 italic text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {subMessage}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-60"
          style={{
            backgroundColor: toneStyle.border.split(',')[0].split('(')[1],
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
        />
      ))}

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20">
        <div 
          className="absolute top-0 left-0 w-full h-px opacity-50"
          style={{ background: `linear-gradient(90deg, ${toneStyle.border}, transparent)` }}
        />
        <div 
          className="absolute top-0 left-0 h-full w-px opacity-50"
          style={{ background: `linear-gradient(180deg, ${toneStyle.border}, transparent)` }}
        />
      </div>
      
      <div className="absolute bottom-0 right-0 w-20 h-20">
        <div 
          className="absolute bottom-0 right-0 w-full h-px opacity-50"
          style={{ background: `linear-gradient(270deg, ${toneStyle.border}, transparent)` }}
        />
        <div 
          className="absolute bottom-0 right-0 h-full w-px opacity-50"
          style={{ background: `linear-gradient(0deg, ${toneStyle.border}, transparent)` }}
        />
      </div>
    </motion.div>
  );
};

export default GlassmorphicCard;