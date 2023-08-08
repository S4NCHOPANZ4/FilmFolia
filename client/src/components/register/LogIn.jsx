import React, { useState } from "react";
import axios from "axios";
import { server } from "../../server.js";
import styles from "../../styles/styles.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from 'react-toastify';


const LogIn = ({setMode}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);


  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

    await axios.post(`${server}/user/login-user`,{
        email,
        password
    },{withCredentials: true}).then((res)=>{
        toast.success("Login success!")
        navigate('/')
        window.location.reload()
    }).catch((err)=>{
        toast.error(err.response.data.message)
    })
}
  return (
    <form className={`800px:w-[400px] w-[90vw] flex justify-center  flex-col`}>
      <label htmlFor="email" className="block text-base font-light text-white">
        Email
      </label>
      <input
        name="email"
        autoComplete="email"
        placeholder="Email Address"
        required
        value={email}
        className={`${styles.input} my-2`}
        type="text"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label
        htmlFor="password"
        className="block text-base font-light text-white"
      >
        Password
      </label>
      <div className="mt-1 relative">
        <input
          name="password"
          autoComplete="current-password"
          required
          value={password}
          placeholder="Password"
          className={`${styles.input} my-2`}
          type={visible ? "text" : "password"}

          onChange={(e) => setPassword(e.target.value)}
        />
        {visible ? (
          <AiOutlineEye
            className="absolute right-2 top-3 cursor-pointer"
            size={25}
            color="white"
            onClick={() => setVisible(false)}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="absolute right-2 top-3 cursor-pointer"
            size={25}
            color="white"
            onClick={() => setVisible(true)}
          />
        )}
      </div>
      <h4
        className="text-[#02e879cb] cursor-pointer text-m"
        onClick={() => setMode(true)}
      >
        Don't have an account?
      </h4>
      <div className="w-[100%] my-1 flex items-center justify-center">
        <button
          className={`${styles.button} w-[30%] bg-[#02e879cb] text-white py-2 font-ligth hover:bg-[#02e879a4] `}
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default LogIn;
