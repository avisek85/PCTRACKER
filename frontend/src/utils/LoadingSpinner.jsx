import React from 'react'
import { motion } from "framer-motion";


function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"
    />
  </div>
  )
}

export default LoadingSpinner