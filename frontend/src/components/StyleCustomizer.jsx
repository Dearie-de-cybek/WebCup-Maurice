/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Music, X, Image as ImageIcon } from 'lucide-react';
import LivePreview from './shared/LivePreview';

const StyleCustomizer = ({ pageData, setPageData, onNext, onPrev }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const fileInputRef = useRef(null);
  const musicInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData({ 
          ...pageData, 
          backgroundImage: {
            url: e.target.result,
            name: file.name,
            size: file.size
          }
        });
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
    }
  };

  // Handle music upload
  const handleMusicUpload = async (file) => {
    if (!file || !file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }

    setUploadingMusic(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData({ 
          ...pageData, 
          music: {
            url: e.target.result,
            name: file.name,
            size: file.size
          }
        });
        setUploadingMusic(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading music:', error);
      setUploadingMusic(false);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop events
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else if (file.type.startsWith('audio/')) {
        handleMusicUpload(file);
      }
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setPageData({ ...pageData, backgroundImage: null });
  };

  // Remove uploaded music
  const removeMusic = () => {
    setPageData({ ...pageData, music: null });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Background Image Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Background Image
            </h3>
            
            {pageData.backgroundImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={pageData.backgroundImage.url} 
                    alt="Background preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{pageData.backgroundImage.name}</p>
                  <p>{formatFileSize(pageData.backgroundImage.size)}</p>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadingImage ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports: JPG, PNG, GIF (Max 10MB)
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Choose File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Music Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Music className="w-6 h-6" />
              Background Music
            </h3>
            
            {pageData.music ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{pageData.music.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(pageData.music.size)}
                    </p>
                  </div>
                  <button
                    onClick={removeMusic}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <audio 
                  controls 
                  src={pageData.music.url}
                  className="w-full"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadingMusic ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                      <span className="text-gray-600">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Music className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-3">Upload your own music</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports: MP3, WAV, M4A (Max 25MB)
                      </p>
                      <button
                        onClick={() => musicInputRef.current?.click()}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Choose Audio File
                      </button>
                      <input
                        ref={musicInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => e.target.files[0] && handleMusicUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Preset Music Options */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Or choose from our presets:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'sad-piano', name: 'Sad Piano', emoji: '🎹' },
                      { id: 'epic-orchestra', name: 'Epic Orchestra', emoji: '🎼' },
                      { id: 'upbeat-pop', name: 'Upbeat Pop', emoji: '🎵' },
                      { id: 'ambient', name: 'Ambient', emoji: '🌊' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setPageData({ 
                          ...pageData, 
                          music: { 
                            preset: preset.id, 
                            name: preset.name,
                            emoji: preset.emoji
                          }
                        })}
                        className="p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-lg mr-2">{preset.emoji}</span>
                        <span className="text-sm font-medium">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Customizations */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Advanced Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Style
                </label>
                <select 
                  value={pageData.animationStyle || 'default'}
                  onChange={(e) => setPageData({ ...pageData, animationStyle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="default">Default</option>
                  <option value="dramatic">Dramatic Entrance</option>
                  <option value="subtle">Subtle Fade</option>
                  <option value="bounce">Bouncy</option>
                  <option value="slide">Slide In</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color Override
                </label>
                <input
                  type="color"
                  value={pageData.textColor || '#ffffff'}
                  onChange={(e) => setPageData({ ...pageData, textColor: e.target.value })}
                  className="w-full h-12 rounded-lg border border-gray-300"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoplay-music"
                  checked={pageData.autoplayMusic || false}
                  onChange={(e) => setPageData({ ...pageData, autoplayMusic: e.target.checked })}
                  className="mr-3"
                />
                <label htmlFor="autoplay-music" className="text-sm font-medium text-gray-700">
                  Auto-play background music
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6">
          <LivePreview pageData={pageData} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-bold inline-flex items-center gap-2"
        >
          Preview & Publish
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default StyleCustomizer;