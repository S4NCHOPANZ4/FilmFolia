import React, { useEffect, useState } from "react";
import {FaListUl} from 'react-icons/fa'
import {BiPlay} from 'react-icons/bi'
import axios from '../../axios/axios'
import requests from "../../axios/Requests";
//scss
import "../../styles/body/banner.scss";

const Banner = () => {

    const [movie, setMovie] = useState([])

    useEffect(()=>{
       const fetchData =  async () =>{
          const request = await axios.get(requests.fetchNetflixOriginals);
          setMovie(request.data.results[
            Math.floor(Math.random() * request.data.results.length - 1)
          ])
          return request
       }
       fetchData()
    },[])

    console.log(movie);

    const truncate = (string, end) =>{
        return string?.length > end? string.substr(0, end - 1)+ '...' : string
    }

  return (
    <div
      className="banner"
      style={{
        backgroundPosition: "100% 30%",
        backgroundSize: "cover",
        backgroundImage:
          `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
      }}
    >
      <div className="banner_contents">
        <h1 className="banner_title">{movie?.name}</h1>
        <div className="banner_buttons">
          <button className="banner_button"><BiPlay className="button-icon"/> Play </button>
          <button className="banner_button"><FaListUl className="button-icon"/> My List </button>
        </div>
        <h1 className="banner_description">
            {truncate(movie?.overview
          , 150
          )}
      
        </h1>
      </div>

    </div>
  );
};

export default Banner;
