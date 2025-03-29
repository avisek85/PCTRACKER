import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: [],     // Store activity data
  loading: false,      // Loading indicator
  error: null,         // Store errors
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setActivities, addActivity, setLoading, setError } = activitySlice.actions;
export default activitySlice.reducer;
