import {configureStore} from "@reduxjs/toolkit";
import apiReducer from "./apiSlice";

 const store = configureStore({
    reducer:{
        api: apiReducer              // Backend communication
    },
})

export default store;