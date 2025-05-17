/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation } from 'react-router-dom';
import { Eye, Share2, Heart, ArrowLeft } from 'lucide-react';

const PageViewer = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadPageData = () => {
      try {
        // Check if this is a preview (data passed in URL)
        const searchParams = new URLSearchParams(location.search);
        const previewData = searchParams.get('data');
        
        if (previewData) {
          setPageData(JSON.parse(decodeURIComponent(previewData)));
          setLoading(false);
          return;
        }

        // First try to get full data from sessionStorage (current session)
        const sessionData = sessionStorage.getItem(`theend_page_${slug}`);
        if (sessionData) {
          const page = JSON.parse(sessionData);
          setPageData(page);
          setViews(page.views || 0);
          setLoading(false);
          return;
        }

        // Fall back to localStorage Mike and Uche
        const pages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
        const page = pages[slug];
        
        if (page) {
          // Create a display-friendly version with placeholder content for missing media
          const displayData = {
            ...page,
            backgroundImage: page.backgroundImage?.hasImage ? {
              ...page.backgroundImage,
              url: '/api/placeholder/1920/1080', // Placeholder image
              placeholder: true
            } : null,
            music: page.music?.hasAudio ? {
              ...page.music,
              url: null, // Can't play audio from storage
              disabled: true
            } : page.music // Keep presets as they don't need actual files
          };
          
          setPageData(displayData);
          setViews(page.views || 0);
          
          // Increment view count
          page.views = (page.views || 0) + 1;
          pages[slug] = page;
          try {
            localStorage.setItem('theend_pages', JSON.stringify(pages));
            setViews(page.views);
          } catch (error) {
            console.log('Could not update view count:', error);
          }
        } else {
          setError('Page not found');
        }
      } catch (err) {
        setError('Error loading page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [slug, location.search]);

  useEffect(() => {
    // Auto-play music if enabled
    if (pageData?.autoplayMusic && pageData?.music && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Auto-play blocked by browser, that's okay
      });
    }
  }, [pageData]);

  const getToneStyles = (tone) => {
    const toneStyles = {
      dramatic: {
        background: 'linear-gradient(135deg, #1f1f1f 0%, #8b0000 100%)',
        textColor: '#ffffff',
        fontFamily: "'Playfair Display', serif",
        accent: '#ff4444',
        overlay: 'rgba(0,0,0,0.7)'
      },
      ironic: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
        textColor: '#2c3e50',
        fontFamily: "'Comic Sans MS', cursive",
        accent: '#f39c12',
        overlay: 'rgba(255,255,255,0.1)'
      },
      cringe: {
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        textColor: '#ffffff',
        fontFamily: "'Papyrus', fantasy",
        accent: '#e74c3c',
        overlay: 'rgba(255,255,255,0.1)'
      },
      classy: {
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        textColor: '#ecf0f1',
        fontFamily: "'Georgia', serif",
        accent: '#3498db',
        overlay: 'rgba(0,0,0,0.3)'
      },
      touching: {
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        textColor: '#8b4513',
        fontFamily: "'Dancing Script', cursive",
        accent: '#e74c3c',
        overlay: 'rgba(255,255,255,0.2)'
      },
      absurd: {
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        textColor: '#2c3e50',
        fontFamily: "'Courier New', monospace",
        accent: '#9b59b6',
        overlay: 'rgba(255,255,255,0.1)'
      },
      'passive-aggressive': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        fontFamily: "'Arial', sans-serif",
        accent: '#f39c12',
        overlay: 'rgba(0,0,0,0.2)'
      },
      honest: {
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        textColor: '#2c3e50',
        fontFamily: "'Helvetica', sans-serif",
        accent: '#27ae60',
        overlay: 'rgba(255,255,255,0.1)'
      }
    };
    
    return toneStyles[tone] || toneStyles.honest;
  };

  const getAnimationVariants = (style) => {
    const animations = {
      dramatic: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          transition: { duration: 1.5, ease: "easeOut" }
        }
      },
      subtle: {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1, 
          transition: { duration: 3 }
        }
      },
      bounce: {
        initial: { opacity: 0, y: -100 },
        animate: { 
          opacity: 1, 
          y: 0, 
          transition: { type: "spring", bounce: 0.5, duration: 1.2 }
        }
      },
      slide: {
        initial: { opacity: 0, x: -100 },
        animate: { 
          opacity: 1, 
          x: 0, 
          transition: { duration: 1 }
        }
      },
      default: {
        initial: { opacity: 0, y: 30 },
        animate: { 
          opacity: 1, 
          y: 0, 
          transition: { duration: 0.8 }
        }
      }
    };
    
    return animations[style] || animations.default;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageData.title,
          text: `Check out this goodbye page: ${pageData.title}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // In production, this would update the like count in the database
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading the page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const styles = getToneStyles(pageData.tone);
  const animation = getAnimationVariants(pageData.animationStyle);
  const finalTextColor = pageData.textColor || styles.textColor;

  const pageStyle = {
    background: pageData.backgroundImage 
      ? `url(${pageData.backgroundImage.url})`
      : styles.background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: finalTextColor,
    fontFamily: styles.fontFamily,
    minHeight: '100vh'
  };

  return (
    <>
      {/* Meta tags for social sharing */}
      <title>{pageData.title} - TheEnd.page</title>
      
      <div style={pageStyle} className="relative">
        {/* Background overlay */}
        {pageData.backgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ background: styles.overlay }}
          />
        )}

        {/* Navigation Bar */}
        <nav className="relative z-10 p-6 flex justify-between items-center bg-black bg-opacity-20">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
            style={{ color: finalTextColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TheEnd.page
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              title="Share this page"
            >
              <Share2 className="w-5 h-5" style={{ color: finalTextColor }} />
            </button>
            
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-all ${
                liked 
                  ? 'bg-red-500 bg-opacity-80' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
              title={liked ? 'Unlike' : 'Like this page'}
            >
              <Heart 
                className={`w-5 h-5 ${liked ? 'fill-current text-white' : ''}`}
                style={{ color: liked ? 'white' : finalTextColor }} 
              />
            </button>
            
            <div className="flex items-center gap-1 text-sm opacity-70" style={{ color: finalTextColor }}>
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={animation.initial}
            animate={animation.animate}
          >
            {/* Special effects based on tone */}
            <AnimatePresence>
              {pageData.tone === 'cringe' && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-4xl pointer-events-none"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        repeatDelay: 2
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </>
              )}

              {pageData.tone === 'dramatic' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{
                    background: 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)'
                  }}
                />
              )}

              {pageData.tone === 'touching' && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-3xl pointer-events-none"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                      }}
                    >
                      💝
                    </motion.div>
                  ))}
                </>
              )}

              {pageData.tone === 'absurd' && (
                <motion.div
                  className="absolute top-10 right-10 text-8xl pointer-events-none"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity
                  }}
                >
                  🦄
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8"
              style={{ color: finalTextColor }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {pageData.title}
            </motion.h1>
            
            {/* Main Message */}
            <motion.div 
              className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <p className="whitespace-pre-wrap">
                {pageData.mainMessage}
              </p>
            </motion.div>
            
            {/* Subtitle */}
            {pageData.subMessage && (
              <motion.p 
                className="text-sm md:text-base opacity-80 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                {pageData.subMessage}
              </motion.p>
            )}

            {/* Signature/Footer */}
            <motion.div
              className="mt-16 pt-8 border-t border-current border-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <p className="text-xs opacity-60">
                Created on {pageData.createdAt ? new Date(pageData.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
              <p className="text-xs opacity-40 mt-2">
                Made with TheEnd.page
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Music */}
        {pageData.music && (
          <audio
            ref={audioRef}
            loop
            style={{ display: 'none' }}
            src={pageData.music.url || undefined}
          />
        )}

        {/* Music Control */}
        {pageData.music && (
          <div className="fixed bottom-6 right-6 z-20">
            <button
              onClick={() => {
                if (audioRef.current) {
                  if (audioRef.current.paused) {
                    audioRef.current.play();
                  } else {
                    audioRef.current.pause();
                  }
                }
              }}
              className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
              title="Toggle music"
            >
              🎵
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PageViewer;