import { createReducer } from "@reduxjs/toolkit";
import { AllPosts,IndexFetch } from "../actions/allPosts";


const initialState = {
    posts: [],
    fetchIndex: 1
  };
  
  // Reducer
  export const allPostsReducer = createReducer(initialState.posts, (builder) => {
    builder
      .addCase(AllPosts, (state, action) => {
        return action.payload;
      })

  });
  
  export const indexFetchReducer = createReducer(initialState.fetchIndex, (builder) => {
    builder
      .addCase(IndexFetch, (state, action) => {
        return action.payload;
      })

  });
  