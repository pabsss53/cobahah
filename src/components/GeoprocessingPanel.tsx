import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, Square, Users as Intersect, Option as Union, Minus, Calculator, Ruler, MapPin, Layers, Zap } from 'lucide-react';

const GeoprocessingPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'analysis' | 'overlay' | 'proximity' | 'measurement'>('analysis');

  const categories = [
    { id: 'analysis', label: 'Analysis', icon: <Calculator className="w-4 h-4" /> },
    { id: 'overlay', label: 'Overlay', icon: <Layers className="w-4 h-4" /> },
    { id: 'proximity', label: 'Proximity', icon: <Circle className="w-4 h-4" /> },
    { id: 'measurement', label: 'Measurement', icon: <Ruler className="w-4 h-4" /> },
  ];

  const tools = {
    analysis: [
      { name: 'Spatial Query', icon: <MapPin className="w-5 h-5" />, description: 'Query features by location' },
      { name: 'Attribute Query', icon: <Calculator className="w-5 h-5" />, description: 'Query features by attributes' },
      { name: 'Statistical Analysis', icon: <Calculator className="w-5 h-5" />, description: 'Calculate statistics' },
      { name: 'Hot Spot Analysis', icon: <Zap className="w-5 h-5" />, description: 'Find clustering patterns' },
    ],
    overlay: [
      { name: 'Intersect', icon: <Intersect className="w-5 h-5" />, description: 'Find overlapping areas' },
      { name: 'Union', icon: <Union className="w-5 h-5" />, description: 'Combine geometries' },
      { name: 'Difference', icon: <Minus className="w-5 h-5" />, description: 'Remove overlapping areas' },
      { name: 'Clip', icon: <Square className="w-5 h-5" />, description: 'Cut features by boundary' },
    ],
    proximity: [
      { name: 'Buffer', icon: <Circle className="w-5 h-5" />, description: 'Create buffer zones' },
      { name: 'Near Table', icon: <MapPin className="w-5 h-5" />, description: 'Find nearest features' },
      { name: 'Thiessen Polygons', icon: <Square className="w-5 h-5" />, description: 'Create proximity zones' },
      { name: 'Service Area', icon: <Circle className="w-5 h-5" />, description: 'Calculate service areas' },
    ],
    measurement: [
      { name: 'Measure Distance', icon: <Ruler className="w-5 h-5" />, description: 'Measure linear distance' },
      { name: 'Measure Area', icon: <Square className="w-5 h-5" />, description: 'Calculate polygon area' },
      { name: 'Coordinate Info', icon: <MapPin className="w-5 h-5" />, description: 'Get point coordinates' },
      { name: 'Elevation Profile', icon: <Ruler className="w-5 h-5" />, description: 'Create elevation profile' },
    ],
  };

  const handleToolClick = (toolName: string) => {
    console.log(`Executing tool: ${toolName}`);
    // Tool execution logic would go here
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-white mb-4">Geoprocessing Tools</h2>
      
      {/* Category Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveCategory(category.id as any)}
            className={`
              flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 text-sm
              ${activeCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            {category.icon}
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tools List */}
      <div className="space-y-2">
        {tools[activeCategory].map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 cursor-pointer transition-all duration-300"
            onClick={() => handleToolClick(tool.name)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-purple-400 mt-1">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">{tool.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{tool.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Parameters Panel */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white font-medium mb-3">Tool Parameters</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Input Layer</label>
            <select className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm">
              <option>Select layer...</option>
              <option>Cities</option>
              <option>Roads</option>
              <option>Boundaries</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Buffer Distance</label>
            <input 
              type="number" 
              placeholder="1000"
              className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Units</label>
            <select className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm">
              <option>Meters</option>
              <option>Kilometers</option>
              <option>Miles</option>
            </select>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all duration-300"
        >
          Execute Tool
        </motion.button>
      </div>
    </div>
  );
};

export default GeoprocessingPanel;