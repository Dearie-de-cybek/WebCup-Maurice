import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, ArrowLeft } from 'lucide-react';

const HallOfFameHeader = ({ totalPages }) => {
  return (
    <motion.div
      className="relative py-20 px-6"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </motion.div>

        {/* Main Header */}
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 150 }}
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(245, 158, 11, 0.5)",
                    "0 0 60px rgba(245, 158, 11, 0.8)",
                    "0 0 30px rgba(245, 158, 11, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Floating icons around crown */}
              {[Trophy, Star].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute w-8 h-8 text-amber-400"
                  style={{
                    top: index === 0 ? '-10px' : 'auto',
                    bottom: index === 1 ? '-10px' : 'auto',
                    right: index === 0 ? '-10px' : 'auto',
                    left: index === 1 ? '-10px' : 'auto'
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity, delay: index * 0.5 },
                    rotate: { duration: 4, repeat: Infinity, delay: index * 0.3 }
                  }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
              Hall of Fame
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            The most legendary digital farewells, immortalized by community votes. 
            These pages transcended the ordinary to become extraordinary.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex justify-center gap-8 md:gap-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <div className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-bold text-amber-400 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                {totalPages}
              </motion.div>
              <div className="text-gray-400 text-sm md:text-base">Legendary Pages</div>
            </div>

            <div className="w-px bg-gray-600"></div>

            <div className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-bold text-amber-400 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                ∞
              </motion.div>
              <div className="text-gray-400 text-sm md:text-base">Legacy Lives On</div>
            </div>

            <div className="w-px bg-gray-600"></div>

            <div className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-bold text-amber-400 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                ⭐
              </motion.div>
              <div className="text-gray-400 text-sm md:text-base">Elite Status</div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-1/2 left-10 text-amber-400/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity },
            scale: { duration: 3, repeat: Infinity }
          }}
        >
          <Trophy className="w-16 h-16" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-10 text-amber-400/20"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity },
            scale: { duration: 4, repeat: Infinity, delay: 1 }
          }}
        >
          <Star className="w-12 h-12" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HallOfFameHeader;