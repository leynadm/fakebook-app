import React, { useContext, useEffect } from "react";
import PostInput from "./PostInput";
import PostModal from "./PostModal";
import "../styles/CreatePost.css";

function CreatePost() {

  return (
    <div className="create-post-wrapper">
{/* 
      <PostInput/> 
     */}  
      <PostModal /> 
    </div>
  );
}

export default CreatePost;
