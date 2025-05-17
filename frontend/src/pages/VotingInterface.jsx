/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Star, Rocket, Zap, Sparkles } from 'lucide-react';

const VotingInterface = ({ pages, userVotes, onVote, selectedPlanet }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const getToneColor = (tone) => {
    const colors = {
      dramatic: '#ef4444',
      ironic: '#8b5cf6',
      touching: '#06b6d4',
      absurd: '#f59e0b',
      classy: '#10b981',
      cringe: '#ec4899',
      'passive-aggressive': '#f97316',
      honest: '#6366f1'
    };
    return colors[tone] || '#64748b';
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Header */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.h1
          className="text-6xl font-black mb-4"
          style={{
            background: "linear-gradient(45deg, #ff0000, #ff6b6b, #ffa500, #ff0000)",
            backgroundSize: "300% 300%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          COSMIC VOTING
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 max-w-2xl"
          animate={{
            color: ["#d1d5db", "#fbbf24", "#d1d5db"]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Click on planets to explore • Vote for the most epic farewells
        </motion.p>

        {/* Voting stats */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">
                {pages.filter(p => p.isHallOfFame).length} Legends
              </span>
            </div>
          </motion.div>

          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 text-red-400">
              <Heart className="w-5 h-5" />
              <span className="font-bold">
                {pages.reduce((sum, page) => sum + page.votes, 0).toLocaleString()} Total Votes
              </span>
            </div>
          </motion.div>

          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 text-blue-400">
              <Star className="w-5 h-5" />
              <span className="font-bold">
                {Object.keys(userVotes).length} Your Votes
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating vote buttons */}
      <AnimatePresence>
        {pages.map((page, index) => {
          const hasVoted = userVotes[page.id];
          const isSelected = selectedPlanet && selectedPlanet.id === page.id;
          
          // Calculate position based on 3D planet position (mock calculation)
          const screenPos = {
            x: window.innerWidth * (0.3 + (index * 0.1)) + Math.sin(index) * 100,
            y: window.innerHeight * (0.4 + (index * 0.08)) + Math.cos(index) * 80
          };

          return (
            <motion.div
              key={page.id}
              className="absolute pointer-events-auto"
              style={{
                left: screenPos.x,
                top: screenPos.y,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: isSelected ? 1.3 : 1,
                zIndex: isSelected ? 100 : 1
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 400
              }}
            >
              {/* Planet info card */}
              <motion.div
                className="relative mb-4"
                animate={isSelected ? {
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isSelected ? Infinity : 0
                }}
              >
                <motion.div
                  className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 min-w-max shadow-2xl"
                  style={{
                    borderColor: isSelected ? page.color : undefined,
                    boxShadow: isSelected ? `0 0 30px ${page.color}60` : undefined
                  }}
                  animate={isSelected ? {
                    borderColor: [page.color, '#ffffff', page.color]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: page.color }}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity }
                      }}
                    />
                    <h3 className="text-white font-bold text-lg max-w-xs truncate">
                      {page.title}
                    </h3>
                    {page.isHallOfFame && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                    <span className="capitalize" style={{ color: getToneColor(page.tone) }}>
                      {page.tone?.replace('-', ' ')}
                    </span>
                    <span>#{page.rank}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {page.votes.toLocaleString()}
                    </span>
                  </div>

                  {/* Vote button */}
                  <motion.button
                    className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${
                      hasVoted
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-500 hover:to-pink-500'
                    }`}
                    onClick={() => !hasVoted && onVote(page.id)}
                    disabled={hasVoted}
                    whileHover={!hasVoted ? {
                      scale: 1.05,
                      boxShadow: `0 10px 30px ${page.color}60`
                    } : {}}
                    whileTap={!hasVoted ? { scale: 0.95 } : {}}
                    animate={!hasVoted ? {
                      boxShadow: [
                        "0 0 0px rgba(239, 68, 68, 0)",
                        "0 0 20px rgba(239, 68, 68, 0.5)",
                        "0 0 0px rgba(239, 68, 68, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {!hasVoted && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"
                        initial={false}
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {hasVoted ? (
                        <>
                          <Heart className="w-5 h-5 fill-current" />
                          Voted!
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          Vote to Orbit
                        </>
                      )}
                    </span>

                    {!hasVoted && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute -inset-1 rounded-xl border border-red-500/30"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.4
                            }}
                          />
                        ))}
                      </>
                    )}
                  </motion.button>

                  {/* Vote progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>To Legend Status</span>
                      <span>{Math.floor((page.votes / 3000) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <motion.div
                        className="h-1.5 rounded-full"
                        style={{
                          background: page.isHallOfFame
                            ? "linear-gradient(90deg, #ffd700, #ffed4e)"
                            : `linear-gradient(90deg, ${page.color}, #ffffff)`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((page.votes / 3000) * 100, 100)}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Floating vote counter */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {page.votes}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Particle trail */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: page.color,
                      left: `${20 + i * 30}%`,
                      top: `${50 + Math.sin(i) * 20}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [0, -30, -60]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Bottom CTA */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.button
          className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-black text-xl flex items-center gap-4 relative overflow-hidden group"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
          <span className="relative z-10 flex items-center gap-4">
            <Sparkles className="w-6 h-6" />
            Create Your Own Legend
            <Zap className="w-6 h-6" />
          </span>

          {/* Button particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: '50%'
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VotingInterface;