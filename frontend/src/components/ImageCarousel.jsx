import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';

const ImageCarousel = ({ images = [], autoplay = false, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!images || images.length === 0) return null;

  // Grid layout for multiple images
  if (images.length === 1) {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-2xl ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src={images[0].url}
          alt="Gallery image"
          className="w-full h-full object-cover cursor-pointer"
          onClick={openModal}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {isModalOpen && <ImageModal image={images[0]} onClose={closeModal} />}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className={`relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main image */}
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].url}
              alt={`Slide ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={openModal}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                onClick={goToPrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                onClick={goToNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* Play/Pause button */}
          {images.length > 1 && (
            <motion.button
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              onClick={togglePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <motion.div
            className="flex gap-2 p-4 overflow-x-auto scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white shadow-lg'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    layoutId="activeThumb"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Progress indicators */}
        {images.length > 1 && isPlaying && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              key={currentIndex}
            />
          </div>
        )}
      </motion.div>

      {/* Modal for full-screen view */}
      {isModalOpen && (
        <ImageModal 
          image={images[currentIndex]} 
          onClose={closeModal}
          onNext={images.length > 1 ? goToNext : undefined}
          onPrev={images.length > 1 ? goToPrev : undefined}
          totalImages={images.length}
          currentIndex={currentIndex}
        />
      )}
    </>
  );
};

// Full-screen modal component
const ImageModal = ({ image, onClose, onNext, onPrev, totalImages, currentIndex }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-7xl max-h-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Navigation arrows */}
        {onPrev && (
          <motion.button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            onClick={onPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>
        )}

        {onNext && (
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        )}

        {/* Image */}
        <motion.img
          src={image.url}
          alt="Full screen view"
          className="max-w-full max-h-full object-contain rounded-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Image info */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
            {currentIndex + 1} of {totalImages}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImageCarousel;