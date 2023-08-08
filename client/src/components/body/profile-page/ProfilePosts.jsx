import React from 'react'
import Posts from '../Posts'

const ProfilePosts = ({posts}) => {
  return (
    <div>
      {posts.map((post, index)=>{
        return(
          <Posts key={index} postData={post} clikeable={true}/>
        )
      })}
    </div>
  )
}

export default ProfilePosts