import React, { useEffect, useState, useContext } from "react";
import "../styles/PostInput.css";
import { AuthContext } from "./Auth";
import "../styles/PostInput.css";
function PostInput() {
  const { currentUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.email);
    }
  }, [currentUser, userName]);

  return (
    <div className="post-input-wrappper">
      <div className="post-input-upper-row">
        <span className="post-input-user-profile-picture">Profile</span>
        <input type="text" placeholder={`What's on your mind, ${userName}?`} />
      </div>

      <div className="post-input-lower-row">
        <div>Image</div>
        <div>Feeling</div>
      </div>
    </div>
  );
}

export default PostInput;
