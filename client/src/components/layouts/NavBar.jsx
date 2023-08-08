import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BiHomeAlt2,
  BiSolidHomeAlt2,
  BiUserCircle,
  BiSolidUserCircle,
  BiComment,
  BiSolidComment,
  BiStar,
  BiSolidStar,
} from "react-icons/bi";
import { AiOutlineFire, AiFillFire } from "react-icons/ai";
import styles from "../../styles/styles";
import { ChangePage } from "../../redux/actions/page";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import TrendingMenu from "../body/nav-bar-items/TrendingMenu";
import FavoritesMovies from "../body/nav-bar-items/FavoritesMovies";
import { FaFeatherAlt } from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import NewPostQuick from "../body/nav-bar-items/NewPostQuick";
import Registration from "../../pages/Registration/Registration";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageReducer = useSelector((state) => state.pageReducer);
  const { isAuthenticated } = useSelector((state) => state.user);

  const { user } = useSelector((state) => state.user);
  const [openTrending, setOpenTrending] = useState(false);
  const [openFavorite, setOpenFavorite] = useState();
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [logInOpen, setLoginOpen] = useState(false);

  const currentUrl = new URL(window.location.href);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get("id");
    const profile = currentUrl.pathname.split("/")[1];
    setNavPage(profile, id);
  }, [currentUrl]);

  const setNavPage = (page, id) => {
    switch (page) {
      case "":
        dispatch(ChangePage("home"));
        break;
      case "profile":
        if (user && user._id === id) {
          dispatch(ChangePage("profile"));
        }
        break;
      default:
    }
  };

  return (
    <>
      {openTrending || openFavorite || newPostOpen || logInOpen ? (
        <>
          {openTrending && <TrendingMenu setOpen={setOpenTrending} />}
          {openFavorite && <FavoritesMovies setOpen={setOpenFavorite} />}
          {newPostOpen && <NewPostQuick setOpen={setNewPostOpen} />}
          {logInOpen && <Registration setOpen={setLoginOpen} />}
        </>
      ) : (
        <></>
      )}
      <div className="sticky top-8 hidden 800px:flex flex-col items-left justify-center  1100px:w-[210px] w-auto pr-1">
        <div
          className={`${styles.navItem}`}
          onClick={() => {
            navigate("/");
            dispatch(ChangePage("home"));
          }}
        >
          {pageReducer.page == "home" ? (
            <BiSolidHomeAlt2 color="white" size={30} />
          ) : (
            <BiHomeAlt2 color="white" size={30} />
          )}
          <h1 className="text-white font-normal text-lg pl-4 1100px:block hidden">
            Home
          </h1>
        </div>

        <div
          className={`${styles.navItem}`}
          onClick={() => {
            if (isAuthenticated) {
              navigate(`/profile/${user.name}?id=${user._id}`);
              dispatch(ChangePage("profile"));
            } else {
              setLoginOpen(true);
            }
          }}
        >
          {pageReducer.page === "profile" ? (
            <BiSolidUserCircle color="white" size={30} />
          ) : (
            <BiUserCircle color="white" size={30} />
          )}
          <h1 className="text-white font-normal text-lg pl-4 1100px:block hidden">
            Profile
          </h1>
        </div>

        <div
          className={`${styles.navItem}`}
          onClick={() => {
              if (isAuthenticated) {
                navigate(`/profile/${user.name}?id=${user._id}`);
                setOpenFavorite(true);
                dispatch(ChangePage("fav"));
              } else {
                setLoginOpen(true);
              }
            }}
        >
          {pageReducer.page === "fav" ? (
            <BiSolidStar color="white" size={30} />
          ) : (
            <BiStar color="white" size={30} />
          )}
          <h1 className="text-white font-normal text-lg pl-4 1100px:block hidden">
            Favorite Films
          </h1>
        </div>
        {isAuthenticated ? (
          <div
            onClick={() => {
              setNewPostOpen(true);
            }}
            className={`${styles.navItem} !rounded-sm bg-[#02e879] hover:bg-[#3d7057]`}
          >
            <FaFeatherAlt size={20} color="#fff" />

            <h1 className="text-white font-normal text-lg pl-4 1100px:block hidden">
              New Post
            </h1>
          </div>
        ) : (
          <div
            onClick={() => {
              setLoginOpen(true);
            }}
            className={`${styles.navItem} flex !rounded-sm bg-[#02e879d3] hover:bg-[#3d7057]`}
          >
            <SiGnuprivacyguard size={20} color="#fff" />

            <h1 className="text-[#fff] font-normal text-lg pl-4 1100px:block hidden">
              LogIn / Sign Up
            </h1>
          </div>
        )}


      </div>
      <div className="flex justify-evenly items-center border-t border-white 800px:hidden fixed bottom-0 w-screen h-[50px] bg-[#16212d] ">
        <div
          onClick={() => {
            if (isAuthenticated) {
              navigate(`/profile/${user.name}?id=${user._id}`);
              dispatch(ChangePage("profile"));
            } else {
              setLoginOpen(true);
            }
          }}
        >
          {pageReducer.page == "profile" ? (
            <BiSolidUserCircle color="white" size={30} />
          ) : (
            <BiUserCircle color="white" size={30} />
          )}
        </div>

        <div
          onClick={() => {
            navigate(`/`);
            dispatch(ChangePage("home"));
          }}
        >
          {pageReducer.page == "home" ? (
            <BiSolidHomeAlt2 color="white" size={30} />
          ) : (
            <BiHomeAlt2 color="white" size={30} />
          )}
        </div>
        <div
          onClick={() => {
            setOpenFavorite(true);
            dispatch(ChangePage("fav"));
          }}
        >
          {pageReducer.page == "fav" ? (
            <BiSolidStar color="white" size={30} />
          ) : (
            <BiStar color="white" size={30} />
          )}
        </div>

        <AiOutlineFire
          onClick={() => {
            setOpenTrending(true);
          }}
          color="white"
          size={30}
        />
        {isAuthenticated ? (
          <div
            onClick={() => {
              setNewPostOpen(true);
            }}
            className="flex items-center justify-center absolute w-[60px] h-[60px] bg-[#02e879] bottom-20 right-5 rounded-[50%] cursor-pointer"
          >
            <FaFeatherAlt size={20} color="#fff" />
          </div>
        ) : (
          <div
            onClick={() => {
              setLoginOpen(true);
            }}
            className="flex items-center justify-center absolute w-[60px] h-[60px] bg-[#02e879] bottom-20 right-5 rounded-[50%] cursor-pointer"
          >
            <SiGnuprivacyguard size={20} color="#fff" />
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
