/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
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
  const audioContextRef = useRef(null);
  const backgroundNoiseRef = useRef(null);

  // Initialize audio context and background noise
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      startBackgroundNoise();
    } catch (error) {
      console.log('Audio context not available');
    }

    return () => {
      if (backgroundNoiseRef.current) {
        backgroundNoiseRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Create spooky background noise using Web Audio API
  const startBackgroundNoise = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    // Create brown noise (darker than white noise)
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Amplify
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    
    // Apply low-pass filter for darker sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(200, audioContext.currentTime);
    
    // Very low volume for background ambience
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    
    noiseSource.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noiseSource.start();
    backgroundNoiseRef.current = noiseSource;
  };

  // Play crying sound effect
  const playCryingSound = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create crying-like sound with tremolo
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  // Play wicked laugh sound effect
  const playWickedLaugh = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    
    // Create a series of oscillators for laugh effect
    const laughNotes = [200, 250, 180, 220, 160, 240];
    
    laughNotes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sawtooth';
      
      const startTime = audioContext.currentTime + (index * 0.15);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.1);
    });
  };

  // Play dark lord welcome voice effect
  const playDarkLordVoice = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    
    // Create deep, ominous voice-like effect
    const frequencies = [80, 120, 160, 100, 140, 90, 110, 130];
    const timings = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sawtooth';
      
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(400, audioContext.currentTime);
      
      const startTime = audioContext.currentTime + timings[index];
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Play dark lord voice when submitting
    playDarkLordVoice();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create user session in localStorage
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

  const handleToggleForm = () => {
    playWickedLaugh();
    setIsLogin(!isLogin);
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
      {/* Dramatic Background Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0.9 }}
        onClick={onClose} 
      />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Fire Particles - Better positioned */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-orange-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.8, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Improved Light Beams */}
        <motion.div
          className="absolute top-0 left-1/4 w-0.5 sm:w-1 h-full bg-gradient-to-b from-red-500/40 via-red-600/20 to-transparent"
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scaleX: [1, 1.8, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-0.5 sm:w-1 h-full bg-gradient-to-b from-purple-500/40 via-purple-600/20 to-transparent"
          animate={{
            opacity: [0.3, 1, 0.3],
            scaleX: [1, 2.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
        />
        
        {/* Additional atmospheric effects */}
        <motion.div
          className="absolute top-1/4 left-1/2 w-px h-32 bg-gradient-to-b from-orange-500/30 to-transparent"
          animate={{
            opacity: [0, 0.6, 0],
            height: ['8rem', '16rem', '8rem'],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main Form Container - Improved responsive design */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-sm sm:max-w-md mx-auto"
      >
        {/* Fixed Glowing Border Container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-red-900/80 to-black rounded-2xl overflow-hidden">
          {/* Animated Glowing Border */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(239, 68, 68, 0.5), rgba(147, 51, 234, 0.5), rgba(239, 68, 68, 0.5))',
                'linear-gradient(45deg, rgba(147, 51, 234, 0.8), rgba(239, 68, 68, 0.8), rgba(147, 51, 234, 0.8))',
                'linear-gradient(45deg, rgba(239, 68, 68, 0.5), rgba(147, 51, 234, 0.5), rgba(239, 68, 68, 0.5))'
              ],
              boxShadow: [
                '0 0 30px rgba(239, 68, 68, 0.3)',
                '0 0 60px rgba(239, 68, 68, 0.6), 0 0 90px rgba(147, 51, 234, 0.4)',
                '0 0 30px rgba(239, 68, 68, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Inner content container */}
          <div className="relative bg-gradient-to-br from-gray-900 via-red-900 to-black m-1 rounded-2xl">
            <div className="p-6 sm:p-8">
              {/* Header - Improved spacing */}
              <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-600 to-purple-600 rounded-full mb-4"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(239, 68, 68, 0.5)",
                      "0 0 40px rgba(239, 68, 68, 0.8)",
                      "0 0 20px rgba(239, 68, 68, 0.5)"
                    ],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  {isLogin ? 'Enter the Void' : 'Join the End'}
                </h2>
                <p className="text-red-300 text-xs sm:text-sm px-2">
                  {isLogin ? 'Login to access your farewell pages' : 'Create your dramatic exit account'}
                </p>
              </motion.div>

              {/* Form - Improved responsive spacing */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onFocus={playCryingSound}
                          placeholder="Full Name"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm sm:text-base"
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="relative">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onFocus={playCryingSound}
                      placeholder="Email Address"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onFocus={playCryingSound}
                      placeholder="Password"
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm sm:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
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
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          onFocus={playCryingSound}
                          placeholder="Confirm Password"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm sm:text-base"
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button - Enhanced */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                  whileHover={{ 
                    boxShadow: "0 0 40px rgba(239, 68, 68, 0.6)",
                    scale: 1.02
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                      {isLogin ? 'Entering the Void...' : 'Joining the End...'}
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                      {isLogin ? 'Enter the Void' : 'Begin the End'}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </motion.button>

                {/* Toggle Form - Enhanced */}
                <motion.div variants={itemVariants} className="text-center">
                  <button
                    type="button"
                    onClick={handleToggleForm}
                    className="text-red-300 hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span className="underline font-semibold">
                      {isLogin ? 'Join the End' : 'Enter the Void'}
                    </span>
                  </button>
                </motion.div>
              </form>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 opacity-40"
              >
                ⚡
              </motion.div>
            </div>
            
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 opacity-40"
              >
                🔥
              </motion.div>
            </div>

            {/* Additional corner decoration */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
              <motion.div
                animate={{ 
                  opacity: [0.2, 0.7, 0.2],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 opacity-30"
              >
                💀
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;