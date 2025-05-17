import React from 'react';
import { motion } from 'framer-motion';

const ToneBasedBackgroundEffects = ({ tone = 'default' }) => {
  // Different background effects based on tone
  const getEffectsForTone = () => {
    switch (tone) {
      case 'dramatic':
        return <DramaticEffects />;
      case 'ironic':
        return <IronicEffects />;
      case 'cringe':
        return <CringeEffects />;
      case 'classy':
        return <ClassyEffects />;
      case 'touching':
        return <TouchingEffects />;
      case 'absurd':
        return <AbsurdEffects />;
      case 'passive-aggressive':
        return <PassiveAggressiveEffects />;
      case 'honest':
        return <HonestEffects />;
      default:
        return <DefaultEffects />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {getEffectsForTone()}
    </div>
  );
};

// Dramatic - Dark, intense, smoky effects
const DramaticEffects = () => (
  <>
    {/* Smoky dark shapes */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute opacity-30"
        style={{
          left: `${20 + i * 20}%`,
          top: `${10 + i * 15}%`,
          width: `${200 + i * 100}px`,
          height: `${200 + i * 100}px`,
          background: `radial-gradient(circle, rgba(139, 0, 0, 0.4), rgba(0, 0, 0, 0.8))`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
    
    {/* Dark particles */}
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-red-900/60 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -200, 0],
          opacity: [0, 0.8, 0],
          scale: [0, 1.5, 0],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 6,
        }}
      />
    ))}
    
    {/* Gradient overlay */}
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "radial-gradient(circle at 30% 30%, rgba(139, 0, 0, 0.2) 0%, transparent 70%)",
          "radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
          "radial-gradient(circle at 30% 30%, rgba(139, 0, 0, 0.2) 0%, transparent 70%)"
        ]
      }}
      transition={{ duration: 12, repeat: Infinity }}
    />
  </>
);

// Ironic - Bright, playful, colorful effects
const IronicEffects = () => (
  <>
    {/* Colorful bouncing shapes */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${10 + i * 18}%`,
          top: `${20 + (i % 2) * 40}%`,
          width: `${80 + i * 30}px`,
          height: `${80 + i * 30}px`,
          background: `linear-gradient(45deg, 
            hsl(${60 + i * 60}, 80%, 70%), 
            hsl(${120 + i * 60}, 80%, 60%))`,
          borderRadius: `${30 + i * 10}% ${70 - i * 5}% ${50 + i * 5}% ${30 + i * 10}%`,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.4, 1],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
    
    {/* Rainbow particles */}
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${4 + Math.random() * 8}px`,
          height: `${4 + Math.random() * 8}px`,
          background: `hsl(${Math.random() * 360}, 70%, 60%)`,
        }}
        animate={{
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </>
);

// Cringe - Sparkly, over-the-top effects
const CringeEffects = () => (
  <>
    {/* Giant sparkles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-6xl"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          color: `hsl(${300 + Math.random() * 60}, 100%, 80%)`,
        }}
        animate={{
          scale: [0, 1.5, 0],
          rotate: [0, 720],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      >
        ✨
      </motion.div>
    ))}
    
    {/* Heart explosion */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-4xl"
        style={{
          left: '50%',
          top: '50%',
          color: '#ff69b4',
        }}
        animate={{
          x: [0, Math.cos(i * 30 * Math.PI / 180) * 300],
          y: [0, Math.sin(i * 30 * Math.PI / 180) * 300],
          scale: [0, 1, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      >
        💖
      </motion.div>
    ))}
    
    {/* Rainbow waves */}
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "linear-gradient(45deg, rgba(255, 105, 180, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
          "linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
          "linear-gradient(45deg, rgba(255, 105, 180, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)"
        ]
      }}
      transition={{ duration: 8, repeat: Infinity }}
    />
  </>
);

// Classy - Elegant, subtle, refined effects
const ClassyEffects = () => (
  <>
    {/* Elegant geometric shapes */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute border-2 border-white/10"
        style={{
          left: `${30 + i * 20}%`,
          top: `${20 + i * 25}%`,
          width: `${150 + i * 50}px`,
          height: `${150 + i * 50}px`,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15 + i * 5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
    
    {/* Subtle floating orbs */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-gray-400/20 to-slate-500/20"
        style={{
          left: `${20 + i * 15}%`,
          top: `${30 + (i % 2) * 40}%`,
          width: `${60 + i * 20}px`,
          height: `${60 + i * 20}px`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
  </>
);

// Touching - Warm, gentle, heart-like effects
const TouchingEffects = () => (
  <>
    {/* Floating hearts */}
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-3xl"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          color: `rgba(251, 191, 36, ${0.3 + Math.random() * 0.4})`,
        }}
        animate={{
          y: [0, -100, 0],
          scale: [0.5, 1, 0.5],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 6,
        }}
      >
        💝
      </motion.div>
    ))}
    
    {/* Warm gradient waves */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute opacity-20"
        style={{
          left: `${i * 30}%`,
          top: `${i * 20}%`,
          width: `${300 + i * 100}px`,
          height: `${300 + i * 100}px`,
          background: `radial-gradient(circle, rgba(251, 191, 36, 0.3), rgba(245, 101, 101, 0.2))`,
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
  </>
);

// Absurd - Random, weird, chaotic effects
const AbsurdEffects = () => {
  const emojis = ['🦄', '🌈', '🍕', '🎪', '🎭', '🎨', '🚀', '🌟'];
  
  return (
    <>
      {/* Random flying emojis */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 400 - 200],
            y: [0, Math.random() * 400 - 200],
            rotate: [0, Math.random() * 720 - 360],
            scale: [0, Math.random() * 2 + 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
      
      {/* Crazy shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`,
            background: `linear-gradient(${Math.random() * 360}deg, 
              hsl(${Math.random() * 360}, 80%, 60%), 
              hsl(${Math.random() * 360}, 80%, 60%))`,
            borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`,
          }}
          animate={{
            rotate: [0, Math.random() * 720 - 360],
            scale: [1, Math.random() * 2 + 0.5, 1],
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
          }}
          transition={{
            duration: Math.random() * 6 + 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

// Passive Aggressive - Corporate, cold, systematic effects
const PassiveAggressiveEffects = () => (
  <>
    {/* Corporate grid lines */}
    <div className="absolute inset-0">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute bg-blue-500/10"
          style={{
            left: `${i * 10}%`,
            top: 0,
            width: '1px',
            height: '100%',
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute bg-blue-500/10"
          style={{
            top: `${i * 10}%`,
            left: 0,
            height: '1px',
            width: '100%',
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
    
    {/* Office-like floating rectangles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-gray-600/20 border border-blue-500/30"
        style={{
          left: `${20 + i * 10}%`,
          top: `${10 + (i % 3) * 30}%`,
          width: `${100 + i * 20}px`,
          height: `${60 + i * 15}px`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 8 + i,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
  </>
);

// Honest - Simple, clean, minimal effects
const HonestEffects = () => (
  <>
    {/* Simple floating dots */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-gray-400/40 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -50, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 6,
        }}
      />
    ))}
    
    {/* Clean lines */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
        style={{
          left: 0,
          top: `${30 + i * 20}%`,
          width: '100%',
          height: '1px',
        }}
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: i * 2,
        }}
      />
    ))}
  </>
);

// Default effects (for no tone selected)
const DefaultEffects = () => (
  <>
    {/* Generic morphing shapes */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute opacity-20"
        style={{
          left: `${20 + i * 20}%`,
          top: `${10 + i * 15}%`,
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
          rotate: [0, 360],
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
    ))}
  </>
);

export default ToneBasedBackgroundEffects;