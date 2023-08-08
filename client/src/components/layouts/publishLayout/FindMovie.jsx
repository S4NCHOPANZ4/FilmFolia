import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { GoImage } from "react-icons/go";
import { server } from "../../../server";
import styles from "../../../styles/styles";

const FindMovie = ({ setOpenSearh, setSelectedMovie}) => {
  const inputRef = useRef(null);

  const [moviesSearch, setMoviesSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post(`${server}/movies/search-movies`, { search: search })
      .then((res) => {
        setMoviesSearch(res.data.movies);
        setLoading(false);
        if (res.data.movies <= 0 && search.length > 0) {
          setNotFound(true);
        } else {
          setNotFound(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [search]);

  const handleClose = (e) => {
    const clickedElementClass = e.target.className;
    if (clickedElementClass[0] === "x") {
      setOpenSearh(false);
    }
  };
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      onClick={handleClose}
      className="x left-0 top-0 fixed h-screen w-screen bg-[#0000007f] z-50 flex items-start justify-center"
    >
      <div className="x flex items-center justify-center flex-col w-screen">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Film name"
          className={`${styles.input} mt-[100px] 800px:w-[500px] w-[85%] text-md p-2 border-[#ffffff3f] border-[1px] border-solid`}
        />
        <div className="bg-[#1b2a38] 800px:w-[500px] w-[85%]">
          
          {moviesSearch.map((movie, index) => {

            
            return (
              <div key={index} className=" hover:bg-[#2a4056] p-1 cursor-pointer transition-all duration-2000 ease 800px:w-[500px] w-[80%]">
                {!loading ? (
                  <div 
                  onClick={() => {
                    setOpenSearh(false)
                    setSelectedMovie(movie.movie)
                  }}
                  className="flex items-center w-[100%]"> {/* <---- */}
                   
                    <div className="relative h-[70px] w-[60px] ">
                      <img
                        className="h-[100%] w-[100%] absolute z-30 rounded-sm transition-all duration-500 ease"
                        src={`https://image.tmdb.org/t/p/original/${movie.movie.poster_path}`}
                        style={{ opacity: 0 }}
                        onLoad={(e) => (e.target.style.opacity = 1)}
                        onError={(e) => (e.target.style.display = "none")}
                        alt=""
                      />
                      <div
                        className="
                      flex items-center justify-center 
                      absolute right-[1%] top-[1%] h-[99%] w-[99%] border-[2px] border-[#375776] border-solid rounded-sm z-20"
                      >
                        <GoImage color="#375776" size={30} />
                      </div>
                    </div>
                    <div className="ml-[5%] text-white">
                      <h1>{movie.movie.title}</h1>
                      <p className="font-light text-sm">
                        {movie.movie.release_date}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="
                    flex items-center justify-center 
                    h-[70px]  rounded-sm z-10"
                  >
                    <div className="loader"></div>
                  </div>
                )}
              </div>
            );
          })}
          {notFound ? (
            <div className="h-[80px] flex justify-center items-center text-white font-light">
              No films found
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FindMovie;
