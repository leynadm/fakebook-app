import React, { useEffect, useState, useContext } from "react";
import "../styles/PostInput.css";
import { AuthContext } from "./Auth";
import "../styles/PostInput.css";
import defaultProfileImage from "../assets/default-profile.jpeg";
  
function PostInput() {
  const { currentUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.email);
      console.log(currentUser)
    }
  }, [currentUser, userName]);

  return (
    <div className="post-input-wrappper">


        <img className="post-input-image" src={defaultProfileImage} alt="user"/>
        <input className="post-input-field" type="text" placeholder={`What's on your mind, ${userName}?`} />
        <span className="material-symbols-outlined">photo_camera</span>
     
    </div>
  );
}

export default PostInput;
