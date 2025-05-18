/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Zap, User, LogOut, Code, Palette, Share } from 'lucide-react';

// Custom cursor component
const CustomCursor = () => {
  const cursorRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePos = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    document.addEventListener('mousemove', updateMousePos);
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePos);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/pagebuilder');
  };

  const handleSignUp = async(userData) => {
    let res = await signUpUser(userData);
    if (!res){
      return
    }
    handleSwitchToSignIn();
  };

  const handleSignIn = async(userData) => {
    let res = await signInUser(userData);
    if (!res){
      return
    }
    setUser(res.user);
    localStorage.setItem('Active User', JSON.stringify(res));
    setShowSignIn(false);
    setShowDashboard(true);
  };

  const handleSignOut = () => {
    localStorage.clear();
    setUser(null);
    setShowDashboard(false);
  };

  const openDashboard = () => {
    setShowDashboard(true);
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const closeModals = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  // If dashboard is open, show it
  if (showDashboard) {
    const token = localStorage.getItem("token");
    return (
      <Dashboard 
        user={user} 
        token={token}
        onSignOut={handleSignOut}
        onClose={() => setShowDashboard(false)}
      />
    );
  }
  return (
    <motion.div
      className="fixed pointer-events-none z-50 mix-blend-difference"
      style={{
        left: mousePos.x,
        top: mousePos.y,
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        scale: isHovered ? 1.5 : 1,
        opacity: isHovered ? 0.8 : 1
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <div className="w-8 h-8 bg-white rounded-full border-2 border-purple-400" />
    </motion.div>
  );
};

// Enhanced floating particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.5 + 0.1
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.sin(particle.id) * 50],
            opacity: [particle.opacity, particle.opacity * 0.5, 0],
            scale: [1, 1.2, 0.8]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Tech-style feature card
const TechFeatureCard = ({ icon, title, description, delay, index }) => {
  const ref = useRef();
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay + index * 0.1, duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group interactive"
    >
      {/* Animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 h-full group-hover:border-purple-500/50 transition-all duration-300">
        <motion.div
          className="text-4xl mb-6 text-purple-400"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-slate-300 leading-relaxed">{description}</p>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300" />
      </div>
    </motion.div>
  );
};

// Stats counter component
const StatsCounter = ({ end, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-4xl font-bold text-white mb-2"
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {count.toLocaleString()}+
      </motion.div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
};

// Main landing page component
const LandingPage = ({
  user,
  onSignIn,
  onSignUp,
  onSignOut,
  onGetStarted,
  onOpenDashboard,
  showSignIn,
  setShowSignIn,
  showSignUp,
  setShowSignUp
}) => {
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 1000], [0, -300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const featuresY = useTransform(scrollY, [300, 1200], [100, -100]);
  const statsY = useTransform(scrollY, [500, 1500], [50, -50]);

  return (
    <div className="min-h-screen bg-slate-950 text-white cursor-none overflow-x-hidden">
      <CustomCursor />
      <FloatingParticles />
      
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
      
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 p-6 backdrop-blur-sm bg-slate-950/50 border-b border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="text-2xl font-bold text-white interactive"
            whileHover={{ scale: 1.05 }}
          >
            TheEnd<span className="text-purple-400">.page</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <motion.button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700/50 transition-all duration-300 interactive"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </motion.button>
                <motion.button
                  onClick={onSignOut}
                  className="p-3 text-slate-400 hover:text-white transition-colors interactive"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setShowSignIn(true)}
                  className="text-slate-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors interactive"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => setShowSignUp(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 interactive"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Now
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-20 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm font-medium text-purple-300">
                ✨ The Future of Digital Farewells
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              Make Your
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                EXIT
              </motion.span>
              Legendary
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Create personalized goodbye pages that are <span className="text-purple-400 font-semibold">dramatic</span>, <span className="text-pink-400 font-semibold">elegant</span>, or <span className="text-blue-400 font-semibold">perfectly petty</span>. 
              <br />
              <span className="text-white font-bold">Because every ending deserves a digital masterpiece.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={onGetStarted}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 interactive"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Create Your Exit
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                className="px-10 py-4 border border-slate-600 text-slate-300 rounded-lg text-lg font-semibold hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 interactive"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Examples
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        style={{ y: statsY }}
        className="relative z-20 py-20 border-y border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatsCounter end={10000} label="Farewells Created" />
            <StatsCounter end={50000} label="People Reached" />
            <StatsCounter end={8} label="Tone Options" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        style={{ y: featuresY }}
        className="relative z-20 py-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-purple-400">TheEnd.page</span>?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional, customizable, and shareable goodbye pages that leave a lasting impression.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <TechFeatureCard
              icon={<Code />}
              title="Lightning Fast"
              description="Create and publish your goodbye page in under 2 minutes with our intuitive builder."
              delay={0.2}
              index={0}
            />
            <TechFeatureCard
              icon={<Palette />}
              title="8 Unique Tones"
              description="From corporate professional to deliciously dramatic. Express yourself exactly how you want."
              delay={0.2}
              index={1}
            />
            <TechFeatureCard
              icon={<Share />}
              title="Share Anywhere"
              description="Get a beautiful link that works everywhere. Social media, email, or print it out."
              delay={0.2}
              index={2}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-20 py-32"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur border border-purple-500/30 rounded-3xl p-12"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make Your Exit?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands who've already created their digital farewells. 
              It's time to leave with style.
            </p>
            <motion.button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all duration-300 interactive"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 25px 50px rgba(147, 51, 234, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now - It's Free
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500">
          <p>&copy; 2024 TheEnd.page. All rights reserved.</p>
          <p className="mt-2">Making farewells memorable, one page at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;