/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const StatsCards = ({ userPages, totalViews, user, formatDate }) => {
  const stats = [
    { label: "Farewell Pages", value: userPages.length, icon: "📄", color: "red" },
    { label: "Total Impact", value: totalViews.toLocaleString(), icon: "👁️", color: "purple" },
    { label: "Member Since", value: formatDate(user.joinedAt), icon: "📅", color: "blue" }
  ];

  return (
    <motion.section 
      className="relative py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Floating Stats */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-white/10"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(147, 51, 234, 0.1))",
                    "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                    "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(239, 68, 68, 0.1))"
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: index * 0.5 }}
              />
              <div className="relative p-8 text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.7
                  }}
                >
                  {stat.icon}
                </motion.div>
                <motion.h3
                  className="text-4xl font-black text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-300 text-lg">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsCards;