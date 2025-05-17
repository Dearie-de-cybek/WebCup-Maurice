/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThreeVotingUniverse from './components/ThreeVotingUniverse';
import HallOfFameConstellations from './components/HallOfFameConstellations';
import VotingInterface from './components/VotingInterface';
import ParticleEffects from './components/ParticleEffects';
import CosmicUI from './components/CosmicUI';

const VotingSystem = () => {
  const [pages, setPages] = useState([
    {
      id: 1,
      slug: "epic-goodbye",
      title: "The Most Epic Goodbye Ever Written",
      author: "DigitalPoet",
      tone: "dramatic",
      votes: 2847,
      views: 15420,
      createdAt: "2024-05-15",
      preview: "In this moment of digital departure...",
      position: { x: 0, y: 0, z: 0 },
      color: "#ff4444",
      size: 1.5,
      isHallOfFame: true,
      rank: 1
    },
    {
      id: 2,
      slug: "ironic-farewell", 
      title: "Bye Felicia: A Modern Classic",
      author: "SarcasmKing",
      tone: "ironic",
      votes: 1923,
      views: 9876,
      createdAt: "2024-05-10",
      preview: "Well, this is awkward...",
      position: { x: -5, y: 2, z: -3 },
      color: "#8b5cf6",
      size: 1.3,
      isHallOfFame: true,
      rank: 2
    },
    {
      id: 3,
      slug: "touching-message",
      title: "Until We Meet Again", 
      author: "HeartStrings",
      tone: "touching",
      votes: 1654,
      views: 8234,
      createdAt: "2024-05-08",
      preview: "Every ending is a new beginning...",
      position: { x: 5, y: -1, z: 2 },
      color: "#06b6d4",
      size: 1.2,
      isHallOfFame: true,
      rank: 3
    },
    {
      id: 4,
      slug: "absurd-exit",
      title: "I'm Becoming a Sentient Meme",
      author: "ChaosCreator", 
      tone: "absurd",
      votes: 1456,
      views: 7123,
      createdAt: "2024-05-05",
      preview: "Reality is optional...",
      position: { x: -3, y: -3, z: 4 },
      color: "#f59e0b",
      size: 1.1,
      isHallOfFame: false,
      rank: 4
    },
    {
      id: 5,
      slug: "professional-goodbye",
      title: "Corporate Farewell Excellence",
      author: "BusinessFormal",
      tone: "classy", 
      votes: 892,
      views: 4567,
      createdAt: "2024-05-01",
      preview: "As I transition to my next chapter...",
      position: { x: 2, y: 4, z: -2 },
      color: "#10b981",
      size: 1.0,
      isHallOfFame: false,
      rank: 5
    }
  ]);

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [voteEffect, setVoteEffect] = useState(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 10 });

  const handleVote = (pageId) => {
    if (userVotes[pageId]) return;

    // Trigger cosmic vote effect
    setVoteEffect(pageId);

    // Update votes and rankings
    setPages(prev => {
      const updated = prev.map(page => 
        page.id === pageId 
          ? { ...page, votes: page.votes + 1, size: Math.min(page.size + 0.1, 2.0) }
          : page
      ).sort((a, b) => b.votes - a.votes);

      // Update rankings and hall of fame status
      return updated.map((page, index) => ({
        ...page,
        rank: index + 1,
        isHallOfFame: index < 3
      }));
    });

    setUserVotes(prev => ({ ...prev, [pageId]: true }));

    // Clear effect after animation
    setTimeout(() => setVoteEffect(null), 3000);
  };

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    setCameraPosition({ 
      x: planet.position.x + 3, 
      y: planet.position.y + 2, 
      z: planet.position.z + 5 
    });
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* 3D Universe Background */}
      <ThreeVotingUniverse 
        pages={pages}
        selectedPlanet={selectedPlanet}
        onPlanetSelect={handlePlanetSelect}
        cameraPosition={cameraPosition}
        voteEffect={voteEffect}
      />

      {/* Particle Effects Overlay */}
      <ParticleEffects 
        voteEffect={voteEffect}
        selectedPlanet={selectedPlanet}
      />

      {/* Hall of Fame Constellations */}
      <HallOfFameConstellations 
        hallOfFamePages={pages.filter(p => p.isHallOfFame)}
      />

      {/* Cosmic UI Overlay */}
      <CosmicUI 
        selectedPlanet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
      />

      {/* Voting Interface */}
      <VotingInterface 
        pages={pages}
        userVotes={userVotes}
        onVote={handleVote}
        selectedPlanet={selectedPlanet}
      />
    </div>
  );
};

export default VotingSystem;