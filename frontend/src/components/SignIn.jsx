/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Skull, Flame } from 'lucide-react';

const SignIn = ({ onClose, onSignIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call here Uche or Mike
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create user session in localStorage you can take this from localStorage guys
    const userData = {
      id: Math.random().toString(36).substring(7),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('theend_user', JSON.stringify(userData));
    setLoading(false);
    onSignIn(userData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dramatic Background */}
      <div className="absolute inset-0 bg-white bg-opacity-0" onClick={onClose} />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Fire Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Dramatic Light Beams */}
        <motion.div
          className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-gray-500/30 to-transparent"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [1, 1.5, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-purple-500/30 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
            scaleX: [1, 2, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Main Form Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-gradient-to-br from-gray-100 bg-pink-400 to-purple-300 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden max-w-md w-full"
      >
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-red-500/20 rounded-2xl opacity-75" />
        
        <div className="relative p-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-purple-600 rounded-full mb-4"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                  "0 0 40px rgba(239, 68, 68, 0.8)",
                  "0 0 20px rgba(239, 68, 68, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Skull className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white mb-2">
              {isLogin ? 'Enter the Void' : 'Join the End'}
            </h2>
            <p className="text-red-300 text-sm">
              {isLogin ? 'Login to access your farewell pages' : 'Create your dramatic exit account'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="relative">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
              whileHover={{ boxShadow: "0 0 30px rgba(239, 68, 68, 0.6)" }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  {isLogin ? 'Entering...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  {isLogin ? 'Enter the Void' : 'Begin the End'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Toggle Form */}
            <motion.div variants={itemVariants} className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-300 hover:text-white transition-colors text-sm"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="underline font-semibold">
                  {isLogin ? 'Join the End' : 'Enter the Void'}
                </span>
              </button>
            </motion.div>
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 text-red-400 opacity-30"
          >
            ⚡
          </motion.div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-8 h-8 text-purple-400 opacity-30"
          >
            🔥
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;