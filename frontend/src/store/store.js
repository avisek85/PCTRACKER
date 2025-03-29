import {configureStore} from "@reduxjs/toolkit";
import activityReducer from "./activitySlice";
import apiReducer from "./apiSlice";

 const store = configureStore({
    reducer:{
        activity:activityReducer, // Local activity data
        api: apiReducer              // Backend communication
    },
})

export default store;