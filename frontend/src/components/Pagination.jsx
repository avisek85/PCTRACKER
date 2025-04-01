import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ 
  currentPage, 
  totalpages, 
  totalItems, 
  onPageChange,
  isLoading 
}) => {
  console.log("currentPage,totalpages",currentPage, 
    totalpages);
  const handleClick = (newPage) => {
    if (!isLoading && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible/2));
    let end = Math.min(totalpages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalItems)} of {totalItems}
      </div>
      
      <div className="flex items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick(1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          « First
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          ‹ Prev
        </motion.button>

        {getPageNumbers().map(page => (
          <motion.button
            key={page}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(page)}
            disabled={isLoading}
            className={`px-3 py-1 rounded border ${
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() =>{
            console.log("Next page clicked");
            handleClick(currentPage + 1)
          }}
          disabled={currentPage === totalpages || isLoading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next ›
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick(totalpages)}
          disabled={currentPage === totalpages || isLoading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Last »
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;