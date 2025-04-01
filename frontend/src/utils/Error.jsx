import React from 'react'
import { motion } from "framer-motion";


function Error({error}) {
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-red-50 border-l-4 border-red-500 p-4"
  >
    <p className="text-red-700">{error.message || 'Failed to load data'}</p>
  </motion.div>
  )
}

export default Error