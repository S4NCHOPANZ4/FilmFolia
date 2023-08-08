import { createReducer } from "@reduxjs/toolkit";
import { openRegister, closeRegister } from "../actions/register";

const initialState = {
  isOpend: false,
};

// Reducer
const registerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(openRegister, (state) => {
      state.isOpend = true;
    })
    .addCase(closeRegister, (state) => {
      state.isOpend = false;
    });
});

export default registerReducer;