/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import HallOfFameHeader from '../components/HallOfFameHeader';
import HallOfFameGrid from '../components/HallOfFameGrid';
import BackgroundEffects from '../components/BackgroundEffects';

// Mock data for demonstration Uche and Mikey do ur stuf here
const hallOfFamePages = [
  {
    id: 1,
    slug: "epic-farewell",
    title: "The Most Epic Digital Goodbye Ever Written",
    author: "Sarah Chen",
    tone: "dramatic",
    votes: 2847,
    views: 15420,
    createdAt: "2024-05-15",
    preview: "In this moment of digital departure, we find ourselves at the crossroads of memory and possibility...",
    rank: 1
  },
  {
    id: 2,
    slug: "ironic-masterpiece",
    title: "Bye Felicia: A Modern Classic",
    author: "Marcus Rivera",
    tone: "ironic",
    votes: 1923,
    views: 9876,
    createdAt: "2024-05-10",
    preview: "Well, this is awkward. I guess this is where I'm supposed to say something profound...",
    rank: 2
  },
  {
    id: 3,
    slug: "touching-goodbye",
    title: "Until We Meet Again in the Cloud",
    author: "Emily Johnson",
    tone: "touching",
    votes: 1654,
    views: 8234,
    createdAt: "2024-05-08",
    preview: "Every ending is a new beginning, and every goodbye carries within it the promise of hello...",
    rank: 3
  },
  {
    id: 4,
    slug: "classy-exit",
    title: "A Gentleman's Digital Farewell",
    author: "David Thompson",
    tone: "classy",
    votes: 1456,
    views: 7123,
    createdAt: "2024-05-05",
    preview: "With the utmost respect and gratitude for our shared digital journey...",
    rank: 4
  },
  {
    id: 5,
    slug: "honest-words",
    title: "No Sugarcoating: The Raw Truth",
    author: "Alex Morgan",
    tone: "honest",
    votes: 1234,
    views: 6234,
    createdAt: "2024-05-03",
    preview: "I'm not going to pretend this isn't weird. Social media farewells are awkward...",
    rank: 5
  }
];

const HallOfFame = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BackgroundEffects />
      
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HallOfFameHeader totalPages={hallOfFamePages.length} />
        <HallOfFameGrid pages={hallOfFamePages} />
      </motion.div>
    </div>
  );
};

export default HallOfFame;