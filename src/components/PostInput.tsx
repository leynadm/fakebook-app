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

  const [userName, setUserName] = useState("");
  
  function handleUserClick(){
    props.toggleModals()
  }

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.email);
      console.log(currentUser)
    }
  }, [currentUser, userName]);

  return (
    <div className="post-input-wrappper">

        <img className="post-input-image" src={defaultProfileImage} alt="user"/>
        <input className="post-input-field" type="text" placeholder={`What's on your mind, ${userName}?`} onClick={handleUserClick} />
        <span className="material-symbols-outlined">image</span>
     
    </div>
  );
}

export default PostInput;
