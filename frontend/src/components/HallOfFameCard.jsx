import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Heart, Eye, Calendar, ExternalLink } from 'lucide-react';

const HallOfFameCard = ({ page, rank, isTopThree, size = 'medium' }) => {
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return Trophy;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'from-yellow-400 to-amber-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-amber-600 to-orange-700';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getToneColor = (tone) => {
    const colors = {
      dramatic: 'from-red-500/20 to-pink-500/20',
      ironic: 'from-purple-500/20 to-indigo-500/20',
      touching: 'from-blue-500/20 to-cyan-500/20',
      absurd: 'from-green-500/20 to-teal-500/20',
      classy: 'from-gray-500/20 to-slate-500/20',
      cringe: 'from-pink-500/20 to-rose-500/20',
      honest: 'from-orange-500/20 to-amber-500/20'
    };
    return colors[tone] || 'from-gray-500/20 to-slate-500/20';
  };

  const getSizeClasses = (size) => {
    switch(size) {
      case 'large': return 'p-8';
      case 'medium': return 'p-6';
      case 'small': return 'p-5';
      default: return 'p-6';
    }
  };

  const RankIcon = getRankIcon(rank);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className={`
        relative h-full bg-gradient-to-br ${getToneColor(page.tone)}
        backdrop-blur-sm rounded-2xl border border-white/10 
        hover:border-white/20 transition-all duration-300 overflow-hidden
        ${getSizeClasses(size)}
      `}>
        {/* Rank badge */}
        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        >
          <div className={`
            w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(rank)}
            flex items-center justify-center text-black font-bold
            ${isTopThree ? 'shadow-lg' : ''}
          `}>
            {rank <= 3 ? (
              <RankIcon className="w-6 h-6" />
            ) : (
              <span className="text-sm">#{rank}</span>
            )}
          </div>
        </motion.div>

        {/* Hall of Fame indicator */}
        {isTopThree && (
          <motion.div
            className="absolute top-4 left-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-2xl">⭐</span>
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1">
            <motion.h3
              className={`font-bold text-white mb-3 line-clamp-2 ${
                size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {page.title}
            </motion.h3>

            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className="text-blue-300 font-medium">{page.author}</span>
              <span className="text-gray-500">•</span>
              <span className={`
                px-2 py-1 rounded-lg bg-gradient-to-r ${getToneColor(page.tone).replace('/20', '/40')}
                text-xs font-medium text-white border border-white/10
              `}>
                {page.tone}
              </span>
            </motion.div>

            <motion.p
              className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {page.preview}
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-between pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                {page.votes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-blue-400" />
                {page.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(page.createdAt)}
              </span>
            </div>

            <motion.button
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
        </div>

        {/* Hover effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          initial={false}
        />

        {/* Special effects for top 3 */}
        {isTopThree && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                `0 0 20px ${rank === 1 ? 'rgba(245, 158, 11, 0.2)' : rank === 2 ? 'rgba(156, 163, 175, 0.2)' : 'rgba(217, 119, 6, 0.2)'}`,
                `0 0 40px ${rank === 1 ? 'rgba(245, 158, 11, 0.4)' : rank === 2 ? 'rgba(156, 163, 175, 0.4)' : 'rgba(217, 119, 6, 0.4)'}`,
                `0 0 20px ${rank === 1 ? 'rgba(245, 158, 11, 0.2)' : rank === 2 ? 'rgba(156, 163, 175, 0.2)' : 'rgba(217, 119, 6, 0.2)'}`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default HallOfFameCard;