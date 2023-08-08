import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BiSolidUpvote,
  BiUpvote,
  BiDownvote,
  BiSolidDownvote,
  BiComment,
} from "react-icons/bi";
import { LiaCommentAlt } from "react-icons/lia";
import { toast } from "react-toastify";
import { server } from "../../server";
import CommetPost from "./CommetPost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Registration from "../../pages/Registration/Registration";

const Posts = ({ postData, clikeable}) => {
  const { user } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [postDate, setPostDate] = useState();
  const [postTemp, setPostTemp] = useState(postData);
  const [commentsLength, setCommentsLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [userLikes, setUserLikes] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setPostTemp(postData);
    setPostDate(formatDate(postData.createdAt));
    setCommentsLength(postData.interactions.comments.length);
  }, [postData]);

  useEffect(() => {
    if(postTemp && user){
      for (let i = 0; i < postTemp.interactions.likes.length; i++) {
        if (postTemp.interactions.likes[i].user === user._id) {
          setUserLikes(postTemp.interactions.likes[i])
        }
      }
    }
  },[postTemp])

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  const sendLike = (like) => {
    setLoading(true);
    axios
      .post(
        `${server}/comments/interact-like`,
        {
          postId: postData._id,
          like: like,
          user: user

        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        setPostTemp(res.data.data);

      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong try again later");
      });
  };

  const openPost = (e) => {
    const clickedElementClass = e.target.className;
    if (clickedElementClass[0] === "x") {
      return
    } 
      navigate(`/publish/${postData._id}`);
  };

  return (
    <>
      {openLogin &&
      <Registration setOpen={setOpenLogin}/>
      }
      {commentOpen && (
        <CommetPost
          setCommentOpen={setCommentOpen}
          postId={postData._id}
          setCommentsLength={setCommentsLength}
          commentsLength={commentsLength}
        />
      )}
      <div className={` cursor-pointer my-[30px] flex flex-col w-[90vw]  800px:w-[500px] 1100px:w-[650px] bg-[#1b2a38] relative rounded-md px-5`}>
        <div className="w-[100%] flex mt-3 justify-between">
          <div className="flex">
            <h1 
              onClick={()=>{
                navigate(`/profile/${postTemp.user.name}?id=${postTemp.user._id}`)
              }}
             className="x text-[#fbfbfb] font-light italic ">
              @{postTemp && postTemp.user.name}
            </h1>
            <h1 
            onClick={()=>navigate(`/movie/${postTemp.movie.title}?id=${postTemp.movie.id}`)}
            className="x text-[#fbfbfb] font-light italic">
              , {postTemp && postTemp.movie.title}
            </h1>
          </div>
          <h1 className="text-[#fbfbfb97] font-light italic text-sm">
            {postDate}
          </h1>
        </div>
        <div
          onClick={(e) => {
            openPost(e);
          }}
          className={`${clikeable? '': 'x'} flex items-center justify-between w-100% my-2`}
        >
          <div className={`${clikeable? '': 'x'} w-[70%] pr-1`}>
            <h1 className={`${clikeable? '': 'x'} text-[#f0f0f0c4]`}>{postTemp && postTemp.comment}</h1>
          </div>
          <img
            onClick={()=>navigate(`/movie/${postTemp.movie.title}?id=${postTemp.movie.id}`)}
            className="x w-[110px] h-[130px]  cursor-pointer rounded-sm"
            src={`https://image.tmdb.org/t/p/original/${postTemp.movie.poster_path}`}
            alt=""
          />
        </div>
        <div className="x py-1 border-t border-solid border-[#f5f5f551] mt-1 flex  justify-between items-center">
          <div
            onClick={() => {
              if(!isAuthenticated){
                setOpenLogin(true)
              }else{
                setCommentOpen(true)
              }
            }}
            className="x py-1 px-2 bg-[#192431] hover:bg-[#192431] rounded-md mr-1 transition-all duration-2300 ease cursor-pointer flex"
          >
            <LiaCommentAlt className="x" color="white" size={25} />
            <h1 className="x pl-2 text-[#c7c7c785] font-semibold">
              {commentsLength}
            </h1>
          </div>
          <div className="flex bg-[#15202c7c] px-1 rounded-sm">
            {loading && (
              <div className="x p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
                <div className="loader_mini" />
              </div>
            )}
            <div 
            className="
            x p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
              {userLikes && userLikes.like && userLikes.clicked ? (
                <div>
                  <BiSolidUpvote
                    className="x"
                    color="#d67e1f"
                    size={25}
                    onClick={() => {
                      if(!isAuthenticated){
                        setOpenLogin(true)
                      }else{
                        sendLike(true)
                      }
                    }}
                  />
                </div>
              ) : (
                <BiUpvote
                  className="x"
                  color="white"
                  size={25}
                  onClick={() => {
                    if(!isAuthenticated){
                      setOpenLogin(true)
                    }else{
                      sendLike(true)
                    }
                  }}
                />
              )}
            </div>
            <div className="p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
              <h1 className="x text-[#c7c7c785] font-semibold">
                {postTemp.interactions.interactions_likes}
              </h1>
            </div>
            <div className="x p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
              {(userLikes && !userLikes.like && userLikes.clicked) ? (
                <BiSolidDownvote
                  className="x"
                  color="#266cc2"
                  size={25}
                  onClick={() => {
                    if(!isAuthenticated){
                      setOpenLogin(true)
                    }else{
                      sendLike(false)
                    }
                  }}
                />
              ) : (
                <BiDownvote
                  className="x"
                  color="white"
                  size={25}
                  onClick={() => {
                    if(!isAuthenticated){
                      setOpenLogin(true)
                    }else{
                      sendLike(false)
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
