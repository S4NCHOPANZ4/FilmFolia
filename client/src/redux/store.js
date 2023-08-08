import { configureStore } from '@reduxjs/toolkit';
import {userReducer} from "./reducers/user.js"
import registerReducer from "./reducers/register.js"
import pageReducer from "./reducers/page.js"
import  {allPostsReducer, indexFetchReducer} from './reducers/allPosts.js';

const Store = configureStore({
    reducer:{
        user: userReducer,
        openRegister: registerReducer,
        pageReducer: pageReducer,
        allPostsReducer: allPostsReducer,
        indexFetchReducer: indexFetchReducer
    },
});

export default Store; 