/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart } from 'lucide-react';
import { addVoteToPage } from '../services/pages';

const VotingButton = ({ pageId, pageSlug, initialVotes = 0, hasVoted = false, onVote }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(hasVoted);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (voted || isVoting || !pageId) return;
    
    setIsVoting(true);
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('You need to be logged in to vote');
        return;
      }

      // Call the API to add a vote to the page using pageId
      const updatedPage = await addVoteToPage(pageId, token);

      // Update local state
      setVotes(prev => updatedPage.votes || prev + 1);
      setVoted(true);
      
      // Call the onVote callback if provided
      if (onVote) {
        onVote(updatedPage.votes || votes + 1);
      }

      // Mark as voted locally using pageSlug for storage
      if (pageSlug) {
        const votedPages = JSON.parse(localStorage.getItem('voted_pages') || '[]');
        if (!votedPages.includes(pageSlug)) {
          votedPages.push(pageSlug);
          localStorage.setItem('voted_pages', JSON.stringify(votedPages));
        }
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert('You need to be logged in to vote');
        } else if (error.response.status === 403) {
          alert('You are not authorized to vote on this page');
        } else if (error.response.status === 409) {
          alert('You have already voted on this page');
          setVoted(true);
        } else {
          alert('Failed to submit vote. Please try again.');
        }
      } else {
        alert('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <motion.button
        onClick={handleVote}
        disabled={voted || isVoting}
        className={`
          relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
          ${voted 
            ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50 cursor-not-allowed' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:scale-105 active:scale-95'
          }
          ${isVoting ? 'opacity-70' : ''}
        `}
        whileHover={!voted ? { 
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
          y: -2 
        } : {}}
        whileTap={!voted ? { scale: 0.95 } : {}}
      >
        {/* Button content */}
        <div className="flex items-center gap-3">
          {voted ? (
            <>
              <Heart className="w-6 h-6 fill-current" />
              <span>Voted!</span>
            </>
          ) : (
            <>
              <Trophy className="w-6 h-6" />
              <span>{isVoting ? 'Voting...' : 'Vote for Hall of Fame'}</span>
            </>
          )}
        </div>

        {/* Vote count */}
        <motion.div
          className="mt-2 text-sm opacity-80"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          key={votes}
        >
          {votes.length} {votes === 1 ? 'vote' : 'votes'}
        </motion.div>

        {/* Loading spinner */}
        {isVoting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Success animation */}
        {voted && (
          <motion.div
            className="absolute inset-0 bg-green-500/20 rounded-xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
      
      {voted && (
        <motion.p
          className="mt-3 text-sm text-green-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Thank you for voting! 🏆
        </motion.p>
      )}
    </motion.div>
  );
};

export default VotingButton;