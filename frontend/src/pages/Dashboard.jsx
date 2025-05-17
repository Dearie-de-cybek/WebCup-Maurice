/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut,
  Plus
} from 'lucide-react';

// import LoadingScreen from './components/LoadingScreen';
import BackgroundEffects from '../components/BackgroundEffects';
import MusicControl from '../components/MusicControl';
import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import PagesSection from '../components/PagesSection';

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

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <BackgroundEffects />
      <MusicControl />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <HeroSection 
          user={user} 
          onSignOut={onSignOut}
        />
        
        <StatsCards 
          userPages={userPages}
          totalViews={totalViews}
          user={user}
          formatDate={formatDate}
        />
        
        <PagesSection 
          userPages={userPages}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

// Loading Screen Component
const LoadingScreen = () => (
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

export default Dashboard;