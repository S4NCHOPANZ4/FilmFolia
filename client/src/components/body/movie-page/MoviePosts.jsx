import axios from "axios";
import React from "react";
import Posts from "../Posts";

const MoviePosts = ({ posts }) => {
  return (
    <div>
      {posts &&
        posts.map((post, index) => {
          return (
            <div key={index}>
              <Posts postData={post} clikeable={true} />
            </div>
          );
        })}
    </div>
  );
};

export default MoviePosts;
