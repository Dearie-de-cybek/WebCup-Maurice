
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Skull, Flame } from 'lucide-react';

const SignIn = ({ onClose, onSignIn, onSwitchToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate login - in real app, validate credentials here
    const userData = {
      email: formData.email,
      password: formData.password
    };

    setLoading(false);
    onSignIn(userData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSwitchToSignUp = () => {
    playWickedLaugh();
    onSwitchToSignUp();
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

  // Emotional emojis array
  const emotionalEmojis = ['🎤', '💔', '😢', '😇', '😞', '😭', '👼', '🥺', '😴', '💔', '😵', '😪', '😔', '🎭', '💀', '🔇', '😿', '👻', '⚰️', '🕯️'];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark Background Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gray-900"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0.95 }}
        onClick={onClose} 
      />
      
      {/* Floating Emotional Emojis Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {emotionalEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, Math.random() * 360, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        ))}
        
        {/* Subtle Purple Glow Effects */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-purple-900 opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-800 opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />
      </div>

      {/* Main Form Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-sm sm:max-w-md mx-auto"
      >
        {/* Subtle Purple Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-purple-900/30"
          animate={{
            borderColor: ['rgba(88, 28, 135, 0.3)', 'rgba(107, 33, 168, 0.5)', 'rgba(88, 28, 135, 0.3)']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Inner content container */}
        <div className="relative bg-gray-800 border border-purple-900/20 rounded-2xl">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-purple-900 rounded-full mb-4 border border-purple-700"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(126, 34, 206, 0.3)",
                    "0 0 30px rgba(126, 34, 206, 0.5)",
                    "0 0 20px rgba(126, 34, 206, 0.3)"
                  ],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-2xl sm:text-3xl">💔</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Enter the Void
              </h2>
              <p className="text-purple-300 text-xs sm:text-sm px-2">
                Welcome back to your realm of farewells
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <motion.div variants={itemVariants} className="relative">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onFocus={playCryingSound}
                    placeholder="Email Address"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-900 border border-purple-900/40 rounded-lg text-white placeholder-purple-300/50 focus:border-purple-700 focus:ring-2 focus:ring-purple-900/30 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onFocus={playCryingSound}
                    placeholder="Password"
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-gray-900 border border-purple-900/40 rounded-lg text-white placeholder-purple-300/50 focus:border-purple-700 focus:ring-2 focus:ring-purple-900/30 transition-all text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-purple-900 text-white font-bold rounded-lg hover:bg-purple-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base border border-purple-800"
                whileHover={{ 
                  boxShadow: "0 0 30px rgba(126, 34, 206, 0.4)",
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                    Entering the Void...
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                    Enter the Void
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </motion.button>

              {/* Switch to SignUp */}
              <motion.div variants={itemVariants} className="text-center">
                <button
                  type="button"
                  onClick={handleSwitchToSignUp}
                  className="text-purple-300 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  New to the darkness? 
                  <span className="underline font-semibold ml-1">
                    Join the End
                  </span>
                </button>
              </motion.div>
            </form>
          </div>

          
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;