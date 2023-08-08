import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import NewPublish from "../../layouts/publishLayout/NewPublish";

const NewPostQuick = ({ setOpen }) => {
  const [commentSent, setCommentSent] = useState(false);
  
  useEffect(() => {
    if(commentSent){
        setOpen(false);
    }
  },[commentSent])
  
  const handleClose = (e) => {
    const clickedElementClass = e.target.className;
    if (clickedElementClass[0] === "x") {
      setOpen(false);
    }
  };


  return (
    <div
      onClick={(e) => {
        handleClose(e);
      }}
      className="x fixed left-0 top-0 w-[100vw] h-[100vh] bg-[#0000006e] z-40 flex items-center justify-center rounded-md"
    >
      <NewPublish setCommentSent={setCommentSent}  noBrowser={true}/>
    </div>
  );
};

export default NewPostQuick;
