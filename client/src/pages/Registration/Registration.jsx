import React, { useState } from "react";
import axios from "axios";
import { server } from "../../server.js";
import styles from "../../styles/styles.js";
import LogIn from "../../components/register/LogIn.jsx";
import SignUp from "../../components/register/SignUp.jsx";
import { useDispatch, useSelector } from "react-redux";
import { openRegister, closeRegister } from "../../redux/actions/register";

const Registration = ({ setOpen = null }) => {
  const dispatch = useDispatch();
  const isOpend = useSelector((state) => state.openRegister.isOpend);

  const [mode, setMode] = useState(false);

  const handleClose = (e) => {
    if (!setOpen) {
      return;
    } else {
      const clickedElementClass = e.target.className;
      if (clickedElementClass[0] === "x") {
        setOpen(false);
      }
    }
  };

  return (
    <div
      onClick={handleClose}
      className={`x ${styles.normalFlex} top-0 left-0 justify-center h-screen w-screen bg-[#00000051] fixed z-50`}
    >
      <div className={`bg-[#1b2a38] px-[10px] py-[1px] rounded-[6px]`}>
        <h1
          className={`${styles.productTitle} text-white mt-4 text-[#02e879cb] font-light border-b border-solid border-1 border-[#02e879cb]
        pb-2`}
        >
          {mode ? "SignUp" : "LogIn"}
        </h1>
        <div className="my-[10px] ">
          {mode ? <SignUp setMode={setMode} /> : <LogIn setMode={setMode} />}
        </div>
      </div>
    </div>
  );
};

export default Registration;
