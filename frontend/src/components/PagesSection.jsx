/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import PageCard from './PageCard';

const PagesSection = ({ userPages, formatDate }) => {
  return (
    <motion.section 
      className="relative min-h-screen p-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-6xl font-black text-center mb-16"
          style={{
            background: "linear-gradient(45deg, #ffffff, #ff6b6b, #ffffff)",
            backgroundSize: "200% 200%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          YOUR DIGITAL LEGACY
        </motion.h2>

        {userPages.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🫥
            </motion.div>
            <h3 className="text-4xl font-bold text-gray-300 mb-4">The Void Awaits</h3>
            <p className="text-xl text-gray-500 mb-8">Your first masterpiece of goodbye is yet to be born...</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl font-bold text-lg"
            >
              Birth Your First Exit
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {userPages.map((page, index) => (
              <PageCard 
                key={page.slug}
                page={page}
                index={index}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default PagesSection;