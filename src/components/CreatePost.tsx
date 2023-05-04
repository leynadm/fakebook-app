import React, { useContext, useEffect, useState } from "react";
import PostInput from "./PostInput";
import PostModal from "./PostModal";
import "../styles/CreatePost.css";

function CreatePost() {

  const [togglePostModal, setTogglePostModal] = useState<boolean>(false)

  function toggleModals(){
    setTogglePostModal(!togglePostModal)
  }
  
  return (
    <div className="create-post-wrapper">
     {togglePostModal && <PostModal toggleModals={toggleModals}  />}
      
      <PostInput toggleModals={toggleModals}  /> 
  
       
    </div>
  );
}

export default CreatePost;
