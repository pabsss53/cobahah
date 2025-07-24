import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import WebGISInterface from './components/WebGISInterface';
import Navigation from './components/Navigation';
import { GISProvider } from './context/GISContext';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'webgis'>('landing');

  return (
    <GISProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <AnimatePresence mode="wait">
          {currentView === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onEnterWebGIS={() => setCurrentView('webgis')} />
            </motion.div>
          ) : (
            <motion.div
              key="webgis"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <WebGISInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GISProvider>
  );
}

export default App;