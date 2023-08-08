import { createReducer } from "@reduxjs/toolkit";
import { ChangePage } from "../actions/page";


const initialState = {
    page: 'home',
  };
  
  // Reducer
  const pageReducer = createReducer(initialState, (builder) => {
    builder
      .addCase(ChangePage, (state, action) => {
        state.page = action.payload;
      })

  });
  
  export default pageReducer;