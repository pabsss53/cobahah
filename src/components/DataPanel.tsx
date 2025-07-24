import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Upload, 
  Download, 
  FileText, 
  Map, 
  Table,
  Search,
  Filter,
  Eye,
  Trash2
} from 'lucide-react';

const DataPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'import' | 'export'>('layers');

  const sampleLayers = [
    { name: 'Cities', type: 'Point', records: 1250, visible: true, color: '#3b82f6' },
    { name: 'Roads', type: 'Line', records: 5680, visible: true, color: '#ef4444' },
    { name: 'Administrative Boundaries', type: 'Polygon', records: 34, visible: false, color: '#10b981' },
    { name: 'Land Use', type: 'Polygon', records: 892, visible: true, color: '#f59e0b' },
    { name: 'Water Bodies', type: 'Polygon', records: 156, visible: true, color: '#06b6d4' },
  ];

  const tabs = [
    { id: 'layers', label: 'Layers', icon: <Database className="w-4 h-4" /> },
    { id: 'import', label: 'Import', icon: <Upload className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
  ];

  const supportedFormats = [
    { name: 'Shapefile', extension: '.shp', type: 'Vector' },
    { name: 'GeoJSON', extension: '.geojson', type: 'Vector' },
    { name: 'KML', extension: '.kml', type: 'Vector' },
    { name: 'GeoTIFF', extension: '.tif', type: 'Raster' },
    { name: 'CSV', extension: '.csv', type: 'Tabular' },
    { name: 'GPX', extension: '.gpx', type: 'GPS' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-white mb-4">Data Management</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 text-sm flex-1 justify-center
              ${activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Layers Tab */}
      {activeTab === 'layers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search and Filter */}
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search layers..."
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Layers List */}
          <div className="space-y-2">
            {sampleLayers.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: layer.color }}
                    ></div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{layer.name}</h3>
                      <p className="text-gray-400 text-xs">{layer.type} • {layer.records} records</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 rounded ${layer.visible ? 'text-green-400' : 'text-gray-500'}`}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 rounded text-gray-400 hover:text-white"
                    >
                      <Table className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 rounded text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-gray-400 text-sm mb-4">Support for multiple geospatial formats</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              Select Files
            </motion.button>
          </div>

          {/* Supported Formats */}
          <div>
            <h3 className="text-white font-medium mb-3">Supported Formats</h3>
            <div className="grid grid-cols-2 gap-2">
              {supportedFormats.map((format, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-white text-sm font-medium">{format.name}</div>
                      <div className="text-gray-400 text-xs">{format.extension} • {format.type}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Select Layer to Export</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm">
                <option>Select layer...</option>
                {sampleLayers.map((layer, index) => (
                  <option key={index}>{layer.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Export Format</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm">
                <option>Shapefile (.shp)</option>
                <option>GeoJSON (.geojson)</option>
                <option>KML (.kml)</option>
                <option>CSV (.csv)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Coordinate System</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm">
                <option>WGS84 (EPSG:4326)</option>
                <option>Web Mercator (EPSG:3857)</option>
                <option>UTM Zone 48S (EPSG:32748)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="selectedOnly" className="rounded" />
              <label htmlFor="selectedOnly" className="text-gray-300 text-sm">Export selected features only</label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataPanel;