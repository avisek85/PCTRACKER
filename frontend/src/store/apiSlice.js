import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api";

// In your apiSlice.js
export const fetchAllActivties = createAsyncThunk(
  'activities/fetchAll',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/all-activities`, {
        params: { page, limit }
      });
      console.log("response.data in fetchAllActivites ",response.data);
      return response.data; // This should match your backend response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch activities");
    }
  }
);
export const fetchDaily = createAsyncThunk(
  "activities/fetchDaily",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/date-activities?date=${date}`
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      return (
        rejectWithValue(error.response.data) ||
        "Failed to fetch daily activities"
      );
    }
  }
);

export const fetchWeekly = createAsyncThunk(
  "activities/fetchWeekly",
  async (week, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/week-activities?week=${week}`
      );
      return response.data;
    } catch (error) {
      return (
        rejectWithValue(error.response.data) ||
        "Failed to fetch weekly activities"
      );
    }
  }
);

export const fetchMonthly = createAsyncThunk(
  "activities/fetchMonthly",
  async (month, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/month-activities?month=${month}`
      );
      return response.data;
    } catch (error) {
      return (
        rejectWithValue(error.response.data) ||
        "Failed to fetch monthly activities"
      );
    }
  }
);

export const fetchYearly = createAsyncThunk(
  "activtities/fetchYearly",
  async (year, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/year-activities?year=${year}`
      );
      return response.data;
    } catch (error) {
      return (
        rejectWithValue(error.response.data) ||
        "Failed to fetch yearly activities"
      );
    }
  }
);

export const fetchTopUsedApps = createAsyncThunk(
  "activities/fetchTopUsedApps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/topused-apps`);
      return response.data;
    } catch (error) {
      return (
        rejectWithValue(error.response.data) || "Failed to fetch top used Apps"
      );
    }
  }
);

const initialState = {
  all: {},
  daily: {},
  weekly: {},
  monthly: {},
  yearly: {},
  topUsedApps: {},
  loading: {
    all: false,
    daily: false,
    weekly: false,
    monthly: false,
    yearly: false,
    topUsedApps: false,
  },
  error: {
    all: null,
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
    topUsedApps: null,
  },
};

const apiSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const loadingKeys = [
      "all",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "topUsedApps",
    ];

    // DRY approach to handle all states
    loadingKeys.forEach((key, index) => {
      const thunk = [
        fetchAllActivties,
        fetchDaily,
        fetchWeekly,
        fetchMonthly,
        fetchYearly,
        fetchTopUsedApps,
      ][index];

      /*
Why the Syntax Looks Confusing
The code uses inline indexing instead of creating a separate variable:
      const thunkArray = [ 
    fetchAllActivities, 
    fetchDaily, 
    fetchWeekly, 
    fetchMonthly, 
    fetchYearly, 
    fetchTopUsedApps 
];

const thunk = thunkArray[index];

      */

      // Handle pending (Loading)
      builder.addCase(thunk.pending, (state) => {
        state.loading[key] = true;
        state.error[key] = null;
      });

      // Handle fulfilled (Success)
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.loading[key] = false;
        state[key] = action.payload;
      });

      // Handle rejected (Error)
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading[key] = false;
        state.error[key] = action.payload;
      });
    });
  },
});

export default apiSlice.reducer;
