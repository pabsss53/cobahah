import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGIS } from '../context/GISContext';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapInterface: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { layers, addLayer } = useGIS();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [-2.5, 118],
      zoom: 5,
      zoomControl: false,
    });

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Base layers
    const baseLayers = {
      'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }),
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }),
      'Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }),
      'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
      })
    };

    // Add default base layer
    baseLayers['Dark'].addTo(map);

    // Layer control
    L.control.layers(baseLayers, {}, {
      position: 'topright'
    }).addTo(map);

    // Add sample data layers
    const samplePoints = [
      { lat: -6.2088, lng: 106.8456, name: 'Jakarta', type: 'city' },
      { lat: -7.7956, lng: 110.3695, name: 'Yogyakarta', type: 'city' },
      { lat: -8.4095, lng: 115.1889, name: 'Denpasar', type: 'city' },
      { lat: 3.5952, lng: 98.6722, name: 'Medan', type: 'city' },
    ];

    samplePoints.forEach(point => {
      const marker = L.marker([point.lat, point.lng])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${point.name}</h3>
            <p class="text-sm text-gray-600">Type: ${point.type}</p>
            <p class="text-sm text-gray-600">Coordinates: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
          </div>
        `)
        .addTo(map);
    });

    // Add sample polygon
    const polygon = L.polygon([
      [-6.0, 106.5],
      [-6.0, 107.0],
      [-6.5, 107.0],
      [-6.5, 106.5]
    ], {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.3
    }).bindPopup('Sample Analysis Area').addTo(map);

    // Map click handler
    map.on('click', (e) => {
      const popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div class="p-2">
            <h3 class="font-bold">Location Info</h3>
            <p class="text-sm">Lat: ${e.latlng.lat.toFixed(6)}</p>
            <p class="text-sm">Lng: ${e.latlng.lng.toFixed(6)}</p>
            <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
              Analyze Point
            </button>
          </div>
        `)
        .openOn(map);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800/90 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-300"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([-2.5, 118], 5);
            }
          }}
        >
          🎯 Reset View
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800/90 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-300"
          onClick={() => {
            // Toggle fullscreen
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              mapRef.current?.requestFullscreen();
            }
          }}
        >
          📺 Fullscreen
        </motion.button>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-gray-700">
        <div className="text-sm">
          <div>Zoom: {mapInstanceRef.current?.getZoom() || 5}</div>
          <div>Center: {mapInstanceRef.current?.getCenter().lat.toFixed(4) || '-2.5000'}, {mapInstanceRef.current?.getCenter().lng.toFixed(4) || '118.0000'}</div>
        </div>
      </div>
    </div>
  );
};

export default MapInterface;