import React, { useEffect, useState } from "react";
import FindMovie from "./FindMovie";
import styles from "../../../styles/styles";
import { IoIosAdd } from "react-icons/io";
import MovieBrowser from "../MovieBrowser";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AllPosts, IndexFetch } from "../../../redux/actions/allPosts";

const NewPublish = ({
  preSelectedMovie = null,
  setCommentUpdate = null,
  commentsUpdate = null,
  setCommentSent = null,
  noBrowser= false
}) => {
  const allPosts = useSelector((state) => state.allPostsReducer);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const IndexFetchData = useSelector((state) => state.indexFetchReducer);
  const dispatch = useDispatch();

  const [openSearh, setOpenSearh] = useState(false);
  const [publishText, setPublishText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState();
  const [noFilm, setNoFilm] = useState(false);
  const [fetchSkip, setFetchSkip] = useState(0);

  useEffect(() => {
    if (preSelectedMovie) {
      setSelectedMovie(preSelectedMovie);
    }
  }, [preSelectedMovie]);

  const sendComment = async () => {

    if(!isAuthenticated){
      
    }

    if (commentsUpdate !== null) {
      setCommentUpdate(!commentsUpdate);
    }

    if (selectedMovie === undefined && publishText.length <= 0) {
      if (selectedMovie === undefined) {
        setNoFilm(true);
        return;
      }
    }

    await axios
      .post(
        `${server}/comments/create-post`,
        {
          comment: publishText,
          user: user,
          movie: selectedMovie,
          createdAt: new Date(),
        },
        { withCredentials: true }
      )
      .then((res) => {
        if(setCommentSent){
          setCommentSent(true)
        }
        axios
          .post(
            `${server}/comments/get-one-post`,
            {
              id: res.data.publish._id,
            },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(AllPosts([res.data.publish, ...allPosts]));

            setPublishText("");
            setSelectedMovie();
          })
          .catch((err) => {
            toast.error("Something went wrong try again later");
          });
      })
      .catch((err) => {
        if(setCommentSent){
          setCommentSent(true)
        }
        console.log(err);
      });
  };

  return (
    <>
      <div className="mt-[10px] block 800px:hidden">
        {noBrowser?
        <></>
        :
        <MovieBrowser />
        }
      </div>
      {openSearh ? (
        <FindMovie
          setOpenSearh={setOpenSearh}
          setSelectedMovie={setSelectedMovie}
        />
      ) : null}
      <div
        className="my-[30px] flex flex-col w-[90vw]  800px:w-[500px] 1100px:w-[650px] bg-[#1b2a38] relative rounded-md p-5 "
      >
        <div className="flex items-center justify-between border-b border-solid border-[#10ce72] pb-3">
          <textarea
            placeholder="What's on your mind?"
            type="text"
            className={`${styles.input} 800px:h-[100px] h-[90px] bg-[#1b2a38] text-lg resize-none pr-[5px] border-none`}
            onChange={(e) => {
              if (e.target.value.length <= 280) {
                setPublishText(e.target.value);
              } else {
                return;
              }
            }}
            value={publishText}
          />
          {selectedMovie ? (
            <img
              onClick={() => setOpenSearh(true)}
              className="w-[110px] h-[120px]  cursor-pointer rounded-sm"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt=""
            />
          ) : (
            <div
              className={`flex items-center justify-center bg-[#1b2a38] hover:bg-[#273c51]
            transition-all duration-2000 ease
           border-[1px] ${
             noFilm ? "border-[#e80202]" : "border-[#02e879]"
           } border-solid rounded-sm 
           h-[90px] w-[80px]
            800px:h-[120px]  800px:w-[110px]
           cursor-pointer 
           `}
              onClick={() => setOpenSearh(true)}
            >
              <IoIosAdd size={40} color={noFilm ? "#e80202" : "#02e879"} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => sendComment()}
            className={`${styles.button} font-bold text-white bg-[#02e879] hover:bg-[#10ce72] w-[100px] rounded-[25px] py-2`}
          >
            Publish
          </button>
        </div>
        <p className="text-[#02e879] font-light absolute bottom-4 right-4">
          {publishText.length}/280
        </p>
      </div>
    </>
  );
};

export default NewPublish;
