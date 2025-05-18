/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Eye, Calendar, Heart } from 'lucide-react';
import { getUserPages, getAllVotes } from "../services/pages";
import { useEffect, useState } from 'react';

const StatsCards = ({ userPages, totalViews, user, formatDate, onVote }) => {
  // Calculate total votes from all user pages
  const totalVotes = userPages.reduce((sum, page) => sum + (page.votes || 0), 0);

  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchUserPages = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const fetchedPages = await getUserPages(token);
        setPages(fetchedPages);
      } catch (error) {
        console.error("Error fetching user pages:", error);
      }
    };

    fetchUserPages();
  }, []);

  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchAllVotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const fetchedVotes = await getAllVotes(token);
        setVotes(fetchedVotes);
        console.log("Fetched votes:", fetchedVotes);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchAllVotes();
  }, []);

  const stats = [
    { 
      label: "Farewell Pages", 
      value: pages.pages?.length || 0, 
      icon: <Calendar className="w-8 h-8" />, 
      color: "from-blue-500 to-cyan-500" 
    },
    // { 
    //   label: "Total Views", 
    //   value: totalViews.toLocaleString(), 
    //   icon: <Eye className="w-8 h-8" />, 
    //   color: "from-purple-500 to-pink-500" 
    // },
    { 
      label: "Total Votes", 
      value: votes.votedPages?.length || 0, 
      icon: <Heart className="w-8 h-8" />, 
      color: "from-red-500 to-orange-500" 
    },
    { 
      label: "Member Since", 
      value: formatDate(user.createdAt), 
      icon: <Trophy className="w-8 h-8" />, 
      color: "from-amber-500 to-yellow-500" 
    }
  ];

  return (
    <motion.section 
      className="relative py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      className="text-2xl font-bold text-white"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Voting Section for User Pages */}
        {userPages.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Your Pages - Vote to Enter Hall of Fame
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPages.map((page, index) => (
                <PageVoteCard 
                  key={page.slug} 
                  page={page} 
                  index={index}
                  onVote={onVote}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

// Separate component for page voting cards
const PageVoteCard = ({ page, index, onVote, formatDate }) => {
  const handleVote = () => {
    if (onVote) {
      onVote(page.slug);
    }
  };

  const getToneColor = (tone) => {
    const colors = {
      dramatic: 'from-red-500 to-pink-500',
      ironic: 'from-purple-500 to-indigo-500',
      touching: 'from-blue-500 to-cyan-500',
      absurd: 'from-green-500 to-teal-500',
      classy: 'from-gray-500 to-slate-500',
      cringe: 'from-pink-500 to-rose-500',
      honest: 'from-orange-500 to-amber-500'
    };
    return colors[tone] || 'from-gray-500 to-slate-500';
  };

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {page.title}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-lg bg-gradient-to-r ${getToneColor(page.tone)} text-xs font-medium text-white`}>
              {page.tone}
            </span>
            <span className="text-gray-400 text-xs">
              {formatDate(page.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {page.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {page.votes || 0}
          </span>
        </div>

        <motion.button
          onClick={handleVote}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-medium text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy className="w-4 h-4" />
          Vote
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StatsCards;