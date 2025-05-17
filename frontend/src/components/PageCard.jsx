/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ExternalLink, Share2, Trash2 } from 'lucide-react';

const PageCard = ({ page, index, formatDate }) => {
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

  const actionButtons = [
    { icon: ExternalLink, color: "blue", action: () => {}, title: "View Page" },
    { icon: Share2, color: "green", action: () => {}, title: "Share Page" },
    { icon: Trash2, color: "red", action: () => {}, title: "Delete Page" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-2xl rounded-3xl border border-white/10"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(17, 24, 39, 0.4), rgba(31, 41, 55, 0.4))",
              "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(147, 51, 234, 0.1))",
              "linear-gradient(135deg, rgba(17, 24, 39, 0.4), rgba(31, 41, 55, 0.4))"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: index * 1.5 }}
        />
        
        <div className="relative p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div
              className="text-6xl"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotateY: { duration: 8, repeat: Infinity },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              {getToneEmoji(page.tone)}
            </motion.div>
            
            <div>
              <motion.h3
                className="text-3xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.1)" }}
              >
                {page.title}
              </motion.h3>
              <div className="flex items-center gap-6 text-gray-400">
                <span className="capitalize text-lg">{page.tone?.replace('-', ' ')}</span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  •
                </motion.span>
                <span>{formatDate(page.createdAt)}</span>
                <span className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5" />
                  <motion.span
                    key={page.views}
                    initial={{ scale: 1.2, color: "#ef4444" }}
                    animate={{ scale: 1, color: "#9ca3af" }}
                    transition={{ duration: 0.5 }}
                  >
                    {(page.views || 0).toLocaleString()}
                  </motion.span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actionButtons.map((btn, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2, rotateZ: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={btn.action}
                className="p-3 text-gray-400 hover:text-white transition-colors relative group"
                title={btn.title}
              >
                <btn.icon className="w-5 h-5" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Impact visualization */}
        <div className="relative px-8 pb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Impact Level</span>
            <span>{page.views || 0} souls reached</span>
          </div>
          <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #ef4444, #f97316, #eab308)"
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min((page.views || 0) / 100 * 100, 100)}%` }}
              transition={{ duration: 2, delay: index * 0.3 }}
              viewport={{ once: true }}
            />
            
            {/* Glowing effect */}
            <motion.div
              className="absolute top-0 left-0 h-full w-full rounded-full"
              animate={{
                boxShadow: [
                  "inset 0 0 5px rgba(239, 68, 68, 0.5)",
                  "inset 0 0 15px rgba(239, 68, 68, 0.8)",
                  "inset 0 0 5px rgba(239, 68, 68, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PageCard;