import React, { useEffect, useState } from "react";
import NavBar from "../components/layouts/NavBar";
import MovieBrowser from "../components/layouts/MovieBrowser";
import Trending from "../components/body/Trending";
import MoviePageBanner from "../components/body/movie-page/MoviePageBanner";
import NewPublish from "../components/layouts/publishLayout/NewPublish";
import axios from "axios";
import { server } from "../server";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-toastify";
import MoviePosts from "../components/body/movie-page/MoviePosts";

const MoviePage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const { name } = useParams();
  const [loading, setLoading] = useState(false);
  const [commentsUpdate, setCommentUpdate] = useState(false);
  const [movie, setMovie] = useState();
  const [posts, setPosts] = useState([])


  useEffect(() => {

    setLoading(true);
    axios
      .post(
        `${server}/movies/get-movie-id`,
        {
          movieId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        setMovie(res.data.movies);
        fetchComments(1, res.data.movies.id)
      })
      .catch((error) => {
        setLoading(false);

        toast.error("Something went wrong");
      });
     
  }, [name]);

  useEffect(() => {
    fetchComments(1, parseInt(id))
  },[commentsUpdate])

  const fetchComments = async(index, id) => {
    axios
    .post(
      `${server}/comments/get-movie-posts`,
      {
        index: index,
        movieId: id
      },
      { withCredentials: true }
    )
    .then((res) => {
      setPosts(res.data.data)
    })
    .catch((err) => {
      toast.error("Something went wrong try again later");
    });
  }

  return (
    <div
    className="homeScreen">
      <div className="flex justify-evenly">
        <div className="py-[30px] hidden 800px:block">
          <NavBar />
        </div>
        <div>
          {movie && (
            <>
              <MoviePageBanner movie={movie} loading={loading} />
              <NewPublish preSelectedMovie={movie} commentsUpdate={commentsUpdate} setCommentUpdate={setCommentUpdate}/>
              {(posts.length <= 0)?
                <div className="h-[100px] flex justify-center items-center text-[#ffffffbf] bg-[#1b2a38] w-[90vw] 800px:w-[500px] 1100px:w-[650px]">
                  No comments found, be the first one!
                </div>
                :
                <MoviePosts posts={posts} />
            }
            </>
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

export default MoviePage;
