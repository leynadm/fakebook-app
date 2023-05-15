import React, { useEffect, useState, useContext } from "react";
import "../styles/PostInput.css";
import "../styles/PostInput.css";
  
interface PostInputProps {
  toggleModals: () => void;
}

function PostInput (props:PostInputProps) {

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
