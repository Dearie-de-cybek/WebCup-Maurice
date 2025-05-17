/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Music, X, Image as ImageIcon, Palette, Type, Plus } from 'lucide-react';
import LivePreview from './shared/LivePreview';

const StyleCustomizer = ({ pageData, setPageData, onNext, onPrev }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const fileInputRef = useRef(null);
  const musicInputRef = useRef(null);

  // Curated background colors that work well with various text colors
  const backgroundColors = [
    { name: 'Midnight Black', value: '#0f0f0f', textColors: ['#ffffff', '#f3f4f6', '#fbbf24', '#f87171'] },
    { name: 'Deep Purple', value: '#581c87', textColors: ['#ffffff', '#fbbf24', '#f87171', '#34d399'] },
    { name: 'Navy Blue', value: '#1e3a8a', textColors: ['#ffffff', '#fbbf24', '#34d399', '#f87171'] },
    { name: 'Forest Green', value: '#166534', textColors: ['#ffffff', '#fbbf24', '#f87171', '#60a5fa'] },
    { name: 'Deep Red', value: '#7f1d1d', textColors: ['#ffffff', '#fbbf24', '#f3f4f6', '#34d399'] },
    { name: 'Charcoal', value: '#374151', textColors: ['#ffffff', '#fbbf24', '#f87171', '#34d399'] },
    { name: 'Pure White', value: '#ffffff', textColors: ['#1f2937', '#7f1d1d', '#1e3a8a', '#166534'] },
    { name: 'Soft Gray', value: '#f3f4f6', textColors: ['#1f2937', '#7f1d1d', '#1e3a8a', '#166534'] },
    { name: 'Warm Cream', value: '#fefce8', textColors: ['#1f2937', '#7f1d1d', '#1e3a8a', '#166534'] },
    { name: 'Rose Gold', value: '#fdf2f8', textColors: ['#7f1d1d', '#581c87', '#166534', '#1e3a8a'] }
  ];

  // Font options
  const fontOptions = [
    { name: 'Modern Sans', value: "'Inter', sans-serif", weight: 'normal' },
    { name: 'Elegant Serif', value: "'Playfair Display', serif", weight: 'normal' },
    { name: 'Classic Times', value: "'Times New Roman', serif", weight: 'normal' },
    { name: 'Bold Impact', value: "'Impact', sans-serif", weight: 'bold' },
    { name: 'Handwritten', value: "'Dancing Script', cursive", weight: 'normal' },
    { name: 'Monospace', value: "'Courier New', monospace", weight: 'normal' },
    { name: 'Gothic', value: "'Oswald', sans-serif", weight: 'normal' },
    { name: 'Friendly', value: "'Comfortaa', cursive", weight: 'normal' }
  ];

  // Text size options
  const textSizeOptions = [
    { name: 'Small', value: 'text-sm', px: '14px' },
    { name: 'Medium', value: 'text-base', px: '16px' },
    { name: 'Large', value: 'text-lg', px: '18px' },
    { name: 'Extra Large', value: 'text-xl', px: '20px' },
    { name: 'Huge', value: 'text-2xl', px: '24px' }
  ];

  // Handle multiple image upload
  const handleImageUpload = async (files) => {
    const currentImages = pageData.images || [];
    
    if (currentImages.length + files.length > 8) {
      alert('Maximum 8 images allowed. Please remove some images first.');
      return;
    }

    const newImages = [];
    
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large! Please use files smaller than 5MB.`);
        continue;
      }

      try {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (e) => {
            newImages.push({
              id: Math.random().toString(36).substring(7),
              url: e.target.result,
              name: file.name,
              size: file.size
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload ${file.name}. Please try again.`);
      }
    }

    setPageData({ 
      ...pageData, 
      images: [...currentImages, ...newImages]
    });
  };

  // Handle music upload
  const handleMusicUpload = async (file) => {
    if (!file || !file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Audio file too large! Please use a file smaller than 10MB for best performance.');
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
      alert('Failed to upload audio. Please try again.');
      setUploadingMusic(false);
    }
  };

  // Handle drag events for images
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop events for images
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(Array.from(e.dataTransfer.files));
    }
  };

  // Remove an image
  const removeImage = (imageId) => {
    const updatedImages = pageData.images.filter(img => img.id !== imageId);
    setPageData({ ...pageData, images: updatedImages });
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

  const selectedBgColor = backgroundColors.find(color => color.value === pageData.backgroundColor) || backgroundColors[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Background Color Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Background Color
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {backgroundColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setPageData({ 
                    ...pageData, 
                    backgroundColor: color.value,
                    // Auto-select first compatible text color if current doesn't work
                    textColor: color.textColors.includes(pageData.textColor) 
                      ? pageData.textColor 
                      : color.textColors[0]
                  })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    pageData.backgroundColor === color.value
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className="w-full h-12 rounded-md mb-2"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-sm font-medium text-gray-700">{color.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Text Styling Options */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Text Styling
            </h3>
            
            <div className="space-y-6">
              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Text Color
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {selectedBgColor.textColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPageData({ ...pageData, textColor: color })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        pageData.textColor === color
                          ? 'border-purple-500 ring-2 ring-purple-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-full h-8 rounded-md flex items-center justify-center text-sm font-medium"
                        style={{ 
                          backgroundColor: color,
                          color: color === '#ffffff' || color.includes('f') ? '#000000' : '#ffffff'
                        }}
                      >
                        Aa
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Font Family
                </label>
                <select 
                  value={pageData.fontFamily || fontOptions[0].value}
                  onChange={(e) => setPageData({ ...pageData, fontFamily: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Text Size
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {textSizeOptions.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setPageData({ ...pageData, textSize: size.value })}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        pageData.textSize === size.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-600">{size.name}</div>
                      <div className="mt-1" style={{ fontSize: size.px }}>Aa</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images Upload (Slideshow) */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Images for Slideshow (Max 8)
            </h3>
            
            {/* Uploaded Images Display */}
            {pageData.images && pageData.images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {pageData.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img 
                        src={image.url} 
                        alt={`Slide ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {pageData.images.length}/8 images uploaded
                </p>
              </div>
            )}

            {/* Upload Area */}
            {(!pageData.images || pageData.images.length < 8) && (
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
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag & drop images, or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: JPG, PNG, GIF (Max 5MB each)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleImageUpload(Array.from(e.target.files))}
                  className="hidden"
                />
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
                        Supports: MP3, WAV, M4A (Max 10MB)
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

          {/* Additional Options */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Additional Options</h3>
            
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="slideshow-autoplay"
                  checked={pageData.slideshowAutoplay || false}
                  onChange={(e) => setPageData({ ...pageData, slideshowAutoplay: e.target.checked })}
                  className="mr-3"
                />
                <label htmlFor="slideshow-autoplay" className="text-sm font-medium text-gray-700">
                  Auto-play image slideshow
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