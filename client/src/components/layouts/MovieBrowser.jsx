import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/styles";
import { AiOutlineSearch } from "react-icons/ai";
import { GoImage } from "react-icons/go";
import axios from "axios";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";

const MovieBrowser = () => {
  const componentRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [moviesSearch, setMoviesSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div ref={componentRef} className="w-[100%] relative">
      <input
        onFocus={() => setIsFocused(true)}
        placeholder="Search Film"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className={`
        pl-5 pr-9 py-3 rounded-[50px] bg-[#1b2a38] w-[100%] ${styles.input} 
        ${
          isFocused
            ? "border border-solid border-[#10ce72]"
            : "border border-solid border-[#ffffff00]"
        }
        `}
      />
      <AiOutlineSearch
        color={isFocused ? "#10ce72" : "#2a4258"}
        size={25}
        className="absolute right-3 top-[25%] "
      />
      {isFocused && search.length > 0 ? (
        <div
          style={{
            boxShadow:
              "rgba(16, 206, 114, 0.05) 0px 6px 24px 0px, rgba(16, 206, 114, 0.08) 0px 0px 0px 1px",
          }}
          className="absolute w-[100%] top-[120%] bg-[#131e28]  rounded-md overflow-hidden z-20"
        >
          {moviesSearch.map((movie, index) => {
            if (movie.movie.release_date === "") {
              return;
            }
            return (
              <div
                key={index}
                className="hover:bg-[#172430] p-2 cursor-pointer transition-all duration-2000 ease w-[100%]"
              >
                {!loading ? (
                  <div
                    onClick={() => {
                      navigate(
                        `/movie/${movie.movie.title}?id=${movie.movie.id}`
                      );
                    }}
                    className="flex items-center max-w-[100%]"
                  >
                    <div className="relative h-[70px] w-[60px] ">
                      <img
                        className="h-[100%] w-[100%] absolute z-20 rounded-sm transition-all duration-500 ease"
                        src={`https://image.tmdb.org/t/p/original/${movie.movie.poster_path}`}
                        style={{ opacity: 0 }}
                        onLoad={(e) => (e.target.style.opacity = 1)}
                        onError={(e) => (e.target.style.display = "none")}
                        alt=""
                      />
                      <div
                        className="
                      flex items-center justify-center 
                      absolute right-[1%] top-[1%] h-[99%] w-[99%] border-[2px] border-[#375776] border-solid rounded-sm z-10"
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
      ) : null}
    </div>
  );
};

export default MovieBrowser;
