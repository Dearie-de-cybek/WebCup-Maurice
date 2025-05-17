/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  ExternalLink,
  Volume2,
  VolumeX,
  Hand
} from 'lucide-react';

const Dashboard = ({ user = { name: "Creative Soul", joinedAt: "2024-01-01" }, onSignOut = () => {} }) => {
  const [userPages, setUserPages] = useState([
    {
      slug: "dramatic-exit",
      title: "My Dramatic Exit", 
      tone: "dramatic",
      createdAt: "2024-05-15",
      views: 1247
    },
    {
      slug: "ironic-goodbye", 
      title: "Ironic Farewell",
      tone: "ironic", 
      createdAt: "2024-05-10",
      views: 856
    },
    {
      slug: "touching-message",
      title: "A Touch of Goodbye", 
      tone: "touching",
      createdAt: "2024-05-08", 
      views: 2103
    }
  ]);
  const [totalViews, setTotalViews] = useState(4206);
  const [loading, setLoading] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [showHandPointer, setShowHandPointer] = useState(true);
  
  const audioContextRef = useRef(null);
  const musicSourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const controls = useAnimation();

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize ambient background music
  useEffect(() => {
    if (!loading) {
      initializeAmbientMusic();
      setTimeout(() => setShowHandPointer(false), 8000); // Hide hand after 8 seconds
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [loading]);

  const initializeAmbientMusic = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create ambient background tones
      const createAmbientTone = (frequency, delay = 0) => {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        const filterNode = audioContextRef.current.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        oscillator.type = 'sine';
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioContextRef.current.currentTime + delay + 2);
        
        // Gentle frequency modulation
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.frequency.setValueAtTime(0.1, audioContextRef.current.currentTime);
        lfoGain.gain.setValueAtTime(5, audioContextRef.current.currentTime);
        
        oscillator.start(audioContextRef.current.currentTime + delay);
        lfo.start(audioContextRef.current.currentTime + delay);
        
        return { oscillator, gainNode, lfo };
      };

      // Create a beautiful ambient chord progression
      const ambientTones = [
        createAmbientTone(220, 0),    // A3
        createAmbientTone(277, 1),    // C#4
        createAmbientTone(330, 2),    // E4
        createAmbientTone(440, 3),    // A4
      ];

      musicSourceRef.current = ambientTones;

      // Master gain control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(musicPlaying ? 1 : 0, audioContextRef.current.currentTime);
      
    } catch (error) {
      console.log('Audio context not supported');
    }
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(
        musicPlaying ? 0 : 1, 
        audioContextRef.current.currentTime + 0.5
      );
    }
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

  // Morphing background shapes
  const morphingShapes = [...Array(6)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute opacity-20 pointer-events-none"
      style={{
        left: `${20 + i * 15}%`,
        top: `${10 + i * 12}%`,
        width: `${100 + i * 50}px`,
        height: `${100 + i * 50}px`,
      }}
      animate={{
        borderRadius: [
          "30% 70% 70% 30% / 30% 30% 70% 70%",
          "70% 30% 30% 70% / 70% 70% 30% 30%",
          "50% 50% 50% 50% / 50% 50% 50% 50%",
          "30% 70% 70% 30% / 30% 30% 70% 70%"
        ],
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1],
        background: [
          "linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(147, 51, 234, 0.3))",
          "linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))",
          "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(239, 68, 68, 0.3))"
        ]
      }}
      transition={{
        duration: 10 + i * 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  ));

  // Particle system
  const particles = [...Array(50)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
        opacity: [0, 1, 0],
        scale: [0, Math.random() * 2, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 8,
        ease: "easeInOut"
      }}
    />
  ));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Animated loading background */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(239, 68, 68, 0.1), transparent)`,
              }}
              animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center z-10"
        >
          <motion.div
            className="relative mb-8"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <div className="w-32 h-32 border-2 border-red-500 rounded-full border-t-transparent border-r-transparent" />
            <motion.div
              className="absolute inset-4 border-2 border-purple-500 rounded-full border-b-transparent border-l-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <motion.div
            animate={{ 
              background: [
                "linear-gradient(90deg, #ef4444, #8b5cf6)",
                "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                "linear-gradient(90deg, #06b6d4, #ef4444)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500"
          >
            <h1 className="text-4xl font-black mb-4">DIGITAL REALM</h1>
          </motion.div>
          
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-300 text-xl"
          >
            Initializing your creative universe...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0">
        {/* Morphing shapes */}
        {morphingShapes}
        
        {/* Particle system */}
        {particles}
        
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Music Control Button with Hand Pointer */}
      <motion.div 
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence>
          {showHandPointer && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: [1, 1.1, 1],
                rotate: [0, -10, 10, 0]
              }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ 
                scale: { duration: 1, repeat: Infinity },
                rotate: { duration: 0.5, repeat: Infinity }
              }}
              className="text-4xl"
            >
              👉
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={toggleMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-4 bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-lg rounded-full border border-white/10 hover:border-white/30 transition-all"
          animate={{
            boxShadow: musicPlaying 
              ? ["0 0 20px rgba(239, 68, 68, 0.5)", "0 0 30px rgba(147, 51, 234, 0.5)", "0 0 20px rgba(239, 68, 68, 0.5)"]
              : "0 0 0px transparent"
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {musicPlaying ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-500" />
          )}
          
          {musicPlaying && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute -inset-2 rounded-full border border-white/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                />
              ))}
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Header */}
        <motion.section 
          className="relative h-screen flex items-center justify-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8"
            >
              <motion.div
                className="inline-block mb-8"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateY: { duration: 8, repeat: Infinity },
                  scale: { duration: 3, repeat: Infinity }
                }}
              >
                <Crown className="w-24 h-24 text-yellow-400 mx-auto filter drop-shadow-2xl" />
              </motion.div>
              
              <motion.h1 
                className="text-8xl font-black mb-6 relative"
                style={{
                  background: "linear-gradient(45deg, #ff0000, #ff6b6b, #ffa500, #ff0000)",
                  backgroundSize: "300% 300%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent"
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                CREATIVE
                <motion.span
                  className="block"
                  animate={{ 
                    rotateX: [0, 360],
                  }}
                  transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                  style={{
                    background: "linear-gradient(45deg, #8b5cf6, #06b6d4, #8b5cf6)",
                    backgroundSize: "300% 300%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  FAREWELL
                </motion.span>
              </motion.h1>
              
              <motion.p
                className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Welcome back, <span className="text-red-400 font-bold">{user.name}</span>
                <br />
                <motion.span
                  animate={{ 
                    color: ["#rgb(156, 163, 175)", "#rgb(239, 68, 68)", "#rgb(156, 163, 175)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Master of Digital Departures
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Floating Stats */}
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-16"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {[
                { label: "Farewell Pages", value: userPages.length, icon: "📄", color: "red" },
                { label: "Total Impact", value: totalViews.toLocaleString(), icon: "👁️", color: "purple" },
                { label: "Member Since", value: formatDate(user.joinedAt), icon: "📅", color: "blue" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-white/10"
                    animate={{
                      background: [
                        "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(147, 51, 234, 0.1))",
                        "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                        "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(239, 68, 68, 0.1))"
                      ]
                    }}
                    transition={{ duration: 6, repeat: Infinity, delay: index * 0.5 }}
                  />
                  <div className="relative p-8 text-center">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: index * 0.7
                      }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.h3
                      className="text-4xl font-black text-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.2, type: "spring" }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-gray-300 text-lg">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-6 justify-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl font-black text-xl flex items-center gap-4 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <span className="relative z-10">Create New Exit</span>
                <Plus className="w-6 h-6 relative z-10" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, rotateZ: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignOut}
                className="px-8 py-6 border-2 border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                <LogOut className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white rounded-full mt-2"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Pages Section */}
        <motion.section 
          className="relative min-h-screen p-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-6xl font-black text-center mb-16"
              style={{
                background: "linear-gradient(45deg, #ffffff, #ff6b6b, #ffffff)",
                backgroundSize: "200% 200%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              YOUR DIGITAL LEGACY
            </motion.h2>

            {userPages.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="text-8xl mb-8"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🫥
                </motion.div>
                <h3 className="text-4xl font-bold text-gray-300 mb-4">The Void Awaits</h3>
                <p className="text-xl text-gray-500 mb-8">Your first masterpiece of goodbye is yet to be born...</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl font-bold text-lg"
                >
                  Birth Your First Exit
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {userPages.map((page, index) => (
                  <motion.div
                    key={page.slug}
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
                          {[
                            { icon: ExternalLink, color: "blue", action: () => {} },
                            { icon: Share2, color: "green", action: () => {} },
                            { icon: Trash2, color: "red", action: () => {} }
                          ].map((btn, i) => (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.2, rotateZ: 5 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-3 text-gray-400 hover:text-white transition-colors relative group"
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
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboard;