/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Trophy, Award } from 'lucide-react';

const HallOfFameConstellations = ({ hallOfFamePages }) => {
  const constellationVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 2,
        staggerChildren: 0.5
      }
    }
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1,
        ease: "backOut"
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

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "#ffd700"; // Gold
      case 2: return "#c0c0c0"; // Silver
      case 3: return "#cd7f32"; // Bronze
      default: return "#ffffff";
    }
  };

  // Generate constellation connection lines
  const generateConstellationLines = () => {
    if (hallOfFamePages.length < 2) return [];
    
    const lines = [];
    for (let i = 0; i < hallOfFamePages.length - 1; i++) {
      lines.push({
        from: i,
        to: i + 1,
        id: `line-${i}-${i + 1}`
      });
    }
    return lines;
  };

  const lines = generateConstellationLines();

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <motion.div
        className="absolute top-8 left-8"
        initial="hidden"
        animate="visible"
        variants={constellationVariants}
      >
        {/* Constellation Title */}
        <motion.div 
          className="mb-8"
          variants={starVariants}
        >
          <motion.h2
            className="text-3xl font-black text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)"
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            ⭐ LEGEND CONSTELLATION ⭐
          </motion.h2>
        </motion.div>

        {/* Constellation Map */}
        <motion.div 
          className="relative w-96 h-96"
          variants={starVariants}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {lines.map((line) => {
              const fromPage = hallOfFamePages[line.from];
              const toPage = hallOfFamePages[line.to];
              const fromPos = getStarPosition(line.from, hallOfFamePages.length);
              const toPos = getStarPosition(line.to, hallOfFamePages.length);
              
              return (
                <motion.line
                  key={line.id}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="url(#constellation-gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 2, delay: line.from * 0.5 }}
                />
              );
            })}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Stars (Hall of Fame Pages) */}
          {hallOfFamePages.map((page, index) => {
            const position = getStarPosition(index, hallOfFamePages.length);
            const IconComponent = getRankIcon(page.rank);
            const color = getRankColor(page.rank);
            
            return (
              <motion.div
                key={page.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: position.x,
                  top: position.y
                }}
                variants={starVariants}
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Pulsing Background */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{ 
                    backgroundColor: color,
                    width: '60px',
                    height: '60px',
                    left: '-30px',
                    top: '-30px'
                  }}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0.2, 0.6]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />

                {/* Orbital Rings */}
                {[...Array(3)].map((_, ringIndex) => (
                  <motion.div
                    key={ringIndex}
                    className="absolute border rounded-full opacity-30"
                    style={{
                      borderColor: color,
                      width: `${80 + ringIndex * 20}px`,
                      height: `${80 + ringIndex * 20}px`,
                      left: `${-40 - ringIndex * 10}px`,
                      top: `${-40 - ringIndex * 10}px`
                    }}
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 10 + ringIndex * 5, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, delay: ringIndex * 0.7 }
                    }}
                  />
                ))}

                {/* Main Star Icon */}
                <motion.div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  animate={{ 
                    boxShadow: [
                      `0 0 20px ${color}80`,
                      `0 0 40px ${color}ff`,
                      `0 0 20px ${color}80`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <IconComponent 
                    className="w-6 h-6 text-black" 
                  />
                </motion.div>

                {/* Page Info Tooltip */}
                <motion.div
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-3 min-w-max opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ opacity: 1 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="text-center">
                    <h4 className="text-white text-sm font-bold">{page.title}</h4>
                    <p className="text-gray-300 text-xs">by {page.author}</p>
                    <p className="text-yellow-400 text-xs font-bold">
                      ⭐ {page.votes.toLocaleString()} votes
                    </p>
                  </div>
                  
                  {/* Tooltip arrow */}
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* Central Legend Symbol */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            variants={starVariants}
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity }
            }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(255, 215, 0, 0.5)",
                  "0 0 60px rgba(255, 215, 0, 0.8)",
                  "0 0 30px rgba(255, 215, 0, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>

          {/* Floating particles around constellation */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="mt-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-yellow-500/30"
          variants={starVariants}
        >
          <div className="text-center">
            <h3 className="text-yellow-300 font-bold text-lg mb-2">Legendary Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white font-bold text-xl">
                  {hallOfFamePages.length}
                </div>
                <div className="text-gray-300">Legends</div>
              </div>
              <div>
                <div className="text-white font-bold text-xl">
                  {hallOfFamePages.reduce((sum, page) => sum + page.votes, 0).toLocaleString()}
                </div>
                <div className="text-gray-300">Total Votes</div>
              </div>
              <div>
                <div className="text-white font-bold text-xl">
                  {hallOfFamePages.reduce((sum, page) => sum + page.views, 0).toLocaleString()}
                </div>
                <div className="text-gray-300">Total Views</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Helper function to calculate star positions in constellation
const getStarPosition = (index, total) => {
  if (total === 1) {
    return { x: 192, y: 192 }; // Center for single item
  }
  
  // Arrange in a triangle formation for 3 items
  if (total === 3) {
    const positions = [
      { x: 192, y: 100 },  // Top
      { x: 100, y: 250 },  // Bottom left
      { x: 284, y: 250 }   // Bottom right
    ];
    return positions[index];
  }
  
  // For other counts, arrange in circle
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radius = 120;
  return {
    x: 192 + Math.cos(angle) * radius,
    y: 192 + Math.sin(angle) * radius
  };
};

export default HallOfFameConstellations;