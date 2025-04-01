import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import TimeFilterSelector from './TimeFilterSelector';
import TimeFilterView from './TimeFilterView';
import { fetchDaily, fetchWeekly, fetchMonthly, fetchYearly } from '../../store/apiSlice';

const TimeFilterParent = () => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState({
    type: 'date',
    value: new Date().toISOString().split('T')[0] // Default to today
  });

 // Get data from Redux store
const { data, loading, error } = useSelector(state => {
    switch (activeFilter.type) {
      case 'date': 
        return { 
          data: state.api.daily,
          loading: state.api.loading.daily,
          error: state.api.error.daily
        };
      case 'week': 
        return { 
          data: state.api.weekly,
          loading: state.api.loading.weekly,
          error: state.api.error.weekly
        };
      case 'month': 
        return { 
          data: state.api.monthly,
          loading: state.api.loading.monthly,
          error: state.api.error.monthly
        };
      case 'year': 
        return { 
          data: state.api.yearly,
          loading: state.api.loading.yearly,
          error: state.api.error.yearly
        };
      default: 
        return { 
          data: [], 
          loading: false, 
          error: null 
        };
    }
  });

  console.log("data in TimeFilterParent", data);


  const handleFilter = async (type, value) => {
    if (!value) return;
    
    setActiveFilter({ type, value });
    
    switch (type) {
      case 'date': await dispatch(fetchDaily(value)); break;
      case 'week': await dispatch(fetchWeekly(value)); break;
      case 'month': await dispatch(fetchMonthly(value)); break;
      case 'year': await dispatch(fetchYearly(value)); break;
      default: break;
    }
  };

  return (
    <div className="space-y-6">
      <TimeFilterSelector 
        initialType={activeFilter.type}
        initialValue={activeFilter.value}
        onFilter={handleFilter}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TimeFilterView 
          timeUnit={activeFilter.type}
          timeValue={activeFilter.value}
          data={data}
          loading={loading}
          error={error}
        />
      </motion.div>
    </div>
  );
};

export default TimeFilterParent;