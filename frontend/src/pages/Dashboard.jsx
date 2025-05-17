import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogOut, Plus } from "lucide-react";

// import LoadingScreen from './components/LoadingScreen';
import BackgroundEffects from "../components/BackgroundEffects";
import MusicControl from "../components/MusicControl";
import HeroSection from "../components/HeroSection";
import StatsCards from "../components/StatsCards";
import PagesSection from "../components/PagesSection";

const Dashboard = ({
  user = { name: "Creative Soul", joinedAt: "2024-01-01" },
  onSignOut = () => {},
}) => {
  const [userPages, setUserPages] = useState([
    {
      slug: "dramatic-exit",
      title: "My Dramatic Exit",
      tone: "dramatic",
      createdAt: "2024-05-15",
      views: 1247,
    },
    {
      slug: "ironic-goodbye",
      title: "Ironic Farewell",
      tone: "ironic",
      createdAt: "2024-05-10",
      views: 856,
    },
    {
      slug: "touching-message",
      title: "A Touch of Goodbye",
      tone: "touching",
      createdAt: "2024-05-08",
      views: 2103,
    },
  ]);
  const [totalViews, setTotalViews] = useState(4206);
  const [loading, setLoading] = useState(true);

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
        <HeroSection user={user} onSignOut={onSignOut} />

        <StatsCards
          userPages={userPages}
          totalViews={totalViews}
          user={user}
          formatDate={formatDate}
        />

        {/* Navigation Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-5xl font-black text-center mb-12"
              style={{
                background: "linear-gradient(45deg, #ffffff, #ff6b6b, #ffffff)",
                backgroundSize: "200% 200%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              EXPLORE THE UNIVERSE
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Voting System Card */}
              <motion.div
                className="group cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="relative bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 overflow-hidden"
                  animate={{
                    borderColor: ["#3b82f6", "#8b5cf6", "#3b82f6"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />

                  {/* Floating elements */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        className="text-6xl"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          rotate: { duration: 8, repeat: Infinity },
                          scale: { duration: 3, repeat: Infinity },
                        }}
                      >
                        🌌
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-black text-white group-hover:text-blue-300 transition-colors">
                          Cosmic Voting Universe
                        </h3>
                        <p className="text-blue-300 text-lg">
                          Vote for the most legendary farewells
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      Journey through a 3D galaxy where each farewell page is a
                      planet. Cast your votes to elevate the best to immortal
                      Hall of Fame status!
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <span className="text-2xl">⭐</span>
                        <span className="font-bold">Hall of Fame</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="text-2xl">❤️</span>
                        <span className="font-bold">Live Voting</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400">
                        <span className="text-2xl">🚀</span>
                        <span className="font-bold">3D Experience</span>
                      </div>
                    </div>

                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a href="/halloffame">
                        <span>Enter the Cosmos</span>
                      </a>

                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🚀
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Page Builder Card */}
              <motion.div
                className="group cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="relative bg-gradient-to-r from-red-900/40 to-orange-900/40 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 overflow-hidden"
                  animate={{
                    borderColor: ["#ef4444", "#f97316", "#ef4444"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 80% 20%, #ef4444 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 20%, #ef4444 0%, transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />

                  {/* Floating elements */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.7,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        className="text-6xl"
                        animate={{
                          rotate: [0, -360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          rotate: { duration: 8, repeat: Infinity },
                          scale: { duration: 3, repeat: Infinity },
                        }}
                      >
                        ✍️
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-black text-white group-hover:text-red-300 transition-colors">
                          Create Your Masterpiece
                        </h3>
                        <p className="text-red-300 text-lg">
                          Craft the perfect digital farewell
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      Design your own epic farewell page with our advanced
                      builder. Choose from dramatic to ironic tones and create
                      something truly memorable!
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="text-2xl">🎭</span>
                        <span className="font-bold">8 Tones</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-400">
                        <span className="text-2xl">🎨</span>
                        <span className="font-bold">Custom Design</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400">
                        <span className="text-2xl">📱</span>
                        <span className="font-bold">Share Anywhere</span>
                      </div>
                    </div>

                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Start Creating</span>
                      <motion.span
                        animate={{ rotate: [0, 90, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <PagesSection userPages={userPages} formatDate={formatDate} />
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
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity },
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
            "linear-gradient(90deg, #06b6d4, #ef4444)",
          ],
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
