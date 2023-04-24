import React, { useState, useEffect, useContext } from "react";
import "../styles/PostModal.css";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

function PostModal() {
  const { currentUser } = useContext(AuthContext);
  const [postText, setPostText] = useState("");

  async function addPost() {
    if (postText !== "") {
      const newPostRef = doc(collection(db, "posts"));
      await setDoc(newPostRef, {
        createdAt: serverTimestamp(),
        text: postText,
        userID: currentUser.uid,
      });

      setPostText("")
    }
  }
  return (
    <div className="post-modal-wrapper">
      <div className="post-modal-upper-row">
        <div>Create Post</div>
        <span>X</span>
      </div>

      <div className="post-modal-middle">
        <textarea onChange={(e) => setPostText(e.target.value)} value={postText} />
        <div className="post-modal-image"></div>
      </div>

      <div className="post-modal-lower">
        <button type="button" onClick={addPost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default PostModal;
