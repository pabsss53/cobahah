import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapInterface from './MapInterface';
import GeoprocessingPanel from './GeoprocessingPanel';
import DataPanel from './DataPanel';
import AnalyticsPanel from './AnalyticsPanel';
import { 
  Map, 
  Database, 
  BarChart3, 
  Settings, 
  Layers, 
  Download,
  Upload,
  Zap,
  Filter,
  Search
} from 'lucide-react';

const WebGISInterface: React.FC = () => {
  const [activePanel, setActivePanel] = useState<'map' | 'geoprocessing' | 'data' | 'analytics'>('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const panels = [
    { id: 'map', label: 'Map View', icon: <Map className="w-5 h-5" />, color: 'blue' },
    { id: 'geoprocessing', label: 'Geoprocessing', icon: <Zap className="w-5 h-5" />, color: 'purple' },
    { id: 'data', label: 'Data Management', icon: <Database className="w-5 h-5" />, color: 'green' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, color: 'orange' },
  ];

  const tools = [
    { icon: <Layers className="w-4 h-4" />, label: 'Layers', action: () => {} },
    { icon: <Filter className="w-4 h-4" />, label: 'Filter', action: () => {} },
    { icon: <Search className="w-4 h-4" />, label: 'Search', action: () => {} },
    { icon: <Upload className="w-4 h-4" />, label: 'Import', action: () => {} },
    { icon: <Download className="w-4 h-4" />, label: 'Export', action: () => {} },
    { icon: <Settings className="w-4 h-4" />, label: 'Settings', action: () => {} },
  ];

  return (
    <div className="h-screen flex pt-16 bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="w-80 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700 flex flex-col"
      >
        {/* Panel Navigation */}
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            {panels.map((panel) => (
              <motion.button
                key={panel.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePanel(panel.id as any)}
                className={`
                  flex items-center space-x-2 p-3 rounded-lg transition-all duration-300
                  ${activePanel === panel.id
                    ? `bg-${panel.color}-600 text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {panel.icon}
                <span className="text-sm font-medium">{panel.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Tools</h3>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={tool.action}
                className="flex flex-col items-center space-y-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300"
              >
                {tool.icon}
                <span className="text-xs text-gray-300">{tool.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePanel === 'geoprocessing' && (
              <motion.div
                key="geoprocessing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GeoprocessingPanel />
              </motion.div>
            )}
            {activePanel === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DataPanel />
              </motion.div>
            )}
            {activePanel === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyticsPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Sidebar Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm text-white p-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-300"
        >
          <Layers className="w-5 h-5" />
        </motion.button>

        {/* Map Interface */}
        <MapInterface />
      </div>
    </div>
  );
};

export default WebGISInterface;