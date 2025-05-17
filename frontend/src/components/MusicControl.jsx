/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicControl = () => {
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [showHandPointer, setShowHandPointer] = useState(true);
  
  const audioContextRef = useRef(null);
  const musicSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    initializeAmbientMusic();
    setTimeout(() => setShowHandPointer(false), 8000); // Hide hand after 8 seconds
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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

  return (
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
  );
};

export default MusicControl;