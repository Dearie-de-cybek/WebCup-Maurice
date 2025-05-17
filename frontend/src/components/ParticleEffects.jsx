/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleEffects = ({ voteEffect, selectedPlanet }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    // Initialize background particles
    initializeBackgroundParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (voteEffect) {
      createVoteExplosion();
    }
  }, [voteEffect]);

  const initializeBackgroundParticles = () => {
    particlesRef.current = [];
    
    // Create ambient floating particles
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 180}, 70%, 70%)`,
        type: 'ambient',
        life: 1,
        maxLife: 1
      });
    }
  };

  const createVoteExplosion = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Create explosion particles
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50;
      const velocity = Math.random() * 10 + 5;
      const size = Math.random() * 8 + 4;
      
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: size,
        opacity: 1,
        color: `hsl(${Math.random() * 60 + 300}, 80%, 70%)`,
        type: 'explosion',
        life: 1,
        maxLife: 1,
        gravity: 0.1,
        friction: 0.98
      });
    }

    // Create heart particles
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 8 + 3;
      
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 15 + 10,
        opacity: 1,
        color: '#ff69b4',
        type: 'heart',
        life: 1,
        maxLife: 1,
        gravity: 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    // Create spiral particles
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.5;
      const radius = Math.random() * 3 + 1;
      
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        angle: angle,
        radius: radius,
        radiusSpeed: Math.random() * 2 + 1,
        angleSpeed: Math.random() * 0.1 + 0.05,
        size: Math.random() * 6 + 3,
        opacity: 1,
        color: `hsl(${Math.random() * 40 + 40}, 90%, 60%)`,
        type: 'spiral',
        life: 1,
        maxLife: 1
      });
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      updateParticle(particle);
      drawParticle(ctx, particle);
      return particle.life > 0;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const updateParticle = (particle) => {
    switch (particle.type) {
      case 'ambient':
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;
        
        // Breathing effect
        particle.opacity = 0.2 + Math.sin(Date.now() * 0.003 + particle.x * 0.01) * 0.3;
        break;

      case 'explosion':
        particle.vx *= particle.friction;
        particle.vy = (particle.vy + particle.gravity) * particle.friction;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.opacity = particle.life;
        particle.size *= 0.99;
        break;

      case 'heart':
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.life -= 0.015;
        particle.opacity = particle.life;
        break;

      case 'spiral':
        particle.angle += particle.angleSpeed;
        particle.radius += particle.radiusSpeed;
        particle.x = window.innerWidth / 2 + Math.cos(particle.angle) * particle.radius * 50;
        particle.y = window.innerHeight / 2 + Math.sin(particle.angle) * particle.radius * 50;
        particle.life -= 0.01;
        particle.opacity = particle.life;
        break;
    }
  };

  const drawParticle = (ctx, particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;

    if (particle.type === 'heart') {
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.font = `${particle.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = particle.color;
      ctx.fillText('❤️', 0, 0);
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      if (particle.type === 'explosion' || particle.type === 'spiral') {
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'transparent' }}
      />
      
      {/* Additional React-based particle effects */}
      <AnimatePresence>
        {voteEffect && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Ripple effect */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border-4 border-pink-500 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-2px',
                  marginTop: '-2px'
                }}
                initial={{ width: 4, height: 4, opacity: 1 }}
                animate={{
                  width: 400 + i * 100,
                  height: 400 + i * 100,
                  opacity: 0,
                  marginLeft: -200 - i * 50,
                  marginTop: -200 - i * 50
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Text explosion */}
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 2 }}
            >
              <div className="text-6xl font-black text-pink-500">
                +1 VOTE!
              </div>
            </motion.div>

            {/* Star burst */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute text-4xl"
                style={{
                  left: '50%',
                  top: '50%'
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0, 
                  rotate: 0 
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * 200,
                  y: Math.sin((i / 12) * Math.PI * 2) * 200,
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  ease: "easeOut"
                }}
              >
                ⭐
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planet selection effect */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Selection highlight */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${selectedPlanet.color}20 0%, transparent 70%)`
              }}
              animate={{
                background: [
                  `radial-gradient(circle at 50% 50%, ${selectedPlanet.color}20 0%, transparent 70%)`,
                  `radial-gradient(circle at 50% 50%, ${selectedPlanet.color}40 0%, transparent 70%)`,
                  `radial-gradient(circle at 50% 50%, ${selectedPlanet.color}20 0%, transparent 70%)`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Floating UI particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`ui-particle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: selectedPlanet.color,
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ParticleEffects;