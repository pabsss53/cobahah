import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import { Globe, Satellite, Map, Zap, Database, BarChart3, Layers, Navigation as NavigationIcon } from 'lucide-react';
import Earth3D from './Earth3D';
import FeatureCard from './FeatureCard';
import AnimatedButton from './AnimatedButton';

interface LandingPageProps {
  onEnterWebGIS: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterWebGIS }) => {
  const features = [
    {
      icon: <Map className="w-8 h-8" />,
      title: "Advanced Mapping",
      description: "Multi-layer mapping with real-time data visualization and custom styling options.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Satellite className="w-8 h-8" />,
      title: "Satellite Imagery",
      description: "High-resolution satellite data from multiple sources with temporal analysis.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Geoprocessing Tools",
      description: "Buffer analysis, spatial queries, overlay operations, and statistical analysis.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Data Analytics",
      description: "Advanced spatial analytics with charts, graphs, and statistical reporting.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Management",
      description: "Import, export, and manage geospatial data in multiple formats.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Lightning-fast processing with WebGL acceleration and cloud computing.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with 3D Earth */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
              <Earth3D />
              <OrbitControls 
                enableZoom={true} 
                enablePan={false} 
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
                minDistance={3}
                maxDistance={10}
              />
              <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
                <Text
                  position={[0, 3, 0]}
                  fontSize={0.5}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  font="/fonts/inter-bold.woff"
                >
                  Advanced WebGIS Platform
                </Text>
              </Float>
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              GeoSphere
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
              Next-generation geospatial intelligence platform with advanced 3D visualization,
              real-time processing, and comprehensive geoprocessing capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AnimatedButton
                onClick={onEnterWebGIS}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                icon={<NavigationIcon className="w-5 h-5" />}
              >
                Launch WebGIS
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                icon={<Globe className="w-5 h-5" />}
                variant="secondary"
              >
                Explore Features
              </AnimatedButton>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Powerful GIS Capabilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive suite of geospatial tools designed for professionals,
              researchers, and organizations requiring advanced spatial analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-12">
              Built with Modern Technology
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['WebGL', 'Three.js', 'React', 'TypeScript', 'Leaflet', 'PostGIS', 'GDAL', 'OpenLayers'].map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-white">{tech}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the future of geospatial analysis with our advanced WebGIS platform.
            </p>
            
            <AnimatedButton
              onClick={onEnterWebGIS}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
              icon={<Satellite className="w-6 h-6" />}
            >
              Start Your Journey
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;