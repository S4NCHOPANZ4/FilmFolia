import React, { useState } from "react";
import axios from "axios";
import { server } from "../../server.js";
import styles from "../../styles/styles.js";
import LogIn from "../../components/register/LogIn.jsx";

const LoginPage = () => {

  return (
    <div
      className={`${styles.normalFlex} justify-center h-[100vh] w-[100vw] bg-[#00000017]`}
    >
      <div className={`bg-[#000] px-[10px] py-[1px] rounded-[6px]`}>
        <h1 className={`${styles.productTitle} mt-4 text-red-700 font-light`}>
          Login
        </h1>
        <div className="my-[10px] ">
          <LogIn />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
