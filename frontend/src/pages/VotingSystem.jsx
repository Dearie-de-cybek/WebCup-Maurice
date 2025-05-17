import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import ProfessionalVotingInterface from './ProfessionalVotingInterface';
import ProfessionalThreeUniverse from '../components/ProfessionalThreeUniverse';
import ProfessionalModal from '../components/ProfessionalModal';
import ProfessionalConstellation from '../components/ProfessionalConstellation';

const VotingSystem = () => {
  const [pages, setPages] = useState([
    {
      id: 1,
      slug: "epic-goodbye",
      title: "The Digital Departure",
      author: "Alexandra Chen",
      tone: "dramatic",
      votes: 2847,
      views: 15420,
      createdAt: "2024-05-15",
      preview: "In this moment of digital departure, we find ourselves at the crossroads of memory and possibility",
      position: { x: 0, y: 0, z: 0 },
      color: "#ff6b6b",
      size: 1.5,
      isHallOfFame: true,
      rank: 1
    },
    {
      id: 2,
      slug: "modern-farewell", 
      title: "Echoes in the Void",
      author: "Marcus Rivera",
      tone: "ironic",
      votes: 1923,
      views: 9876,
      createdAt: "2024-05-10",
      preview: "Another day, another goodbye. But this one feels different somehow",
      position: { x: -6, y: 2, z: -3 },
      color: "#8b5cf6",
      size: 1.3,
      isHallOfFame: true,
      rank: 2
    },
    {
      id: 3,
      slug: "touching-message",
      title: "Until Tomorrow's Light", 
      author: "Sarah Kim",
      tone: "touching",
      votes: 1654,
      views: 8234,
      createdAt: "2024-05-08",
      preview: "Every ending carries within it the seed of something beautiful yet to come",
      position: { x: 6, y: -1, z: 2 },
      color: "#06b6d4",
      size: 1.2,
      isHallOfFame: true,
      rank: 3
    },
    {
      id: 4,
      slug: "abstract-exit",
      title: "The Space Between Words",
      author: "David Thompson", 
      tone: "absurd",
      votes: 1156,
      views: 6123,
      createdAt: "2024-05-05",
      preview: "Reality bends at the edges where language fails to capture truth",
      position: { x: -3, y: -3, z: 4 },
      color: "#f59e0b",
      size: 1.1,
      isHallOfFame: false,
      rank: 4
    },
    {
      id: 5,
      slug: "elegant-farewell",
      title: "A Graceful Conclusion",
      author: "Elena Rodriguez",
      tone: "classy", 
      votes: 892,
      views: 4567,
      createdAt: "2024-05-01",
      preview: "With profound gratitude for our shared journey, I bid you farewell",
      position: { x: 2, y: 4, z: -2 },
      color: "#10b981",
      size: 1.0,
      isHallOfFame: false,
      rank: 5
    },
    {
      id: 6,
      slug: "honest-words",
      title: "Raw & Unfiltered",
      author: "Jake Morrison",
      tone: "honest", 
      votes: 743,
      views: 3890,
      createdAt: "2024-04-28",
      preview: "No sugar-coating, no fancy words. Just the truth as I see it",
      position: { x: -2, y: 1, z: -4 },
      color: "#6366f1",
      size: 0.9,
      isHallOfFame: false,
      rank: 6
    }
  ]);

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [voteEffect, setVoteEffect] = useState(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 5, z: 20 });
  const [isLoading, setIsLoading] = useState(true);

  // Professional loading sequence
  useEffect(() => {
    // Simulate professional app initialization
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleVote = (pageId) => {
    if (userVotes[pageId]) return;

    // Trigger sophisticated vote effect
    setVoteEffect(pageId);

    // Update state with professional animations
    setPages(prev => {
      const updated = prev.map(page => 
        page.id === pageId 
          ? { 
              ...page, 
              votes: page.votes + 1, 
              size: Math.min(page.size + 0.05, 2.0) 
            }
          : page
      ).sort((a, b) => b.votes - a.votes);

      // Recalculate rankings and hall of fame status
      return updated.map((page, index) => ({
        ...page,
        rank: index + 1,
        isHallOfFame: index < 3
      }));
    });

    setUserVotes(prev => ({ ...prev, [pageId]: true }));

    // Clear effect after professional duration
    setTimeout(() => setVoteEffect(null), 2000);
  };

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    
    // Smooth camera transition to selected planet
    setCameraPosition({ 
      x: planet.position.x + 5, 
      y: planet.position.y + 3, 
      z: planet.position.z + 8 
    });
  };

  const handleModalClose = () => {
    setSelectedPlanet(null);
    // Return to overview position
    setCameraPosition({ x: 0, y: 5, z: 20 });
  };

  // Professional loading screen
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Elegant loader */}
          <motion.div
            className="w-32 h-32 border border-white/20 rounded-full mb-8 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            className="text-4xl font-light text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Cosmic <span className="font-medium">Voices</span>
          </motion.h1>
          
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Initializing universe...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full h-screen bg-black overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Professional 3D universe background */}
      <ProfessionalThreeUniverse 
        pages={pages}
        selectedPlanet={selectedPlanet}
        onPlanetSelect={handlePlanetSelect}
        cameraPosition={cameraPosition}
        voteEffect={voteEffect}
      />

      {/* Hall of Fame constellation */}
      <ProfessionalConstellation 
        hallOfFamePages={pages.filter(p => p.isHallOfFame)}
      />

      {/* Main voting interface */}
      <ProfessionalVotingInterface 
        pages={pages}
        userVotes={userVotes}
        onVote={handleVote}
        selectedPlanet={selectedPlanet}
      />

      {/* Professional modal for planet details */}
      <ProfessionalModal 
        selectedPlanet={selectedPlanet}
        onClose={handleModalClose}
      />

      {/* Sophisticated overlay effects */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Professional cursor followers */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
          y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="w-full h-full bg-white rounded-full opacity-60" />
      </motion.div>
    </motion.div>
  );
};

export default VotingSystem;