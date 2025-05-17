/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2, Heart, Eye, Star, Calendar } from 'lucide-react';

const CosmicUI = ({ selectedPlanet, onClose }) => {
  if (!selectedPlanet) return null;

  const getToneEmoji = (tone) => {
    const emojis = {
      dramatic: '🎭',
      ironic: '😏',
      cringe: '✨',
      classy: '🎩',
      touching: '💝',
      absurd: '🦄',
      'passive-aggressive': '😤',
      honest: '📝'
    };
    return emojis[tone] || '📄';
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const panelVariants = {
    hidden: { 
      scale: 0.5, 
      opacity: 0, 
      rotateX: 45,
      y: 100 
    },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotateX: 0,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      scale: 0.5, 
      opacity: 0, 
      rotateX: -45,
      y: -100,
      transition: { duration: 0.3 }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ perspective: '1000px' }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Cosmic panel */}
        <motion.div
          className="relative max-w-2xl w-full mx-4"
          variants={panelVariants}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Glowing border effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-75"
            style={{
              background: `linear-gradient(135deg, ${selectedPlanet.color}40, transparent, ${selectedPlanet.color}40)`,
              filter: 'blur(10px)'
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity }
            }}
          />

          {/* Main panel */}
          <motion.div
            className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
            style={{
              boxShadow: `0 25px 50px -12px ${selectedPlanet.color}40`
            }}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 z-10 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full border border-red-500/50 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-red-400" />
            </motion.button>

            {/* Header section */}
            <div className="relative p-8 pb-6">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${selectedPlanet.color}60, transparent 70%)`
                }}
                animate={{
                  background: [
                    `radial-gradient(circle at 30% 0%, ${selectedPlanet.color}60, transparent 70%)`,
                    `radial-gradient(circle at 70% 0%, ${selectedPlanet.color}60, transparent 70%)`,
                    `radial-gradient(circle at 30% 0%, ${selectedPlanet.color}60, transparent 70%)`
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <div className="relative flex items-start gap-6">
                {/* Planet emoji */}
                <motion.div
                  className="text-8xl"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                >
                  {getToneEmoji(selectedPlanet.tone)}
                </motion.div>

                {/* Planet info */}
                <div className="flex-1">
                  <motion.h2
                    className="text-4xl font-black text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedPlanet.title}
                  </motion.h2>

                  <motion.p
                    className="text-xl text-gray-300 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    by <span className="text-blue-400 font-semibold">{selectedPlanet.author}</span>
                  </motion.p>

                  {/* Stats */}
                  <motion.div
                    className="flex items-center gap-6 text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="capitalize bg-gray-800 px-3 py-1 rounded-full text-sm">
                      {selectedPlanet.tone?.replace('-', ' ')}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedPlanet.createdAt)}
                    </span>
                  </motion.div>
                </div>

                {/* Rank badge */}
                {selectedPlanet.isHallOfFame && (
                  <motion.div
                    className="relative"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <motion.div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black ${
                        selectedPlanet.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' :
                        selectedPlanet.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-black' :
                        'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                      }`}
                      animate={{
                        boxShadow: [
                          `0 0 20px ${selectedPlanet.color}80`,
                          `0 0 40px ${selectedPlanet.color}ff`,
                          `0 0 20px ${selectedPlanet.color}80`
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      #{selectedPlanet.rank}
                    </motion.div>
                    <motion.div
                      className="absolute -top-2 -right-2 text-yellow-400"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ⭐
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Preview section */}
            <motion.div
              className="px-8 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-300 mb-3">Preview</h3>
                <p className="text-gray-200 text-lg leading-relaxed italic">
                  "{selectedPlanet.preview}..."
                </p>
              </div>
            </motion.div>

            {/* Metrics section */}
            <motion.div
              className="px-8 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-xl p-4 border border-red-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-6 h-6 text-red-400" />
                    <span className="text-red-300 font-semibold">Votes</span>
                  </div>
                  <motion.div
                    className="text-3xl font-black text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    {selectedPlanet.votes.toLocaleString()}
                  </motion.div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-300 font-semibold">Views</span>
                  </div>
                  <motion.div
                    className="text-3xl font-black text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    {selectedPlanet.views.toLocaleString()}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="p-8 pt-4 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-5 h-5" />
                View Full Page
              </motion.button>

              <motion.button
                className="px-6 py-4 border-2 border-gray-600 rounded-xl hover:bg-gray-600/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Floating particles inside panel */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full opacity-60"
                style={{
                  backgroundColor: selectedPlanet.color,
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.6, 0, 0.6],
                  scale: [1, 2, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CosmicUI;