/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const LivePreview = ({ pageData }) => {
  const audioRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideShowPlaying, setIsSlideShowPlaying] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    if (pageData.images && pageData.images.length > 1 && (isSlideShowPlaying || pageData.slideshowAutoplay)) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === pageData.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [pageData.images, isSlideShowPlaying, pageData.slideshowAutoplay]);

  const getToneStyles = (tone) => {
    const toneStyles = {
      dramatic: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #1f1f1f 0%, #8b0000 100%)',
        textColor: pageData.textColor || '#ffffff',
        fontFamily: pageData.fontFamily || "'Playfair Display', serif",
        accent: '#ff4444'
      },
      ironic: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
        textColor: pageData.textColor || '#2c3e50',
        fontFamily: pageData.fontFamily || "'Comic Sans MS', cursive",
        accent: '#f39c12'
      },
      cringe: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        textColor: pageData.textColor || '#ffffff',
        fontFamily: pageData.fontFamily || "'Papyrus', fantasy",
        accent: '#e74c3c'
      },
      classy: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        textColor: pageData.textColor || '#ecf0f1',
        fontFamily: pageData.fontFamily || "'Georgia', serif",
        accent: '#3498db'
      },
      touching: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        textColor: pageData.textColor || '#8b4513',
        fontFamily: pageData.fontFamily || "'Dancing Script', cursive",
        accent: '#e74c3c'
      },
      absurd: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        textColor: pageData.textColor || '#2c3e50',
        fontFamily: pageData.fontFamily || "'Courier New', monospace",
        accent: '#9b59b6'
      },
      'passive-aggressive': {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: pageData.textColor || '#ffffff',
        fontFamily: pageData.fontFamily || "'Arial', sans-serif",
        accent: '#f39c12'
      },
      honest: {
        background: pageData.backgroundColor || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        textColor: pageData.textColor || '#2c3e50',
        fontFamily: pageData.fontFamily || "'Helvetica', sans-serif",
        accent: '#27ae60'
      }
    };
    
    return toneStyles[tone] || toneStyles.honest;
  };

  const getAnimationVariants = (style) => {
    const animations = {
      dramatic: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" }}
      },
      subtle: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 2 }}
      },
      bounce: {
        initial: { opacity: 0, y: -100 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5 }}
      },
      slide: {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.8 }}
      },
      default: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 }}
      }
    };
    
    return animations[style] || animations.default;
  };

  const styles = getToneStyles(pageData.tone);
  const animation = getAnimationVariants(pageData.animationStyle);
  const finalTextColor = pageData.textColor || styles.textColor;
  const finalFontFamily = pageData.fontFamily || styles.fontFamily;

  // Handle text size
  const getTextSizeClass = (size) => {
    const sizeMap = {
      'text-sm': 'text-sm',
      'text-base': 'text-base',
      'text-lg': 'text-lg',
      'text-xl': 'text-xl',
      'text-2xl': 'text-2xl'
    };
    return sizeMap[size] || 'text-base';
  };

  useEffect(() => {
    if (pageData.music && audioRef.current) {
      if (pageData.music.url && !pageData.music.preset) {
        audioRef.current.src = pageData.music.url;
      }
    }
  }, [pageData.music]);

  const previewStyle = {
    background: pageData.backgroundColor || styles.background,
    color: finalTextColor,
    fontFamily: finalFontFamily,
    minHeight: '400px'
  };

  const textSizeClass = getTextSizeClass(pageData.textSize);

  const nextImage = () => {
    if (pageData.images && pageData.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === pageData.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (pageData.images && pageData.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? pageData.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-900">Live Preview</h3>
      
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <motion.div
          style={previewStyle}
          className="p-8 relative"
          initial={animation.initial}
          animate={animation.animate}
          key={`${pageData.tone}-${pageData.animationStyle}-${pageData.backgroundColor}`}
        >
          {/* Background image slideshow */}
          {pageData.images && pageData.images.length > 0 && (
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={pageData.images[currentImageIndex].url}
                  alt="Background"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
              {/* Slideshow controls */}
              {pageData.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                  <button
                    onClick={prevImage}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-2">
                    {pageData.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setIsSlideShowPlaying(!isSlideShowPlaying)}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    {isSlideShowPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Background overlay based on tone */}
          <div className="absolute inset-0 opacity-10">
            {pageData.tone === 'dramatic' && (
              <div className="absolute inset-0 bg-black opacity-30" />
            )}
            {pageData.tone === 'cringe' && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-300 opacity-70"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.h1 
              className={`font-bold mb-6 ${
                pageData.textSize === 'text-sm' ? 'text-xl md:text-2xl' :
                pageData.textSize === 'text-base' ? 'text-2xl md:text-3xl' :
                pageData.textSize === 'text-lg' ? 'text-3xl md:text-4xl' :
                pageData.textSize === 'text-xl' ? 'text-4xl md:text-5xl' :
                pageData.textSize === 'text-2xl' ? 'text-5xl md:text-6xl' :
                'text-3xl md:text-4xl'
              }`}
              style={{ color: finalTextColor, fontFamily: finalFontFamily }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {pageData.title || 'Your Exit Title'}
            </motion.h1>
            
            <motion.div 
              className={`mb-4 leading-relaxed max-w-lg mx-auto ${textSizeClass}`}
              style={{ color: finalTextColor, fontFamily: finalFontFamily }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {pageData.mainMessage ? (
                <p className="whitespace-pre-wrap">
                  {pageData.mainMessage}
                </p>
              ) : (
                <p className="text-opacity-70">
                  Your goodbye message will appear here...
                </p>
              )}
            </motion.div>
            
            {pageData.subMessage && (
              <motion.p 
                className={`opacity-80 italic ${pageData.textSize === 'text-sm' ? 'text-xs' : 'text-sm'}`}
                style={{ color: finalTextColor, fontFamily: finalFontFamily }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {pageData.subMessage}
              </motion.p>
            )}

            {/* Tone-specific elements */}
            {pageData.tone === 'dramatic' && (
              <motion.div
                className="absolute bottom-4 right-4 text-6xl opacity-20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎭
              </motion.div>
            )}

            {pageData.tone === 'absurd' && (
              <motion.div
                className="absolute top-4 left-4 text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                🦄
              </motion.div>
            )}

            {pageData.tone === 'touching' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${20 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    💙
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Music indicator */}
          {pageData.music && (
            <div className="absolute top-4 right-4">
              <motion.div
                className="flex items-center gap-2 bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                🎵
                <span className="text-xs text-white">
                  {pageData.music.name || 'Background music'}
                </span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Audio element for uploaded music */}
      {pageData.music && pageData.music.url && !pageData.music.preset && (
        <audio
          ref={audioRef}
          controls
          className="w-full mt-4"
          style={{ maxHeight: '40px' }}
        >
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Preview info */}
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>
          <strong>Tone:</strong> {pageData.tone ? pageData.tone.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'None selected'}
        </p>
        <p>
          <strong>Background:</strong> {pageData.backgroundColor ? 'Custom color' : 'Default gradient'}
        </p>
        <p>
          <strong>Font:</strong> {pageData.fontFamily ? pageData.fontFamily.split(',')[0].replace(/['"]/g, '') : 'Default'}
        </p>
        <p>
          <strong>Text Size:</strong> {pageData.textSize ? pageData.textSize.replace('text-', '').toUpperCase() : 'Medium'}
        </p>
        {pageData.images && pageData.images.length > 0 && (
          <p>
            <strong>Images:</strong> {pageData.images.length} image{pageData.images.length > 1 ? 's' : ''} (slideshow)
          </p>
        )}
        {pageData.music && (
          <p>
            <strong>Music:</strong> {pageData.music.name || 'Selected'}
          </p>
        )}
      </div>
    </div>
  );
};

export default LivePreview;