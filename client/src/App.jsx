import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreenPage from "./pages/HomeScreenPage";
import LoginPage from "./pages/Registration/LoginPage.jsx";
import SignUpPage from "./pages/Registration/SignUpPage";
import PublishPage from "./pages/PublishPage";
import Activation from "./pages/Activation";
import MoviePage from "./pages/MoviePage.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { loadUser } from "./redux/actions/user";
import Store from "./redux/store.js";

import "./index.css";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    Store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back!");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen min-w-screen bg-[#172430]">
      {loading ? (
        <div className="bg-[#1b2a38] h-screen w-screen flex flex-col justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <BrowserRouter>

          <Routes>
            <Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/publish/:id" element={<PublishPage/>}/>
              <Route path="/activation/:url" element={<Activation />} />
              <Route path="/movie/:name" element={<MoviePage/>}/>
              <Route path="/profile/:userName" element={<ProfilePage/>}/>
              <Route path="/" element={<HomeScreenPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
