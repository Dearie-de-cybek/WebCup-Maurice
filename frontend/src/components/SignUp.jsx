/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Heart, Sparkles } from 'lucide-react';

const SignUp = ({ onClose, onSignIn, onSwitchToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Audio context not available');
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play gentle chime sound effect
  const playGentleChime = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    
    // Create a gentle, uplifting chime progression
    const frequencies = [523, 659, 784, 523, 659]; // C5, E5, G5, C5, E5
    const timings = [0, 0.2, 0.4, 0.8, 1.0];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + timings[index];
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.8);
    });
  };

  // Play heartwarming welcome sound
  const playWelcomeSound = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    
    // Create warm, welcoming chord progression
    const chords = [
      [261, 329, 392], // C major
      [293, 370, 440], // D major
      [329, 415, 494], // E major
      [261, 329, 392]  // C major
    ];
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((freq, noteIndex) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + (chordIndex * 0.5);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 1.5);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    setLoading(true);

    // Play welcome sound when creating account
    playWelcomeSound();

    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Create user account
    const userData = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
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

  const handleSwitchToSignIn = () => {
    playGentleChime();
    onSwitchToSignIn();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Soft Background Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/70 to-rose-900/60"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.85 }}
        onClick={onClose} 
      />
      
      {/* Different Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.5, 0.15],
              scale: [0.8, 1.1, 0.8],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          >
            ⭐
          </motion.div>
        ))}

        {/* Floating Clouds */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.9, 1.2, 0.9]
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          >
            ☁️
          </motion.div>
        ))}

        {/* Floating Moons */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`moon-${i}`}
            className="absolute text-xl opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            🌙
          </motion.div>
        ))}
        
        {/* Soft Light Rays */}
        <motion.div
          className="absolute top-0 left-1/4 w-0.5 sm:w-1 h-full bg-gradient-to-b from-pink-300/30 via-rose-400/15 to-transparent"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scaleX: [1, 1.5, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-0.5 sm:w-1 h-full bg-gradient-to-b from-purple-300/30 via-pink-400/15 to-transparent"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [1, 1.8, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />
        
        {/* Gentle Sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300/40 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.8, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Main Form Container - Made Smaller */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-xs sm:max-w-sm mx-auto"
      >
        {/* Soft Glowing Border Container */}
        <div className="relative bg-gradient-to-br from-white/10 via-pink-100/10 to-purple-100/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          {/* Gentle Glowing Border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
                'linear-gradient(45deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5), rgba(168, 85, 247, 0.5))',
                'linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))'
              ],
              boxShadow: [
                '0 0 20px rgba(236, 72, 153, 0.2)',
                '0 0 40px rgba(236, 72, 153, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)',
                '0 0 20px rgba(236, 72, 153, 0.2)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Inner content container */}
          <div className="relative bg-gradient-to-br from-white/95 via-pink-50/90 to-purple-50/85 m-1 rounded-3xl shadow-xl">
            <div className="p-5 sm:p-6">
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-5 sm:mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mb-3 shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(236, 72, 153, 0.3)",
                      "0 0 30px rgba(236, 72, 153, 0.5)",
                      "0 0 20px rgba(236, 72, 153, 0.3)"
                    ],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Begin Your Journey
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm px-2">
                  Create something beautiful from life's endings
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <motion.div variants={itemVariants} className="relative">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your beautiful name"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-800 placeholder-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-sm shadow-sm"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-800 placeholder-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-sm shadow-sm"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-800 placeholder-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-sm shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-800 placeholder-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-sm shadow-sm"
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 text-white font-bold rounded-xl hover:from-pink-500 hover:via-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
                  whileHover={{ 
                    boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)",
                    scale: 1.02
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Creating your space...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Start Your Journey
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* Switch to SignIn */}
                <motion.div variants={itemVariants} className="text-center">
                  <button
                    type="button"
                    onClick={handleSwitchToSignIn}
                    className="text-gray-600 hover:text-gray-800 transition-colors text-xs"
                  >
                    Already have an account? 
                    <span className="text-pink-500 underline font-semibold ml-1 hover:text-pink-600">
                      Sign in here
                    </span>
                  </button>
                </motion.div>
              </form>
            </div>

            {/* Card Decorative Elements - Updated Emojis */}
            <div className="absolute top-3 right-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300 opacity-60"
              >
                🦋
              </motion.div>
            </div>
            
            <div className="absolute bottom-3 left-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                  rotate: [0, 360]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 opacity-50"
              >
                🌟
              </motion.div>
            </div>

            <div className="absolute top-3 left-3">
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.9, 1.1, 0.9],
                  y: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                className="w-4 h-4 text-rose-300 opacity-40"
              >
                🌸
              </motion.div>
            </div>

            <div className="absolute bottom-3 right-3">
              <motion.div
                animate={{ 
                  rotate: [0, -360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 text-indigo-200 opacity-30"
              >
                🔮
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;