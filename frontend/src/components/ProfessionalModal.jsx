/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2, Heart, Eye, Calendar, Trophy, Star } from 'lucide-react';

const ProfessionalModal = ({ selectedPlanet, onClose }) => {
  const modalRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (selectedPlanet && typeof window !== 'undefined') {
      // GSAP text animation for title
      import('gsap').then(({ default: gsap }) => {
        gsap.fromTo(titleRef.current,
          { 
            opacity: 0,
            y: 30,
            rotationX: -15
          },
          { 
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.3
          }
        );
      });
    }
  }, [selectedPlanet]);

  if (!selectedPlanet) return null;

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 60
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: -40,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getToneColor = (tone) => {
    const colors = {
      dramatic: 'from-amber-500 to-orange-600',
      ironic: 'from-purple-500 to-indigo-600',
      touching: 'from-blue-500 to-cyan-600',
      absurd: 'from-emerald-500 to-teal-600',
      classy: 'from-slate-500 to-gray-600',
      cringe: 'from-pink-500 to-rose-600',
      'passive-aggressive': 'from-red-500 to-orange-600',
      honest: 'from-violet-500 to-purple-600'
    };
    return colors[tone] || 'from-gray-500 to-slate-600';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Professional backdrop with blur */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(20px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Glass morphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20" />
          
          {/* Subtle animated background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${getToneColor(selectedPlanet.tone)} opacity-5`}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          {/* Content */}
          <div className="relative overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="p-8 pb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  {/* Rank indicator */}
                  <motion.div
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold
                      ${selectedPlanet.rank <= 3 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' 
                        : 'bg-white/10 text-white border border-white/20'
                      }
                    `}
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(255, 255, 255, 0)',
                        '0 0 0 10px rgba(255, 255, 255, 0.1)',
                        '0 0 0 0 rgba(255, 255, 255, 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    #{selectedPlanet.rank}
                  </motion.div>

                  {/* Hall of Fame badge */}
                  {selectedPlanet.isHallOfFame && (
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-300 font-medium">Legend</span>
                    </motion.div>
                  )}
                </div>

                {/* Close button */}
                <motion.button
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Title with GSAP animation */}
              <motion.h1
                ref={titleRef}
                className="text-5xl font-light text-white mb-4 leading-tight"
                style={{ perspective: '1000px' }}
              >
                {selectedPlanet.title}
              </motion.h1>

              {/* Author and metadata */}
              <motion.div
                className="flex items-center gap-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">by</span>
                  <span className="text-blue-300 font-medium">{selectedPlanet.author}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedPlanet.createdAt)}</span>
                </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getToneColor(selectedPlanet.tone)} text-white`}>
                  {selectedPlanet.tone?.replace('-', ' ')}
                </div>
              </motion.div>

              {/* Preview content */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-medium text-gray-300 mb-3">Preview</h3>
                <blockquote className="text-white text-xl leading-relaxed italic relative">
                  <span className="text-4xl text-white/20 absolute -top-2 -left-2">"</span>
                  <span className="relative z-10">{selectedPlanet.preview}</span>
                  <span className="text-4xl text-white/20">..."</span>
                </blockquote>
              </motion.div>
            </div>

            {/* Metrics section */}
            <div className="px-8 pb-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {/* Votes */}
                <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-red-400" />
                    <span className="text-red-300 font-medium">Votes</span>
                  </div>
                  <motion.div
                    className="text-4xl font-light text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    {formatNumber(selectedPlanet.votes)}
                  </motion.div>
                  <div className="text-sm text-gray-400 mt-2">
                    Community voices
                  </div>
                </div>

                {/* Views */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-300 font-medium">Views</span>
                  </div>
                  <motion.div
                    className="text-4xl font-light text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, type: "spring" }}
                  >
                    {formatNumber(selectedPlanet.views)}
                  </motion.div>
                  <div className="text-sm text-gray-400 mt-2">
                    Total reads
                  </div>
                </div>

                {/* Ranking */}
                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-purple-400" />
                    <span className="text-purple-300 font-medium">Ranking</span>
                  </div>
                  <motion.div
                    className="text-4xl font-light text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                  >
                    #{selectedPlanet.rank}
                  </motion.div>
                  <div className="text-sm text-gray-400 mt-2">
                    Global position
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="p-8 pt-4">
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <motion.button
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-lg flex items-center justify-center gap-3 text-white hover:from-blue-500 hover:to-purple-500 transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Read Full Story
                </motion.button>

                <motion.button
                  className="px-6 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-5 h-5 text-white" />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Subtle floating elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
                y: [0, -30, -60]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfessionalModal;