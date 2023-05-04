import React, { useContext, useEffect, useState } from "react";
import PostInput from "./PostInput";
import PostModal from "./PostModal";
import "../styles/CreatePost.css";

interface CreatePostProps {
  onUploadPerformed?: () => void;
}

function CreatePost({ onUploadPerformed }: CreatePostProps) {

  const [togglePostModal, setTogglePostModal] = useState<boolean>(false)

  function toggleModals(){
    setTogglePostModal(!togglePostModal)
  }

  return (

    <div className="create-post-wrapper">
     {togglePostModal && <PostModal toggleModals={toggleModals}  onUploadPerformed={onUploadPerformed} />}
      
      <PostInput toggleModals={toggleModals} /> 
  
    </div>
  );
}

export default CreatePost;
