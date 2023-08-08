import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../../server";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const TrendingMenu = ({ setOpen }) => {
  const navigate = useNavigate()
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    axios
      .get(`${server}/movies/search-trending`)
      .then((res) => {
        setTrendingMovies(res.data.movies);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClose = (e) => {
    const clickedElementClass = e.target.className;
    if (clickedElementClass[0] === "x") {
      setOpen(false);
    }
  };

  return (
    <div onClick={(e)=>{handleClose(e)}} className="x fixed  top-0 w-[100vw] h-[100vh] bg-[#0000006e] z-40 flex items-center justify-center rounded-md">
      <div className="relative w-[90vw] 800px:w-[500px] 1100px:w-[650px] min-h-[300px] max-h-[80vh] bg-[#1b2a38] flex-col overflow-y-scroll">
      <div className="rounded-t-sm fixed  w-[90vw] 800px:w-[500px] 1100px:w-[650px] flex justify-between items-center px-4 py-2 border-b border-solid  bg-[#1b2a38]">
              <h1 className="text-white">Popular</h1>
              <IoMdClose
                onClick={()=>{
                  setOpen(false)
                }}
                size={20}
                color="#fff"
                className="cursor-pointer text-white"
              />
            </div>
        {loaded ? (
          <div>

            {trendingMovies.map((movie, index) => {
              return (
                <div
                  onClick={() => {
                    setOpen(false)
                    navigate(`/movie/${movie.title}?id=${movie.id}`);
                  }}
                  key={index}
                  className={`cursor-pointer ${
                    index === 0 ? "mt-[40px]" : ""
                  } h-[90px] py-2 px-3 flex justify-between hover:bg-[#233648] transition-all duration-3000 ease`}
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
  );
};

export default TrendingMenu;
