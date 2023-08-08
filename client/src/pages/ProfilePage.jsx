import React, { useEffect, useState } from "react";
import NavBar from "../components/layouts/NavBar";
import MovieBrowser from "../components/layouts/MovieBrowser";
import Trending from "../components/body/Trending";
import ProfileBanner from "../components/body/profile-page/ProfileBanner";
import { useSelector } from "react-redux";
import Publish from "../components/body/publish-page-body/Publish";
import NewPublish from "../components/layouts/publishLayout/NewPublish";
import ProfilePosts from "../components/body/profile-page/ProfilePosts";
import ProfileFavMovies from "../components/body/profile-page/ProfileFavMovies";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server";

const ProfilePage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const { userName } = useParams();
  const [posts, setPosts] = useState([]);
  const [commentsUpdate, setCommentUpdate] = useState(false);
  const [owner, setOwner] = useState(false);
  const [tempUser, setTempUser] = useState();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {

    if(!isAuthenticated) {
      navigate('/')
    }

    if (user && id === user._id) {
      setOwner(true);
    }
    getPosts();
    getProfileByiD();
  }, []);

  useEffect(() => {
    getPosts();
  }, [commentsUpdate]);

  const getPosts = async () => {
    setLoadingPosts(true);
    axios
      .post(
        `${server}/comments/get-user-posts`,
        { index: 1, userId: id },
        { withCredentials: true }
      )
      .then((res) => {
        setLoadingPosts(false);
        setPosts(res.data.data);
      })
      .catch((error) => {
        setLoadingPosts(false);

        toast.error("Something went wrong");
      });
  };

  const getProfileByiD = async () => {
    setLoadingProfile(true);
    axios
      .post(
        `${server}/user/getuser-by-id`,
        {
          id: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoadingProfile(false);
        setTempUser(res.data.user);
      })
      .catch((error) => {
        setLoadingProfile(false);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="homeScreen">
      <div className="flex justify-evenly">
        <div className="py-[30px] hidden 800px:block">
          <NavBar />
        </div>
        <div>
          <ProfileBanner userName={userName} />
          {loadingProfile ? (
            <div className="mt-[30px]">
              <div className="loader"></div>
            </div>
          ) : (
            <ProfileFavMovies userData={tempUser} owner={owner} />
          )}
          {setOwner && (
            <NewPublish
              commentsUpdate={commentsUpdate}
              setCommentUpdate={setCommentUpdate}
            />
          )}
          {loadingPosts ? (
            <div>
              <div className="loader"></div>
            </div>
          ) : (
            <ProfilePosts posts={posts} />
          )}
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

export default ProfilePage;
