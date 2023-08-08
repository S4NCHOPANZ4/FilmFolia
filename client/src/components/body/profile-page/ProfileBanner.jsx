import React, { useEffect, useState } from 'react'
import { AiOutlinePoweroff } from 'react-icons/ai'
import { useSelector } from 'react-redux';
import { server } from '../../../server';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileBanner = ({userName}) => {

  const { user } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [owner, setOwner] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {



    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get("id");

    if(user && user._id === id){
      setOwner(true)
    }
  },[])

  const logOutHandler = () =>{
      axios.get(`${server}/user/logout`, {withCredentials: true}).then((res)=>{
          toast.success(res.data.message);
          window.location.reload(true)
          navigate('/')
      }).catch((err)=>{
          console.log(err.response.data.message);
      })
  }


  return (
    <div className='relative 800px:w-[500px] 1100px:w-[650px] w-[90vw] h-[100px] 1100px:h-[130px] 500px:h-[120px] bg-[#121c26]  z-30 rounded-b'>
        <h1 className='absolute left-2 bottom-2 text-[#10ce72] font-light text-[20px] italic'>@{userName}</h1>
        {
          owner&&
          <button  
          onClick={() => logOutHandler()}
          className='absolute right-2 bottom-2 p-1 hover:bg-[#000] rounded-[50%]'>
          <AiOutlinePoweroff color='white' size={20}/>
          </button>
        }

    </div>
  )
}

export default ProfileBanner