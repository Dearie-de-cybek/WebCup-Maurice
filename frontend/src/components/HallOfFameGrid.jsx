import React from 'react';
import { motion } from 'framer-motion';
import HallOfFameCard from './HallOfFameCard';

const HallOfFameGrid = ({ pages }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      className="px-6 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top 3 - Special Layout */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-300 mb-8">
            The Legendary Top 3
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Second Place */}
            {pages[1] && (
              <motion.div
                className="md:mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <HallOfFameCard 
                  page={pages[1]} 
                  rank={2}
                  isTopThree={true}
                  size="medium"
                />
              </motion.div>
            )}

            {/* First Place - Center, larger */}
            {pages[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.8, type: "spring", stiffness: 100 }}
              >
                <HallOfFameCard 
                  page={pages[0]} 
                  rank={1}
                  isTopThree={true}
                  size="large"
                />
              </motion.div>
            )}

            {/* Third Place */}
            {pages[2] && (
              <motion.div
                className="md:mt-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <HallOfFameCard 
                  page={pages[2]} 
                  rank={3}
                  isTopThree={true}
                  size="medium"
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Rest of the pages */}
        {pages.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-300 mb-8">
              Rising Legends
            </h2>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {pages.slice(3).map((page, index) => (
                <motion.div
                  key={page.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.5 }
                    }
                  }}
                >
                  <HallOfFameCard 
                    page={page} 
                    rank={page.rank}
                    isTopThree={false}
                    size="small"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h3 className="text-xl text-gray-300 mb-6">
            Think your farewell deserves to be here?
          </h3>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl font-semibold text-black hover:from-amber-600 hover:to-yellow-600 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your Legacy
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HallOfFameGrid;