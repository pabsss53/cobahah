import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity,
  Target,
  Zap,
  Calendar,
  MapPin
} from 'lucide-react';

const AnalyticsPanel: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'overview' | 'spatial' | 'temporal' | 'statistical'>('overview');

  const chartTypes = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'spatial', label: 'Spatial', icon: <MapPin className="w-4 h-4" /> },
    { id: 'temporal', label: 'Temporal', icon: <Calendar className="w-4 h-4" /> },
    { id: 'statistical', label: 'Statistical', icon: <Activity className="w-4 h-4" /> },
  ];

  const metrics = [
    { label: 'Total Features', value: '8,456', change: '+12%', color: 'text-blue-400' },
    { label: 'Active Layers', value: '24', change: '+3', color: 'text-green-400' },
    { label: 'Analysis Jobs', value: '156', change: '+8%', color: 'text-purple-400' },
    { label: 'Data Size', value: '2.3 GB', change: '+0.5 GB', color: 'text-orange-400' },
  ];

  const analysisTools = [
    { name: 'Density Analysis', icon: <Target className="w-5 h-5" />, description: 'Calculate point density' },
    { name: 'Trend Analysis', icon: <TrendingUp className="w-5 h-5" />, description: 'Identify temporal trends' },
    { name: 'Cluster Analysis', icon: <Zap className="w-5 h-5" />, description: 'Find spatial clusters' },
    { name: 'Correlation Analysis', icon: <Activity className="w-5 h-5" />, description: 'Analyze relationships' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-white mb-4">Analytics Dashboard</h2>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-700 rounded-lg p-3"
          >
            <div className="text-gray-400 text-xs mb-1">{metric.label}</div>
            <div className="text-white font-bold text-lg">{metric.value}</div>
            <div className={`text-xs ${metric.color}`}>{metric.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {chartTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveChart(type.id as any)}
            className={`
              flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 text-sm
              ${activeChart === type.id
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            {type.icon}
            <span>{type.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Chart Placeholder */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-4 mb-6 h-48 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-white font-medium">{chartTypes.find(t => t.id === activeChart)?.label} Chart</div>
          <div className="text-gray-400 text-sm">Interactive visualization would appear here</div>
        </div>
      </motion.div>

      {/* Analysis Tools */}
      <div>
        <h3 className="text-white font-medium mb-3">Quick Analysis</h3>
        <div className="space-y-2">
          {analysisTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="text-orange-400">
                  {tool.icon}
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{tool.name}</h4>
                  <p className="text-gray-400 text-xs">{tool.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white font-medium mb-3">Export Analytics</h3>
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-all duration-300 text-sm"
          >
            Export as PDF Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-all duration-300 text-sm"
          >
            Export Data as CSV
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;