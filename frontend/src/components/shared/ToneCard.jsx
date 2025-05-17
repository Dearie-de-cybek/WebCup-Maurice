/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const ToneCard = ({ tone, isSelected, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative cursor-pointer rounded-xl overflow-hidden h-48 ${
      isSelected ? 'ring-4 ring-purple-500 shadow-lg' : 'shadow-md hover:shadow-xl'
    } transition-all duration-300`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${tone.color}`} />
    <div className={`relative p-6 h-full flex flex-col justify-between ${tone.textColor}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8">
          {React.cloneElement(tone.icon, { className: "w-full h-full" })}
        </div>
        <h3 className="text-xl font-bold">{tone.name}</h3>
      </div>
      
      <div>
        <p className="text-sm opacity-90 mb-2">{tone.description}</p>
        <p className="text-xs italic opacity-75">"{tone.example}"</p>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
        >
          <div className="w-3 h-3 bg-purple-500 rounded-full" />
        </motion.div>
      )}
    </div>
  </motion.div>
);

export default ToneCard;