/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Award, Star, TrendingUp } from 'lucide-react';

const ProfessionalConstellation = ({ hallOfFamePages }) => {
  const constellationRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Professional GSAP animations
      import('gsap').then(({ default: gsap }) => {
        // Title animation
        gsap.fromTo(titleRef.current,
          { 
            opacity: 0,
            y: 50,
            scale: 0.9
          },
          { 
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.5
          }
        );

        // Constellation reveal
        gsap.fromTo(constellationRef.current?.children || [],
          { 
            opacity: 0,
            scale: 0,
            rotationY: -90
          },
          { 
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
            delay: 1
          }
        );
      });
    }
  }, [hallOfFamePages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const starVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12
      }
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return Crown;
      case 2: return Trophy; 
      case 3: return Award;
      default: return Star;
    }
  };

  const getRankGradient = (rank) => {
    switch(rank) {
      case 1: return "from-amber-400 to-yellow-500";
      case 2: return "from-gray-300 to-gray-400";
      case 3: return "from-amber-600 to-orange-700";
      default: return "from-blue-400 to-purple-500";
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Calculate constellation positions
  const getStarPosition = (index, total) => {
    if (total === 1) return { x: 50, y: 50 };
    
    if (total === 2) {
      return index === 0 
        ? { x: 30, y: 50 }
        : { x: 70, y: 50 };
    }
    
    if (total === 3) {
      const positions = [
        { x: 50, y: 25 },  // Top
        { x: 25, y: 75 },  // Bottom left
        { x: 75, y: 75 }   // Bottom right
      ];
      return positions[index];
    }
    
    // For larger sets, arrange in circle
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 35;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius
    };
  };

  if (hallOfFamePages.length === 0) return null;

  return (
    <div className="fixed top-8 left-8 z-20 pointer-events-none">
      <motion.div
        className="w-96"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Professional title */}
        <motion.div 
          ref={titleRef}
          className="mb-8"
          variants={starVariants}
        >
          <h2 className="text-2xl font-light text-white mb-2">
            Hall of <span className="font-semibold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Fame</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Legendary voices that transcended the ordinary
          </p>
        </motion.div>

        {/* Constellation visualization */}
        <motion.div 
          ref={constellationRef}
          className="relative h-80 mb-8"
          variants={starVariants}
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {hallOfFamePages.map((_, index) => {
              if (index === hallOfFamePages.length - 1) return null;
              
              const fromPos = getStarPosition(index, hallOfFamePages.length);
              const toPos = getStarPosition(index + 1, hallOfFamePages.length);
              
              return (
                <motion.line
                  key={`line-${index}`}
                  x1={`${fromPos.x}%`}
                  y1={`${fromPos.y}%`}
                  x2={`${toPos.x}%`}
                  y2={`${toPos.y}%`}
                  stroke="url(#constellation-gradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.5, delay: index * 0.3 + 1.5 }}
                />
              );
            })}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="constellation-gradient" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
                <stop offset="50%" stopColor="rgba(147, 197, 253, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.6)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Stars */}
          {hallOfFamePages.map((page, index) => {
            const position = getStarPosition(index, hallOfFamePages.length);
            const IconComponent = getRankIcon(page.rank);
            const gradient = getRankGradient(page.rank);
            
            return (
              <motion.div
                key={page.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                style={{ 
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                variants={starVariants}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-30 blur-lg`}
                  style={{ width: '60px', height: '60px', left: '-30px', top: '-30px' }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />

                {/* Star body */}
                <motion.div
                  className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${gradient} 
                             flex items-center justify-center border border-white/20
                             shadow-lg backdrop-blur-sm`}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 255, 255, 0.2)',
                      '0 0 40px rgba(255, 255, 255, 0.4)',
                      '0 0 20px rgba(255, 255, 255, 0.2)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
                </motion.div>

                {/* Tooltip */}
                <motion.div
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 
                           bg-black/80 backdrop-blur-sm rounded-lg p-3 min-w-max
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           border border-white/10"
                  initial={false}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-center">
                    <h4 className="text-white text-sm font-medium mb-1">
                      {page.title}
                    </h4>
                    <p className="text-gray-300 text-xs mb-2">
                      by {page.author}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="text-amber-400">
                        ⭐ {formatNumber(page.votes)}
                      </span>
                      <span className="text-gray-400">
                        #{page.rank}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-black/80" />
                  </div>
                </motion.div>

                {/* Orbital rings for top rank */}
                {page.rank === 1 && (
                  <motion.div
                    className="absolute border border-amber-400/30 rounded-full"
                    style={{ width: '80px', height: '80px', left: '-40px', top: '-40px' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* Central nexus if 3+ stars */}
          {hallOfFamePages.length >= 3 && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              variants={starVariants}
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full
                            flex items-center justify-center border border-white/20">
                <Star className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          )}

          {/* Ambient particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </motion.div>

        {/* Statistics panel */}
        <motion.div 
          className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          variants={starVariants}
        >
          <h3 className="text-lg font-medium text-white mb-4">
            Collective Impact
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <motion.div 
                className="text-2xl font-light text-white mb-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, type: "spring" }}
              >
                {hallOfFamePages.length}
              </motion.div>
              <div className="text-xs text-gray-400">Legends</div>
            </div>
            
            <div className="text-center">
              <motion.div 
                className="text-2xl font-light text-white mb-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, type: "spring" }}
              >
                {formatNumber(hallOfFamePages.reduce((sum, page) => sum + page.votes, 0))}
              </motion.div>
              <div className="text-xs text-gray-400">Total Votes</div>
            </div>
            
            <div className="text-center">
              <motion.div 
                className="text-2xl font-light text-white mb-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.4, type: "spring" }}
              >
                {formatNumber(hallOfFamePages.reduce((sum, page) => sum + page.views, 0))}
              </motion.div>
              <div className="text-xs text-gray-400">Total Views</div>
            </div>
          </div>

          <motion.div
            className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Rising to immortality</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfessionalConstellation;