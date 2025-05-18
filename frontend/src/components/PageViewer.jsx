import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Eye } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getPageBySlug, addVoteToPage } from "../services/pages";

import ToneBasedBackgroundEffects from "./ToneBasedBackgroundEffects";
import AudioPlayer from "./AudioPlayer";
import ImageCarousel from "./ImageCarousel";
import GlassmorphicCard from "./GlassmorphicCard";
import VotingButton from "./VotingButton";

const PageViewer = ({ slug: propSlug = null, previewData = null }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get slug from URL params or props
  const slug = propSlug || params.slug;

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const loadPageData = async () => {
      if (!slug) {
        setError("No page identifier provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if this is a preview with data passed in URL search params
        const searchParams = new URLSearchParams(location.search);
        const previewDataParam = searchParams.get("data");

        if (previewDataParam) {
          const decoded = JSON.parse(decodeURIComponent(previewDataParam));
          setPageData(decoded);
          setViews(decoded.views || 0);
          setLoading(false);
          return;
        }

        // If previewData is passed as prop (preview mode)
        if (previewData) {
          setPageData(previewData);
          setViews(previewData.views || 0);
          setLoading(false);
          return;
        }

        // Fetch page data from API
        const response = await getPageBySlug(slug);

        // The response might be nested (e.g., response.data or response.page)
        // Adjust this based on your actual API response structure
        const page = response.data || response.page || response;

        if (page) {
          setPageData(page);
          setViews(page.views || 0);

          // Optionally increment view count locally for UI feedback
          // You might want to call an API endpoint to track views server-side
          try {
            // Update local view count immediately for better UX
            setViews((prev) => prev + 1);

            // You could add an API call here to increment views on the server
            // await incrementPageViews(slug);
          } catch (viewError) {
            console.log("Could not update view count:", viewError);
          }
        } else {
          setError(
            "Page not found. This page may not exist or may have been removed."
          );
        }
      } catch (err) {
        console.error("Error loading page:", err);

        // Handle different types of errors
        if (err.response) {
          // Server responded with an error status
          if (err.response.status === 404) {
            setError(
              "Page not found. This page may not exist or may have been removed."
            );
          } else if (err.response.status >= 500) {
            setError("Server error. Please try again later.");
          } else {
            setError("Failed to load page. Please try again.");
          }
        } else if (err.request) {
          // Network error
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          // Other error
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if user has already voted for this page (stored locally)
    if (slug) {
      const votedPages = JSON.parse(
        localStorage.getItem("voted_pages") || "[]"
      );
      setHasVoted(votedPages.includes(slug));
    }

    loadPageData();
  }, [slug, location.search, previewData]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/view/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: pageData.title,
          text: `Check out this farewell page: ${pageData.title}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
      alert("Link copied to clipboard!");
    } catch (err) {
      console.log("Error copying to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link copied to clipboard!");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-blue-500 border-b-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-white text-xl">Loading the experience...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-8xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 text-xl mb-8">{error}</p>
          <motion.button
            onClick={handleBackToHome}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Return Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Return early if no pageData yet
  if (!pageData) {
    return null;
  }

  // Get tone-specific text color
  const getToneTextColor = (tone) => {
    const colors = {
      dramatic: "#ffffff",
      ironic: "#1f2937",
      cringe: "#ffffff",
      classy: "#f3f4f6",
      touching: "#8b4513",
      absurd: "#1f2937",
      "passive-aggressive": "#ffffff",
      honest: "#1f2937",
    };
    return colors[tone] || "#ffffff";
  };

  const textColor =
    pageData.textColor || getToneTextColor(pageData.tone || "honest");

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ color: textColor }}
    >
      {/* Tone-based background effects */}
      <ToneBasedBackgroundEffects tone={pageData.tone} />

      {/* Background image overlay */}
      {(pageData.backgroundImage?.url || pageData.backgroundImage) && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${
              pageData.backgroundImage?.url || pageData.backgroundImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Navigation Bar */}
      <motion.nav
        className="relative z-40 p-6 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-xl text-sm font-medium border border-white/10 hover:bg-black/50 transition-all duration-300"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{ color: textColor }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to TheEnd.page
        </motion.button>

        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleShare}
            className="p-3 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 hover:bg-black/50 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            title="Share this page"
          >
            <Share2 className="w-5 h-5" style={{ color: textColor }} />
          </motion.button>

          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-xl border border-white/10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Eye className="w-4 h-4" style={{ color: textColor }} />
            <span className="text-sm font-medium" style={{ color: textColor }}>
              {views.toLocaleString()}
            </span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-30 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Main message in glassmorphic card */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <GlassmorphicCard
              title={pageData.title || "Untitled"}
              mainMessage={
                pageData.mainMessage || pageData.content || "No message"
              }
              subMessage={pageData.subMessage || pageData.description || ""}
              tone={pageData.tone || "honest"}
              className="mb-8"
            />
          </motion.div>

          {/* Image carousel */}
          {pageData.images && pageData.images.length > 0 && (
            <motion.div
              className="mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ImageCarousel
                images={pageData.images}
                autoplay={pageData.slideshowAutoplay}
              />
            </motion.div>
          )}

          {/* Audio player */}
          {pageData.music && (
            <motion.div
              className="mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <AudioPlayer
                audioSrc={pageData.music.url}
                autoplay={pageData.autoplayMusic}
              />
            </motion.div>
          )}

          {/* Voting button */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <VotingButton
              pageId={pageData._id} // The ID used for API calls
              pageSlug="example-page" // The slug used for local storage
              initialVotes={10}
              hasVoted={false}
              onVote={(newVoteCount) =>
                console.log("New vote count:", newVoteCount)
              }
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-16 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <p className="text-sm opacity-60" style={{ color: textColor }}>
              Created on{" "}
              {pageData.createdAt
                ? new Date(pageData.createdAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </p>
            <p className="text-xs opacity-40 mt-2" style={{ color: textColor }}>
              Made with ❤️ on TheEnd.page
            </p>
          </motion.div>
        </div>
      </div>

      {/* Special effects for specific tones */}
      <AnimatePresence>
        {pageData.tone === "cringe" && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  repeatDelay: 2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        )}

        {pageData.tone === "touching" && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8,
                }}
              >
                💝
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageViewer;
