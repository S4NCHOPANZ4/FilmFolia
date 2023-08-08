import React, { useState } from "react";
import axios from "axios";
import { server } from "../../server.js";
import styles from "../../styles/styles.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from 'react-toastify';



const SignUp = ({setMode}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password === confirmPassword){
      axios
      .post(`${server}/user/create-user`, { name, email, password })
      .then((res) => {
        console.log(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("")
        toast.success(res.data.message)
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    }else{
      toast.error('Passwords do not match');
    }

  };

  return (
    <form 
    onSubmit={handleSubmit}
    className={`800px:w-[400px] w-[90vw] flex justify-center  flex-col`}>
      <label htmlFor="name" className="block text-base font-light text-white">
        Full Name
      </label>
      <input
        name="name"
        autoComplete="Full Name"
        placeholder="Username"
        className={`${styles.input} my-2`}
        required
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="email" className="block text-base font-light text-white">
        Email
      </label>
      <input
        name="email"
        autoComplete="email"
        placeholder="Email Address"
        required
        className={`${styles.input} my-2`}
        type="text"
        value={email}
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
          placeholder="Password"
          className={`${styles.input} my-2`}
          type={visible ? "text" : "password"}
          value={password}
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

      <label
        htmlFor="confirm-Password"
        className="block font-light text-white text-base"
      >
        Confirm Password
      </label>
      <div className="mt-1 relative">
        <input
          name="confirm-Password"
          autoComplete="current-password"
          required
          placeholder="Confirm Password"
          className={`${styles.input} my-2`}
          type={visible ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        onClick={() => setMode(false)}
      >
        Already have an account?
      </h4>
      <div className="w-[100%] my-1 flex items-center justify-center">
        <button
          className={`${styles.button} w-[30%] bg-[#02e879cb] text-white py-2 font-ligth hover:bg-[#02e879a6] transition-all duration-2000 ease`}
          type="submit"

        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SignUp;
