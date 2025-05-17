/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Crown, Eye, Calendar } from 'lucide-react';

const VotingInterface = ({ pages, userVotes, onVote, selectedPlanet }) => {
  const titleRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Import GSAP dynamically for text animations
    if (typeof window !== 'undefined') {
      import('gsap').then(({ default: gsap }) => {
        // Sophisticated text animation with GSAP
        gsap.fromTo(titleRef.current?.children || [], 
          { 
            opacity: 0, 
            y: 100,
            rotationX: -90 
          },
          { 
            opacity: 1, 
            y: 0,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            delay: 0.3
          }
        );

        // Stats counter animation
        gsap.fromTo(statsRef.current?.children || [],
          { 
            opacity: 0, 
            scale: 0.8,
            y: 30 
          },
          { 
            opacity: 1, 
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 1
          }
        );
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getToneGradient = (tone) => {
    const gradients = {
      dramatic: 'from-amber-500/20 to-orange-600/20',
      ironic: 'from-purple-500/20 to-indigo-600/20', 
      touching: 'from-blue-500/20 to-cyan-600/20',
      absurd: 'from-emerald-500/20 to-teal-600/20',
      classy: 'from-slate-500/20 to-gray-600/20',
      cringe: 'from-pink-500/20 to-rose-600/20',
      'passive-aggressive': 'from-red-500/20 to-orange-600/20',
      honest: 'from-violet-500/20 to-purple-600/20'
    };
    return gradients[tone] || 'from-gray-500/20 to-slate-600/20';
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Professional Header */}
      <div className="absolute top-0 left-0 right-0 p-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main Title */}
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-7xl font-light tracking-tight text-white">
              <span className="font-thin">Cosmic</span>
              <span className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mx-4">
                Voices
              </span>
            </h1>
            <p className="text-xl text-gray-400 font-light mt-4 max-w-2xl mx-auto leading-relaxed">
              Discover extraordinary farewells that transcend the ordinary
            </p>
          </div>

          {/* Elegant Stats Bar */}
          <motion.div 
            ref={statsRef}
            className="flex justify-center items-center gap-12"
            variants={containerVariants}
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">
                {pages.filter(p => p.isHallOfFame).length} Legends
              </span>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">
                {formatNumber(pages.reduce((sum, page) => sum + page.votes, 0))} Voices
              </span>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Eye className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">
                {formatNumber(pages.reduce((sum, page) => sum + page.views, 0))} Views
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Professional Voting Cards */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pages.map((page, index) => {
            const hasVoted = userVotes[page.id];
            const isSelected = selectedPlanet && selectedPlanet.id === page.id;
            
            return (
              <motion.div
                key={page.id}
                className="group pointer-events-auto"
                variants={cardVariants}
                whileHover={{ y: -8 }}
                layout
              >
                <div className={`
                  relative bg-gradient-to-br ${getToneGradient(page.tone)}
                  backdrop-blur-xl border border-white/10 rounded-2xl p-6
                  transition-all duration-500 overflow-hidden
                  ${isSelected ? 'ring-2 ring-white/50 bg-white/10' : ''}
                  ${page.isHallOfFame ? 'border-amber-500/30' : ''}
                `}>
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
                  </div>

                  {/* Hall of Fame Indicator */}
                  {page.isHallOfFame && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Crown className="w-6 h-6 text-amber-400" />
                    </motion.div>
                  )}

                  {/* Rank Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                        ${page.rank <= 3 
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' 
                          : 'bg-white/10 text-white border border-white/20'
                        }
                      `}
                      animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      #{page.rank}
                    </motion.div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(page.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      by <span className="text-blue-300">{page.author}</span>
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 capitalize">
                        {page.tone?.replace('-', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Heart className="w-4 h-4" />
                        {formatNumber(page.votes)}
                      </span>
                    </div>
                  </div>

                  {/* Vote Button */}
                  <motion.button
                    className={`
                      w-full py-4 rounded-xl font-medium transition-all duration-300
                      flex items-center justify-center gap-3 relative overflow-hidden
                      ${hasVoted 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }
                    `}
                    onClick={() => !hasVoted && onVote(page.id)}
                    disabled={hasVoted}
                    whileHover={!hasVoted ? { scale: 1.02 } : {}}
                    whileTap={!hasVoted ? { scale: 0.98 } : {}}
                  >
                    {hasVoted ? (
                      <>
                        <Heart className="w-5 h-5 fill-current" />
                        Voted
                      </>
                    ) : (
                      <>
                        <span>Cast Your Voice</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>

                  {/* Progress Indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Progress to Legend</span>
                      <span>{Math.floor((page.votes / 3000) * 100)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          page.isHallOfFame 
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                            : 'bg-gradient-to-r from-white/30 to-white/50'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((page.votes / 3000) * 100, 100)}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Elegant CTA */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 
                     backdrop-blur-md border border-white/20 rounded-full 
                     text-white font-medium flex items-center gap-3
                     hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300
                     pointer-events-auto"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span>Create Your Legend</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Subtle ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VotingInterface;