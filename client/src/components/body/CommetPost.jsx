import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const CommetPost = ({ setCommentOpen, postId, setCommentsLength, commentsLength }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const handleClose = (e) => {
    const clickedElementClass = e.target.className;
    if (clickedElementClass[0] === "x") {
      setCommentOpen(false);
    }
  };

  const commentPost = () => {


    setLoading(true);
    axios
      .post(
        `${server}/comments/interact-comments`,
        {
          postId: postId,
          comment: message,
          userId: user._id,
          userName: user.name,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        setCommentOpen(false)
        setCommentsLength(commentsLength + 1)
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong try again later");
      });
  };

  return (
    <div
      onClick={(e) => handleClose(e)}
      className="x left-0 top-0 fixed h-screen w-screen bg-[#0000007f] z-30 flex items-start justify-center"
    >
      <div className="800px:w-[500px] w-[85%] bg-[#1b2a38] mt-[100px] p-2 rounded-md">
        <div
          onClick={() => setCommentOpen(false)}
          className="cursor-pointer hover:bg-[#213344] w-6 h-6 rounded-[50%] p-1 flex items-center justify-center"
        >
          <AiOutlineClose color="white" size={40} />
        </div>
        <textarea
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              setMessage(e.target.value);
            } else {
              return;
            }
          }}
          placeholder="Your comment..."
          className={`w-[100%] h-[100px] resize-none mt-1 outline-none focus-none ${styles.input} bg-transparent`}
          name=""
          id=""
        ></textarea>
        <div className="flex justify-between items-center border-t border-solid border-[#10ce72]">
          <h1 className="text-[#02e879] font-light">{message.length}/200</h1>
          <button
            onClick={() => commentPost()}
            className={`${styles.button} font-bold text-white text-[15px] bg-[#02e879] hover:bg-[#10ce72] w-[70px] rounded-[25px] py-1`}
          >
            {loading ? <div className="loader_mini"></div> : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommetPost;
