import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TimeFilterSelector = ({ 
  initialType = 'date', 
  initialValue = '', 
  onFilter 
}) => {
  const [filterType, setFilterType] = useState(initialType);
  const [filterValue, setFilterValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filterValue) return;
    
    setIsSubmitting(true);
    
    try {
      await onFilter(filterType, filterValue);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputType = () => {
    switch (filterType) {
      case 'date': return 'date';
      case 'month': return 'month';
      case 'year': return 'number';
      case 'week': return 'week';
      default: return 'text';
    }
  };

  const getPlaceholder = () => {
    switch (filterType) {
      case 'date': return 'Select a date';
      case 'week': return 'YYYY-Www (e.g. 2023-W24)';
      case 'month': return 'YYYY-MM';
      case 'year': return 'YYYY';
      default: return `Enter ${filterType}`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <motion.div whileHover={{ scale: 1.02 }} className="w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue('');
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          >
            <option value="date">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative flex-1"
          >
            <input
              type={getInputType()}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={getPlaceholder()}
              min={filterType === 'year' ? '2000' : undefined}
              max={filterType === 'year' ? new Date().getFullYear().toString() : undefined}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
            <AnimatePresence>
              {filterValue && (
                <motion.button
                  type="button"
                  onClick={() => setFilterValue('')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!filterValue || isSubmitting}
            whileHover={{ scale: filterValue ? 1.02 : 1 }}
            whileTap={{ scale: filterValue ? 0.98 : 1 }}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filterValue 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </motion.span>
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Apply Filter
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {filterType === 'week' && !filterValue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-gray-500"
          >
            Tip: Week format is YYYY-Www (e.g., 2023-W24 for the 24th week of 2023)
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TimeFilterSelector;