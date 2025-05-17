/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Zap, Coffee, Skull, Smile, Building, MessageCircle } from 'lucide-react';
import ToneCard from './shared/ToneCard';

const ToneSelector = ({ selectedTone, setSelectedTone, pageData, setPageData, onNext }) => {
  const tones = [
    {
      id: 'dramatic',
      name: 'Dramatic',
      icon: <Skull />,
      description: 'Dark, intense, unforgettable',
      color: 'from-gray-800 to-red-900',
      textColor: 'text-white',
      example: '"The curtain falls on this chapter..."'
    },
    {
      id: 'ironic',
      name: 'Ironic',
      icon: <Smile />,
      description: 'Witty, clever, with a twist',
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-gray-900',
      example: '"Thanks for all the pizza parties!"'
    },
    {
      id: 'cringe',
      name: 'Super Cringe',
      icon: <Sparkles />,
      description: 'Deliberately over-the-top',
      color: 'from-pink-500 to-purple-600',
      textColor: 'text-white',
      example: '"YOLO! Time to live my best life! ✨"'
    },
    {
      id: 'classy',
      name: 'Classy',
      icon: <Building />,
      description: 'Elegant, professional, refined',
      color: 'from-gray-900 to-gray-700',
      textColor: 'text-white',
      example: '"It has been my privilege to serve..."'
    },
    {
      id: 'touching',
      name: 'Touching',
      icon: <Heart />,
      description: 'Emotional, heartfelt, sincere',
      color: 'from-rose-400 to-pink-400',
      textColor: 'text-white',
      example: '"Thank you for the memories we\'ve shared..."'
    },
    {
      id: 'absurd',
      name: 'Absurd',
      icon: <Zap />,
      description: 'Random, weird, unexpected',
      color: 'from-green-400 to-blue-500',
      textColor: 'text-white',
      example: '"The purple elephant has left the building"'
    },
    {
      id: 'passive-aggressive',
      name: 'Passive-Aggressive',
      icon: <Coffee />,
      description: 'Subtly sarcastic corporate vibes',
      color: 'from-blue-600 to-blue-800',
      textColor: 'text-white',
      example: '"Hope you find someone who actually cares"'
    },
    {
      id: 'honest',
      name: 'Honest',
      icon: <MessageCircle />,
      description: 'Straightforward, no-nonsense',
      color: 'from-gray-500 to-gray-600',
      textColor: 'text-white',
      example: '"This job wasn\'t a good fit. Moving on."'
    }
  ];

  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
    setPageData({ ...pageData, tone: tone.id });
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tones.map((tone, index) => (
          <ToneCard
            key={tone.id}
            tone={tone}
            isSelected={selectedTone?.id === tone.id}
            onClick={() => handleToneSelect(tone)}
            delay={index * 0.1}
          />
        ))}
      </div>
      
      {selectedTone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Perfect! Your goodbye will have a <strong>{selectedTone.name}</strong> tone.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold inline-flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ToneSelector;