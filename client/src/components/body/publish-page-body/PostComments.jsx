import React, { useState } from "react";
import { useEffect } from "react";
import {
  BiSolidUpvote,
  BiUpvote,
  BiDownvote,
  BiSolidDownvote,
  BiComment,
} from "react-icons/bi";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const PostComments = ({ commentData }) => {
  const { user } = useSelector((state) => state.user);
  const [tempData, setTempData] = useState(commentData)
  const [loading, setLoading] = useState(false)
  const [userLikes, setUserLikes] = useState()

  useEffect(() => {
    if(tempData && user){
      for (let i = 0; i < tempData.likes.length; i++) {
        if (tempData.likes[i].user === user._id) {
          setUserLikes(tempData.likes[i])
        }
      }
    }
  },[tempData])



  const sendLike = (like) =>{
    setLoading(true)
    axios
    .post(
      `${server}/comments/interact-sub-comments`,
      {
        comment_id: commentData._id,
        like: like,
        user: user
      },
      { withCredentials: true }
    )
    .then((res) => {
      setLoading(false)
      setTempData(res.data.data.interactions.comments[res.data.index])
    })
    .catch((err) => {
      setLoading(false)
      toast.error('Something went wrong')

    });
  }


  return (
    <div className="800px:w-[500px] 1100px:w-[650px] bg-[#1b2a38] rounded-md px-2">
      <div className="w-[100%] flex mt-3 justify-start pl-4 pt-2">
        <h1 className="text-[#fbfbfb] font-light italic">
          @{tempData.userName}
        </h1>
      </div>
      <div className="w-[100%] px-4 min-h-[70px] flex items-center">
        <h1 className="text-[#f0f0f0c4]">
            {tempData.comments}
        </h1>
      </div>
      <div className="x py-1 px-1 border-t border-solid border-[#f5f5f551] mt-1 flex  justify-end items-center">


          <div className="flex bg-[#15202c7c] px-1 rounded-sm">
            {loading && (
              <div className="x p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
                <div className="loader_mini" />
              </div>
            )}
            <div className="x p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
              {(userLikes && userLikes.like && userLikes.clicked) ? (
                <div>
                  <BiSolidUpvote
                    className="x"
                    color="#d67e1f"
                    size={25}
                    onClick={() => sendLike(true)}
                  />
                </div>
              ) : (
                <BiUpvote
                  className="x"
                  color="white"
                  size={25}
                  onClick={() => sendLike(true)}
                />
              )}
            </div>
            <div className="p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
              <h1 className="x text-[#c7c7c785] font-semibold">
                {tempData.interactions_likes}
              </h1>
            </div>
            <div className="x p-1 hover:bg-[#192431] rounded-[50%] mr-1 transition-all duration-2300 ease cursor-pointer">
          
              {(userLikes && !userLikes.like && userLikes.clicked )? (
                <BiSolidDownvote
                  className="x"
                  color="#266cc2"
                  size={25}
                  onClick={() => sendLike(false)}
                />
              ) : (
                <BiDownvote
                  className="x"
                  color="white"
                  size={25}
                  onClick={() => sendLike(false)}
                />
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default PostComments;
