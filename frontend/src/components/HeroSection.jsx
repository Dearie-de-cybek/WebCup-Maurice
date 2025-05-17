/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Plus, LogOut } from 'lucide-react';

const HeroSection = ({ user, onSignOut }) => {
  return (
    <motion.section 
      className="relative h-screen flex items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <motion.div
            className="inline-block mb-8"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotateY: { duration: 8, repeat: Infinity },
              scale: { duration: 3, repeat: Infinity }
            }}
          >
            <Crown className="w-24 h-24 text-yellow-400 mx-auto filter drop-shadow-2xl" />
          </motion.div>
          
          <motion.h1 
            className="text-8xl font-black mb-6 relative"
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
            CREATIVE
            <motion.span
              className="block"
              animate={{ 
                rotateX: [0, 360],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
              style={{
                background: "linear-gradient(45deg, #8b5cf6, #06b6d4, #8b5cf6)",
                backgroundSize: "300% 300%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              FAREWELL
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Welcome back, <span className="text-red-400 font-bold">{user.name}</span>
            <br />
            <motion.span
              animate={{ 
                color: ["#rgb(156, 163, 175)", "#rgb(239, 68, 68)", "#rgb(156, 163, 175)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Master of Digital Departures
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-6 justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl font-black text-xl flex items-center gap-4 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
            <span className="relative z-10">Create New Exit</span>
            <Plus className="w-6 h-6 relative z-10" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, rotateZ: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignOut}
            className="px-8 py-6 border-2 border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <LogOut className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
    
    </motion.section>
  );
};

export default HeroSection;