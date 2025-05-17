/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Share2, 
  Trash2, 
  Edit3, 
  Plus, 
  Calendar, 
  TrendingUp,
  Skull,
  Crown,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onSignOut }) => {
  const [userPages, setUserPages] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  // Load user's pages
  useEffect(() => {
    const loadUserPages = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const allPages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
      const userPagesArray = Object.entries(allPages).map(([slug, page]) => ({
        slug,
        ...page
      }));
      
      setUserPages(userPagesArray);
      setTotalViews(userPagesArray.reduce((sum, page) => sum + (page.views || 0), 0));
      setLoading(false);
    };

    loadUserPages();
  }, []);

  // Play dramatic entrance audio
  useEffect(() => {
    if (!loading && audioRef.current) {
      // Create a dramatic entrance sound effect using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a dramatic chord progression
      const playDramaticChord = () => {
        const frequencies = [220, 277, 330, 415]; // A minor chord + high note
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          oscillator.connect(gainNode);
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sine';
          oscillator.start(audioContext.currentTime + index * 0.1);
          oscillator.stop(audioContext.currentTime + 2);
        });
      };

      try {
        playDramaticChord();
      } catch (error) {
        console.log('Audio context not available');
      }
    }
  }, [loading]);

  const handleDeletePage = (slug) => {
    const allPages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
    delete allPages[slug];
    localStorage.setItem('theend_pages', JSON.stringify(allPages));
    
    // Remove from session storage too
    sessionStorage.removeItem(`theend_page_${slug}`);
    
    // Update state
    setUserPages(userPages.filter(page => page.slug !== slug));
    setTotalViews(prev => prev - (allPages[slug]?.views || 0));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white text-xl font-semibold"
          >
            Loading your dark realm...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Embers */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto p-6"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                  "0 0 40px rgba(239, 68, 68, 0.8)",
                  "0 0 20px rgba(239, 68, 68, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-8 h-8 text-yellow-300" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black">Welcome back, {user.name}</h1>
              <p className="text-red-300">Master of Digital Farewells</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/pagebuilder')}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Exit
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignOut}
              className="p-3 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">Total Pages</p>
                <motion.p
                  className="text-3xl font-black text-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {userPages.length}
                </motion.p>
              </div>
              <Skull className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Views</p>
                <motion.p
                  className="text-3xl font-black text-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  {totalViews.toLocaleString()}
                </motion.p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-r from-orange-900/50 to-orange-800/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Member Since</p>
                <motion.p
                  className="text-lg font-black text-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  {formatDate(user.CreatedAt)}
                </motion.p>
              </div>
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Pages List */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-red-400" />
            Your Digital Farewells
          </h2>

          {userPages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 text-gray-400"
              >
                📄
              </motion.div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Pages Yet</h3>
              <p className="text-gray-500 mb-6">Your dramatic exits await creation...</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pagebuilder')}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg font-bold"
              >
                Create Your First Exit
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {userPages.map((page, index) => (
                  <motion.div
                    key={page.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30 hover:border-red-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="text-3xl"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {getToneEmoji(page.tone)}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                            {page.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="capitalize">{page.tone?.replace('-', ' ')}</span>
                            <span>•</span>
                            <span>{formatDate(page.createdAt)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {(page.views || 0).toLocaleString()} views
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open(`/view/${page.slug}`, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="View Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/view/${page.slug}`);
                            alert('Link copied to clipboard!');
                          }}
                          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                          title="Copy Link"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this farewell page?')) {
                              handleDeletePage(page.slug);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Views Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Impact Level</span>
                        <span>{page.views || 0} views</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <motion.div
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((page.views || 0) / 100 * 100, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Hidden audio element for sound effects */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Dashboard;