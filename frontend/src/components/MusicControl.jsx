/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicControl = () => {
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [showHandPointer, setShowHandPointer] = useState(true);

  // Ensure refs are initialized as objects
  const audioContextRef = useRef(null);
  const musicSourceRef = useRef([]); // ✅ Initialized as array
  const gainNodeRef = useRef(null);

  useEffect(() => {
    initializeAmbientMusic();

    const timer = setTimeout(() => setShowHandPointer(false), 8000);
    return () => {
      clearTimeout(timer);
      // Clean up the audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAmbientMusic = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const createAmbientTone = (frequency, delay = 0) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filterNode = audioCtx.createBiquadFilter();

        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.type = 'sine';

        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + delay + 2);

        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(5, audioCtx.currentTime);

        oscillator.start(audioCtx.currentTime + delay);
        lfo.start(audioCtx.currentTime + delay);

        return { oscillator, gainNode, lfo };
      };

      // Chord tones
      const ambientTones = [
        createAmbientTone(220, 0),
        createAmbientTone(277, 1),
        createAmbientTone(330, 2),
        createAmbientTone(440, 3),
      ];

      musicSourceRef.current = ambientTones; // ✅ Safe now

      // Optional: Store master gain if needed later
      gainNodeRef.current = audioCtx.createGain();
      gainNodeRef.current.gain.setValueAtTime(musicPlaying ? 1 : 0, audioCtx.currentTime);
    } catch (error) {
      console.error('AudioContext initialization failed:', error);
    }
  };

  const toggleMusic = () => {
    const isPlaying = !musicPlaying;
    setMusicPlaying(isPlaying);

    if (musicSourceRef.current.length > 0) {
      musicSourceRef.current.forEach(({ gainNode }) => {
        if (gainNode) {
          gainNode.gain.linearRampToValueAtTime(
            isPlaying ? 0.02 : 0,
            audioContextRef.current.currentTime + 0.5
          );
        }
      });
    }
  };

  return (
    <motion.div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showHandPointer && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, scale: [1, 1.1, 1], rotate: [0, -10, 10, 0] }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ scale: { duration: 1, repeat: Infinity }, rotate: { duration: 0.5, repeat: Infinity } }}
            className="text-4xl"
          >
            👉
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMusic}
        className="relative p-4 bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-lg rounded-full border border-white/10 hover:border-white/30 transition-all"
      >
        {musicPlaying ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-500" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default MusicControl;
