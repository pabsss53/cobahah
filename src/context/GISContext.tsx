import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Layer {
  id: string;
  name: string;
  type: 'vector' | 'raster';
  visible: boolean;
  opacity: number;
  style?: any;
}

interface GISContextType {
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  updateLayerOpacity: (id: string, opacity: number) => void;
}

const GISContext = createContext<GISContextType | undefined>(undefined);

export const useGIS = () => {
  const context = useContext(GISContext);
  if (!context) {
    throw new Error('useGIS must be used within a GISProvider');
  }
  return context;
};

interface GISProviderProps {
  children: ReactNode;
}

export const GISProvider: React.FC<GISProviderProps> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: '1',
      name: 'Base Map',
      type: 'raster',
      visible: true,
      opacity: 1,
    },
    {
      id: '2',
      name: 'Cities',
      type: 'vector',
      visible: true,
      opacity: 0.8,
    },
  ]);

  const addLayer = (layer: Layer) => {
    setLayers(prev => [...prev, layer]);
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const updateLayerOpacity = (id: string, opacity: number) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, opacity } : layer
      )
    );
  };

  const value = {
    layers,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    updateLayerOpacity,
  };

  return (
    <GISContext.Provider value={value}>
      {children}
    </GISContext.Provider>
  );
};