import React, { useEffect, useState } from 'react'
import { server } from "../../server";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Trending = () => {

    const [tendingMovies, setTrendingMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        setLoading(true);
        axios
        .get(`${server}/movies/search-trending`)
        .then((res) => {
            setTrendingMovies(res.data.movies)
            setLoading(false)
        })
        .catch((error) => {
            console.log(error);
        });
    },[])

  return (
    <div className='sticky top-2 bg-[#1b2a38] rounded-md overflow-hidden mt-[30px] w-[100%]'>
        <h1 className='p-3 font-bold text-2xl text-[#ffffffda]'>Popular</h1>
        {
           tendingMovies?  tendingMovies.map((movie, index)=>
           {
            return(

                <div 
                onClick={()=>{
                    navigate(`/movie/${movie.title}?id=${movie.id}`)
                }}
                key={index} className='cursor-pointer  h-[90px] py-2 px-3 flex justify-between hover:bg-[#233648] transition-all duration-3000 ease'>
                    <div className='cursor-pointer h-[100%]  flex items-left justify-center flex-col mr-2'>
                        <h1 className='text-[#ffffffda] font-semibold text-sm'>{movie.title}</h1>
                        <h1 className='font-light text-sm text-[#10ce72]' >{movie.vote_average}/10</h1> 
                    </div>
                    <img 
                    className='h-[100%]'
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" />
                </div>
                )
           }) : null
        }
    </div>
  )
}

export default Trending