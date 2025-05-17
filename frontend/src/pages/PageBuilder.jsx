import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/shared/ProgressBar';
import ToneSelector from '../components/ToneSelector';
import MessageEditor from '../components/MessageEditor';
import StyleCustomizer from '../components/StyleCustomizer';
import PreviewPage from '../components/PreviewPage';

const PageBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTone, setSelectedTone] = useState(null);
  const [pageData, setPageData] = useState({
    title: '',
    mainMessage: '',
    subMessage: '',
    tone: null,
    backgroundImage: null,
    music: null
  });

  const steps = [
    { title: "Choose Your Tone", component: ToneSelector },
    { title: "Craft Your Message", component: MessageEditor },
    { title: "Add Some Style", component: StyleCustomizer },
    { title: "Preview & Publish", component: PreviewPage }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <div className="container mx-auto flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToHome}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← Back to Home
          </motion.button>
          
          <div className="flex-1 max-w-md mx-8">
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
          </div>
          
          <div className="text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {steps[currentStep].title}
            </h2>
            
            {React.createElement(steps[currentStep].component, {
              pageData,
              setPageData,
              selectedTone,
              setSelectedTone,
              onNext: nextStep,
              onPrev: prevStep,
              isFirstStep: currentStep === 0,
              isLastStep: currentStep === steps.length - 1
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageBuilder;