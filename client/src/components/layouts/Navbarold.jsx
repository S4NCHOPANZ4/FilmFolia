import React, { useEffect, useState } from "react";
import { RiNetflixFill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import "../../styles/layouts/index.scss";
import { useDispatch, useSelector } from "react-redux";
import { openRegister, closeRegister } from "../../redux/actions/register";
import styles from "../../styles/styles";
import Registration from "../../pages/Registration/Registration";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isOpend = useSelector((state) => state.openRegister.isOpend);

  const [show, handleShow] = useState(false);

  const transitionNavbar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavbar);
    return () => window.removeEventListener("scroll", transitionNavbar);
  }, []);

  return (
    <div className="">
      {isOpend ? (
        <div className="relative z-2">
          <Registration />
        </div>
      ) : null}
      <div className={`nav ${show ? "nav_black" : ""}`}>
        <div className="nav_contents ">
          <RiNetflixFill className="nav_logo" color="#E50914" size={40} />
          {isAuthenticated ? (
            <RxAvatar className="nav_avatar" color="#E50914" size={40} />
          ) : (
            <button
              onClick={() => {
                dispatch(openRegister());
              }}
              className={`${styles.button} bg-red-700 font-light text-white py-1 px-2 hover:bg-red-400`}
            >
              LogIn / SignUp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
