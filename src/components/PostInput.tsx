import React, { useEffect, useState, useContext } from "react";
import "../styles/PostInput.css";
import { AuthContext } from "./Auth";
import "../styles/PostInput.css";
import defaultProfileImage from "../assets/default-profile.jpeg";
  
interface PostInputProps {
  toggleModals: () => void;
}

function PostInput (props:PostInputProps) {

  const { currentUser } = useContext(AuthContext);

  function handleUserClick(){
    props.toggleModals()
  }

  return (
    <div className="post-input-wrappper">
        <span className="material-symbols-outlined" onClick={handleUserClick}>forum</span>     
        <input className="post-input-field" type="text" placeholder={`Tell us what's happening?`} onClick={handleUserClick} />
    </div>
  );
}

export default PostInput;
