import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../Posts";
import { server } from "../../../server";
import axios from "axios";
import PostComments from "./PostComments";
import { useSelector } from "react-redux";
import Registration from "../../../pages/Registration/Registration";

const Publish = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { id } = useParams();
  const [postData, setPostData] = useState();
  const [loading, setLoding] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  useEffect(() => {
    if(!isAuthenticated) {
      setOpenLogin(true)
    }
    setLoding(true);
    fetchPostData();
  }, []);

  useEffect(() => {
    fetchPostData();
  }, [postData]);

  const fetchPostData = () => {
    axios
      .post(
        `${server}/comments/get-one-post`,
        {
          id: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoding(false);
        setPostData(res.data.publish);
      })
      .catch((err) => {
        setLoding(false);
        toast.error("Something went wrong try again later");
      });
  };

  return (
    <>
      {
        openLogin &&
        <Registration setOpen={setOpenLogin}/>}
      <div className="flex flex-col">
        {!loading ? (
          <>
            {postData ? (
              <Posts postData={postData} clikeable={false} />
            ) : (
              <div className="800px:w-[500px] 1100px:w-[650px] bg-[#1b2a38] rounded-md px-2 flex items-center justify-center">
                <div className="loader_mini"></div>
              </div>
            )}
            {postData ? (
              postData.interactions.comments.map((comment, index) => {
                return (
                  <div key={index}>
                    <PostComments commentData={comment} />
                  </div>
                );
              })
            ) : (
              <div className="800px:w-[500px] 1100px:w-[650px] bg-[#1b2a38] rounded-md px-2 flex items-center justify-center">
                <div className="loader_mini"></div>
              </div>
            )}
          </>
        ) : (
          <div className="800px:w-[500px] 1100px:w-[650px] bg-[#1b2a38] rounded-md px-2 flex items-center justify-center ">
            <div className="loader_mini"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Publish;
