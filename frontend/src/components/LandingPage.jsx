/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Zap, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from './shared/FeatureCard';
import FloatingElements from './shared/FloatingElements';
import SignIn from './SignIn';
import Dashboard from './Dashboard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check for existing user session
  useEffect(() => {
    const userData = localStorage.getItem('theend_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleGetStarted = () => {
    navigate('/pagebuilder');
  };

  const handleSignIn = (userData) => {
    setUser(userData);
    setShowSignIn(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('theend_user');
    setUser(null);
    setShowDashboard(false);
  };

  const openDashboard = () => {
    setShowDashboard(true);
  };

  // If dashboard is open, show it
  if (showDashboard) {
    return (
      <Dashboard 
        user={user} 
        onSignOut={handleSignOut}
        onClose={() => setShowDashboard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          TheEnd<span className="text-purple-300">.page</span>
        </motion.div>
        
        <div className="flex items-center gap-4">
          {user ? (
            // User is signed in
            <>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openDashboard}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                <User className="w-4 h-4" />
                {user.name}
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="p-2 text-white/70 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </>
          ) : (
            // User is not signed in
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignIn(true)}
              className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6"
          >
            Make Your
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
            >
              EXIT
            </motion.span>
            Unforgettable
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Leaving a job? Ending a project? Breaking up? Create a personalized goodbye page 
            that's dramatic, classy, or deliciously petty. Because if it's the end, 
            make it clickable.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-full text-xl font-bold inline-flex items-center gap-3 shadow-2xl"
          >
            Create Your Exit
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard 
            icon={<Sparkles />}
            title="8 Unique Tones"
            description="From passive-aggressive to touchingly honest"
            delay={1.2}
          />
          <FeatureCard 
            icon={<Zap />}
            title="Instant Creation"
            description="Built and shared in under 2 minutes"
            delay={1.4}
          />
          <FeatureCard 
            icon={<Heart />}
            title="Shareable Links"
            description="Send it to everyone who needs to see it"
            delay={1.6}
          />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Sign In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <SignIn
            onClose={() => setShowSignIn(false)}
            onSignIn={handleSignIn}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;