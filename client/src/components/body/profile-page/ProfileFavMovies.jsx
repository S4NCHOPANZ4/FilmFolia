import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import MovieBrowser from "../../layouts/MovieBrowser";
import FindMovie from "../../layouts/publishLayout/FindMovie";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../../server";

const ProfileFavMovies = ({ userData, owner }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [tempUser, setTempUser] = useState(userData);

  useEffect(() => {
    setTempUser(userData);
  }, [userData]);

  useEffect(() => {
    if (selectedMovie) {
      axios
        .post(
          `${server}/user/get-user-favorites`,
          {
            userId: userData._id,
            movie: selectedMovie,
            remove: false,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setTempUser(res.data.data);
        })
        .catch((err) => {
          toast.error("Something went wrong try again later");
        });
    }
  }, [selectedMovie]);

  return (
    <>
      {open ? (
        <FindMovie setOpenSearh={setOpen} setSelectedMovie={setSelectedMovie} />
      ) : null}
      <div className="w-[90vw] 800px:w-[500px] 1100px:w-[650px]  mt-[30px] rounded-sm bg-[#121c26] py-2">
        <h1 className="border-b-[#f5f5f5] w-[100%] text-[#fff] ml-4 font-normal text-[20px]">{owner? 'My': ''} Favorites</h1>
        <div className="flex flex-wrap justify-evenly items-center ">
          {tempUser &&
            tempUser.favorites.map((favorite, index) => {
              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/movie/${favorite.title}?id=${favorite.id}`)
                  }
                  className=" cursor-pointer h-[80px] w-[60px] 800px:w-[100px] 800px:h-[120px] m-2 rounded-sm border-[#386787] border-[1px]"
                >
                  <img
                    className="w-[100%] h-[100%] rounded-sm"
                    src={`https://image.tmdb.org/t/p/original/${favorite.poster_path}`}
                    alt=""
                  />
                </div>
              );
            })}
          {owner?
                    <button
                    onClick={() => {
                      setOpen(true);
                    }}
                    className="flex items-center justify-center bg-[#16222d] hover:bg-[#172330]
                transition-all duration-2000 ease
                border-[1px] border-solid rounded-sm 
                border-[#02e879]
                h-[80px] w-[60px] 800px:w-[100px] 800px:h-[120px]
                cursor-pointer m-2"
                  >
                    <IoIosAdd size={40} color="#02e879" />
                  </button>:
                  <></>
          }

        </div>
      </div>
    </>
  );
};

export default ProfileFavMovies;
