import React, { useEffect, useState } from "react";
import axios from "../../axios/axios";
import requests from "../../axios/Requests";

//sass
import "../../styles/body/rows.scss";

const Row = ({ title, fetchUrl, isLarge }) => {
  const base_url = "https://image.tmdb.org/t/p/original/";

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    };

    fetchData();
  }, [fetchUrl]);

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies?.map((movie, index) => {
          return (
            <img
              key={index}
              src={`${base_url}${
                isLarge ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
              className={`row_poster ${isLarge && "row_posterLarge"}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Row;
