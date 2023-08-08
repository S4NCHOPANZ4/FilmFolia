import React from "react";
import NavBar from "../components/layouts/NavBar";
import NewPublish from "../components/layouts/publishLayout/NewPublish";
import HomePosts from "../components/body/HomePosts";
import MovieBrowser from "../components/layouts/MovieBrowser";
import Trending from "../components/body/Trending";
import Publish from "../components/body/publish-page-body/Publish.jsx";
import { useSelector } from "react-redux";

const PublishPage = () => {

  const { loading, isAuthenticated } = useSelector((state) => state.user);


  return (
    <div className="homeScreen">
      <div className="flex justify-evenly">
        <div className="py-[30px] hidden 800px:block">
          <NavBar />
        </div>
        <div>
            <Publish/>
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

export default PublishPage;
