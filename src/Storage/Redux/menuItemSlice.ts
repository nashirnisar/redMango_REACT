// Import the createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the slice
const initialState = {
  menuItem: [], // Initial state for the menuItem property is an empty array
  search: "",
};

// Create a Redux slice named menuItemSlice
export const menuItemSlice = createSlice({
  name: "MenuItem", // Name of the slice
  initialState: initialState, // Initial state object defined above
  reducers: {
    setMenuItem: (state, action) => {
      // Reducer function to set the menuItem property
      state.menuItem = action.payload; // Update the menuItem property with the payload
    },
    setSearchItem: (state, action) => {
      state.search = action.payload;
    },
  },
});

// Extract the setMenuItem action creator from the slice
export const { setMenuItem, setSearchItem } = menuItemSlice.actions;

// Extract the reducer function from the slice
export const menuItemReducer = menuItemSlice.reducer;
