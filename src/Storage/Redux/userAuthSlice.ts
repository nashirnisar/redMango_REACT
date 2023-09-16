// Import the createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import { userModel } from "../../Interfaces";

// Define the initial state for the slice
export const emptyState: userModel = {
  fullName: "",
  id: "",
  email: "",
  role: "",
};

// Create a Redux slice named userAuthSlice
export const userAuthSlice = createSlice({
  name: "UserAuth", // Name of the slice
  initialState: emptyState, // empty state with no values
  reducers: {
    setLoggedInUser: (state, action) => {
      // Reducer function to set the userAuth property
      return {
        ...state, // Spread the current state to preserve other properties
        fullName: action.payload.fullName,
        id: action.payload.id,
        email: action.payload.email,
        role: action.payload.role,
      };
    },
  },
});

// Extract the setLoggenInUser action creator from the slice
export const { setLoggedInUser } = userAuthSlice.actions;

// Extract the reducer function from the slice
export const userAuthReducer = userAuthSlice.reducer;
