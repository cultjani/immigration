'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';

// Load the Globe Model with animation and infinite rotation
function GlobeModel() {
  const globeRef = useRef();
  const cloudsRef = useRef();
  const { scene } = useGLTF('models/fin.glb'); // Load your 3D globe model here

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Traverse the scene to detect clouds and adjust material properties
      scene.traverse((child) => {
        if (child.isMesh) {
          // Detect the clouds and store their reference for infinite rotation
          if (child.name.includes("Cloud")) {
            cloudsRef.current = child;
            
            // Set opacity for the clouds
            child.material.transparent = true;  // Enable transparency
            child.material.opacity = 0.5;  // Set opacity (adjust this value as needed)
          }

          // Adjust material properties if needed
          child.material.roughness = 0.8;  // Set roughness to reduce reflections
          child.material.metalness = 0;  // Set metalness to 0 to remove metallic reflection
        }
      });
    }
  }, [scene]);

  // Infinite rotation for both globe and clouds
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0003;  // Globe rotation speed
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.z += 0.0001;  // Clouds rotation speed
    }
  });

  return typeof window !== 'undefined' ? (
    <primitive ref={globeRef} object={scene} scale={[0.07, 0.06, 0.07]} position={[0, -50, 80]} />
  ) : null;
}

// Dynamically adjust the camera based on window size
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    // Client-side check
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Adjust the FOV based on screen width (more narrow FOV on smaller screens)
        camera.fov = size.width < 768 ? 75 : 50;  // Example values for responsiveness
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);

      // Run the resize handler immediately to set the initial FOV
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [camera, size]);

  return null;
}

export default function GlobeWithRoutes() {
  return (
    <div className="canvas-container" style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 0, 180], fov: 50 ,
        near: 1,  // Near clipping plane
        far: 1000,  // Far clipping plane
        zoom: 1  // Zoom level
       }}>
        {/* Responsive Camera to handle screen resize */}
        <ResponsiveCamera />

        {/* Add realistic lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 0, 20]} 
          intensity={15} 
          color={"#ffd27f"} 
          castShadow={true}
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />

        {/* Realistic stars */}
        <Stars
          radius={100}  // Radius of the stars sphere
          depth={50}    // Starfield depth
          count={400}  // Number of stars
          factor={4}    // Star size factor
          saturation={0} // Star color saturation
          fade         // Smooth star edges
        />

        <Suspense fallback={null}>
          <GlobeModel />
        </Suspense>
      </Canvas>
    </div>
  );
}