import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

const AudioPlayer = ({ audioSrc, autoplay = false, className = '' }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    // Auto-play if specified
    if (autoplay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Auto-play blocked by browser
            console.log('Auto-play was blocked');
          });
      }
    }

    // Audio event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsLoading(false);
      console.error('Audio failed to load');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [autoplay, volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Playback failed:', error);
          });
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!audioSrc) return null;

  return (
    <motion.div
      className={`relative bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <audio ref={audioRef} src={audioSrc} />
      
      {/* Audio waves animation */}
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden pointer-events-none">
        {isPlaying && (
          <div className="flex items-center justify-center h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 mx-1 bg-gradient-to-t from-blue-500/30 to-purple-500/30 rounded-full"
                animate={{
                  height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 10,
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ height: '10px' }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          >
            <Music className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h4 className="text-white font-medium">Background Music</h4>
            <p className="text-gray-400 text-sm">
              {isLoading ? 'Loading...' : formatTime(duration)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-4">
          {/* Play/Pause button */}
          <motion.button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          {/* Time display */}
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Volume controls */}
          <div className="flex items-center gap-2 ml-auto">
            <motion.button
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Progress thumb */}
          <motion.div
            className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 pointer-events-none"
            style={{ left: `calc(${progress}% - 8px)` }}
            animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3, repeat: isPlaying ? Infinity : 0 }}
          />
        </div>

        {/* Equalizer visualization */}
        {isPlaying && (
          <motion.div
            className="mt-4 flex items-end justify-center gap-1 h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[...Array(32)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                animate={{
                  height: [4, Math.random() * 40 + 4, 4],
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
        }
        
        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
};

export default AudioPlayer;