import React, { useEffect, useState } from "react";
import Navbar from "../components/layouts/Navbarold";
import Row from "../components/body/Row";
import Banner from "../components/body/Banner";
import requests from "../axios/Requests";
import axios from "axios";
import { server } from "../server";

import "../styles/homeScreen/index.scss";
import styles from "../styles/styles";
import NewPublish from "../components/layouts/publishLayout/NewPublish";
import Trending from "../components/body/Trending";
import MovieBrowser from "../components/layouts/MovieBrowser";
import NavBar from "../components/layouts/NavBar";
import HomePosts from "../components/body/HomePosts";
import { useDispatch, useSelector } from "react-redux";
import { AllPosts } from "../redux/actions/allPosts";

const HomeScreenPage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const allPosts = useSelector((state) => state.allPostsReducer);
  const dispatch = useDispatch();

  
  return (
    <div className="homeScreen">
      <div className="flex justify-evenly">
        <div className="py-[30px] hidden 800px:block">
          <NavBar />
        </div>
        <div>
          <NewPublish />
          <HomePosts/>
        </div>
        <div className=" py-[20px] w-[300px] pl-1 pr-1 800px:block hidden">
          <MovieBrowser />
          <Trending />
        </div>
      </div>
      <div className="py-[30px] block 800px:hidden">
        <NavBar />
      </div>
    </div>
  );
};

export default HomeScreenPage;
