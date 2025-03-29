import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PracticeFramer = () => {
  const { scrollY } = useScroll();

  // Parallax transformations
  const backgroundY = useTransform(scrollY, [0, 500], [0, -100]); // Slowest
  const midLayerY = useTransform(scrollY, [0, 500], [0, -200]);   // Medium speed
  const foregroundY = useTransform(scrollY, [0, 500], [0, -300]); // Fastest

  return (
    <div className="relative min-h-[200vh] bg-gray-900">
      {/* Background Layer */}
      <motion.div
        style={{ y: backgroundY, backgroundImage: "url('https://source.unsplash.com/random/1600x900?landscape')", }}
        className="absolute top-0 left-0 w-full h-screen bg-cover bg-center"
      
      />

      {/* Mid Layer */}
      <motion.div
        style={{ y: midLayerY ,  backgroundImage: "url('https://source.unsplash.com/random/1600x900?nature')", }}
        className="absolute top-0 left-0 w-full h-screen bg-cover bg-center opacity-80"
       
      />

      {/* Foreground Layer */}
      <motion.div
        style={{ y: foregroundY ,  backgroundImage: "url('https://source.unsplash.com/random/1600x900?mountains')", }}
        className="absolute top-0 left-0 w-full h-screen bg-cover bg-center opacity-70"
    
      />

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-4xl font-bold">
        🚀 Smooth Parallax Scrollllll
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-4xl font-bold">
        🌟 Keep Scrolling!
      </div>
    </div>
  );
};

export default PracticeFramer;
