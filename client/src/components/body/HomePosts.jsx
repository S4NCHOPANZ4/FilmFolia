import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AllPosts, IndexFetch } from "../../redux/actions/allPosts";
import { server } from "../../server";
import { toast } from "react-toastify";
import { VscAdd } from "react-icons/vsc";
import Posts from "./Posts";

const HomePosts = () => {
  const allPosts = useSelector((state) => state.allPostsReducer);
  const IndexFetchData = useSelector((state) => state.indexFetchReducer);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [fetchSkipIndex, setFetchSkipIndex] = useState(0);
  const [fullFeed, setFullFeed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [morepostloaded, setMorePostloaded] = useState(true)

  useEffect(() => {
    setLoaded(false);
    axios
      .post(
        `${server}/comments/get-posts`,
        {
          index: 1,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoaded(true);

        dispatch(AllPosts(res.data.data));
      })
      .catch((err) => {
        setLoaded(true);
        setError(true);
      });
  }, []);

  const loadMorePosts = () => {
    dispatch(IndexFetch(IndexFetchData + 1));

    const tempFetchSkipIndex = IndexFetchData + 1;
    setMorePostloaded(false)
    axios
      .post(
        `${server}/comments/get-posts`,
        {
          index: tempFetchSkipIndex,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setMorePostloaded(true)

        if (res.data.data.length <= 0) {
          setFullFeed(true);
          return;
        }
        console.log(res.data.data);
        const preSortedData = [...allPosts, ...res.data.data];
        dispatch(AllPosts(preSortedData));
      })
      .catch((err) => {
        setMorePostloaded(true)

        console.log(err);
        toast.error("Something went wrong try again later");
        setError(true);
      });
  };

  return (
    <>
    {loaded?

      <div>
        {allPosts &&
          allPosts.map((post, index) => {
            return (
              <div key={index}>
                <Posts postData={post} clikeable={true} />
              </div>
            );
          })}
        {!error && !fullFeed && (
          <div className="w-[100%] flex justify-center items-center my-5">
            <button
              onClick={() => loadMorePosts()}
              className="flex justify-center items-center p-1 hover:bg-[#222f44] rounded-[50%] transition-all duration-2300 ease"
              >
                {
                  morepostloaded?
                  <VscAdd size={30} color="#10ce72" className="flex justify-center items-center"/>
                  :
                <div className="loader_mini"></div>

                }
            </button>
          </div>
        )}
      </div>
      :
      <div className="loader"></div>
      }
    </>
  );
};

export default HomePosts;
