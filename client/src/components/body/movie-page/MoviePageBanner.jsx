import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { server } from "../../../server";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Registration from "../../../pages/Registration/Registration";

const MoviePageBanner = ({ movie, loading }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const [tempUser, setTempUser] = useState();
  const [registered, setRegistered] = useState(false);
  const [loadedImg, setLoadedImg] = useState(false);
  const [openRegistration, setOpenRegistration] = useState(false);

  useEffect(() => {
    setTempUser(user);
  }, []);

  useEffect(() => {
    if (tempUser) {
      const registered = tempUser.favorites.some(
        (element) => element.id === movie.id
      );
      setRegistered(registered);
    }
  }, [tempUser, movie]);

  const manageFavorites = async (interaction) => {
    axios
      .post(
        `${server}/user/get-user-favorites`,
        {
          userId: user._id,
          movie: movie,
          remove: interaction,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setTempUser(res.data.data);
      })
      .catch((err) => {
        toast.error("Something went wrong try again later");
      });
  };

  return (
    <>
    {openRegistration &&
    <Registration setOpen={setOpenRegistration}/>
    }
      {loading ? (
        <div className="relative flex items-center justify-center 800px:w-[500px] 1100px:w-[650px] w-[90vw] h-[230px] 1100px:h-[300px] 500px:h-[240px] bg-[#101922]  z-30 rounded-b">
          <div className="loader"></div>
        </div>
      ) : movie ? (
        <div className="relative 800px:w-[500px] 1100px:w-[650px] w-[90vw] h-[230px] 1100px:h-[300px] 500px:h-[240px] bg-[#0d151c]  z-30 rounded-b ">
          <div className="absolute z-20 bg-[#1a1a1abd] w-[100%] h-[100%] rounded-b"></div>
          <img
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            style={{
              opacity: 0,
            }}
            onLoad={(e) => (e.target.style.opacity = 1)}
            onError={(e) => (e.target.style.display = "none")}
            alt=""
            className="absolute z-10 h-[100%] w-[100%] rounded-b"
          ></img>
          <div className="z-20 absolute bottom-2 left-2 flex justify-start items-end ">
            {!loadedImg && (
              <div className="h-[150px] 800px:h-[200px] w-[120px] bg-[#12142150] flex items-center justify-center">
                <div className="loader"></div>
              </div>
            )}
            <img
              style={{
                display: "none",
              }}
              onLoad={(e) => {
                setLoadedImg(true);
                e.target.style.display = "block";
              }}
              onError={(e) => (e.target.style.display = "none")}
              className="h-[150px] 800px:h-[200px]"
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt=""
            />
            <div className="ml-2 max-w-[60%] max-h-[150px] rounded-md p-2 overflow-hidden hidden 1100px:block">
              <h1 className="text-white font-light">{movie.overview}</h1>
            </div>
          </div>

          {isAuthenticated ? (
            <>
              {registered ? (
                <div
                  className="absolute z-20  bottom-2 right-2 cursor-pointer"
                  onClick={() => {
                    manageFavorites(true);
                  }}
                >
                  <AiFillStar size={30} color="#FFD000" />
                </div>
              ) : (
                <div
                  className="absolute z-20  bottom-2 right-2 cursor-pointer"
                  onClick={() => {
                    manageFavorites(false);
                  }}
                >
                  <AiOutlineStar size={30} color="#fff" />
                </div>
              )}
            </>
          ) : (
            <div
              className="absolute z-20  bottom-2 right-2 cursor-pointer"
              onClick={() => {
                setOpenRegistration(true)
              }}
            >
              <AiOutlineStar size={30} color="#fff" />
            </div>
          )}
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </>
  );
};

export default MoviePageBanner;
