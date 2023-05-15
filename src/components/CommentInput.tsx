import React, { useState,useContext } from "react";
import "../styles/CommentInput.css";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";

import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  arrayUnion, 
  doc,
  Timestamp,
  FieldValue
} from "firebase/firestore";

interface CommentInputProps {
  postId: string;
}

function CommentInput({ postId }: CommentInputProps) {
  const [commentText, setCommentText] = useState("");
  const { currentUser } = useContext(AuthContext);
  async function PostComment() {
    if (commentText !== "") {


      const serverTimestampObj = serverTimestamp();

      const commentData = {
        text: commentText,
        userId: currentUser.uid,
        timestamp: serverTimestamp()
      }

      const q = query(collection(db, "comments"), where("postId", "==", postId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document with the matching postId exists, update the array field with the new comment
        const commentRef = doc(db, "comments", querySnapshot.docs[0].id);
  
        try {
          await updateDoc(commentRef, {
            comments: arrayUnion(commentData)
          });
          console.log("Comment added successfully.");
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      } else {
        console.log("Post does not exist or there are no comments."); // Handle the case when the post document does not exist or has no comments
      }
    }
  }
  return (
    <div className="comment-input-wrapper">
      <textarea
        className="comment-textarea"
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button onClick={PostComment}>
        <span className="material-symbols-outlined comment-input-send-icon">
          send
        </span>
      </button>
    </div>
  );
}

export default CommentInput;
