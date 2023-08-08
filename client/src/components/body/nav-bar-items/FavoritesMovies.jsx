import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import FindMovie from "../../layouts/publishLayout/FindMovie";

const FavoritesMovies = ({ setOpen }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const [tempUser, setTempUser] = useState();
  const [openNewMovie, setOpenMovie] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();

  useEffect(() => {
    if(selectedMovie){
        editFavorites(selectedMovie, false);
    }
  }, [selectedMovie]);

  useEffect(() => {
    fetchUser()
  }, []);


  const fetchUser = async() =>{
    setLoaded(false);
    axios
    .post(
      `${server}/user/getuser-by-id`,
      {
        id: user._id,
      },
      { withCredentials: true }
    )
    .then((res) => {
      setLoaded(true);
      setTempUser(res.data.user);
    })
    .catch((error) => {
      setLoaded(true);
      toast.error("Something went wrong");
    });
  }

  const editFavorites = async (selectedMovie, remove) => {
    axios
      .post(
        `${server}/user/get-user-favorites`,
        {
          userId: user._id,
          movie: selectedMovie,
          remove: remove,
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

  const handleClose = (e) => {
    const clickedElementClass = e.target.className;
    if (clickedElementClass[0] === "x") {
      setOpen(false);
    }
  };

  return (
    <>
      {openNewMovie ? <FindMovie setOpenSearh={setOpenMovie} setSelectedMovie={setSelectedMovie}/> : <></>}
      <div
        onClick={(e) => {
          handleClose(e);
        }}
        className="x fixed  left-0 top-0 w-[100vw] h-[100vh] bg-[#0000006e] z-40 flex items-center justify-center rounded-md"
      >
        <div className="relative w-[90vw] 800px:w-[500px] 1100px:w-[650px] min-h-[300px] max-h-[80vh] bg-[#1b2a38] flex-col overflow-auto">
          <div className="rounded-t-sm fixed  w-[90vw] 800px:w-[500px] 1100px:w-[650px] flex justify-between items-center px-4 py-2 border-b border-solid  bg-[#1b2a38]">
            <h1 className="text-white">Favorites</h1>
            <IoMdClose
              onClick={() => {
                setOpen(false);
              }}
              size={20}
              color="#fff"
              className="cursor-pointer text-white"
            />
          </div>
          {loaded ? (
            <div>
              <div
                onClick={() => {setOpenMovie(true)}}
                className={`flex items-center justify-center my-1 border-2 border-solid border-[#f7f7f77a] cursor-pointer mt-[40px] h-[90px] py-2 px-3   hover:bg-[#233648] transition-all duration-3000 ease`}
              >
                <h1 className="text-[#f7f7f77a] font-bold mr-1">Add Film</h1>
                <AiOutlinePlus color="#f7f7f77a" />
              </div>
              {tempUser.favorites.map((movie, index) => {
                return (
                  <div
                    onClick={() => {
                      setOpen(false);
                      navigate(`/movie/${movie.title}?id=${movie.id}`);
                    }}
                    key={index}
                    className={`cursor-pointer h-[90px] py-2 px-3 flex justify-between hover:bg-[#233648] transition-all duration-3000 ease`}
                  >
                    <div className="cursor-pointer h-[100%]  flex items-left justify-center flex-col mr-2">
                      <h1 className="text-[#ffffffda] font-semibold text-sm">
                        {movie.title}
                      </h1>
                      <h1 className="font-light text-sm text-[#10ce72]">
                        {movie.vote_average}/10
                      </h1>
                    </div>
                    <img
                      className="h-[100%]"
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[300px] w-[100%] flex items-center justify-center">
              <div className="loader"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesMovies;
