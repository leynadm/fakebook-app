import React, { useState, useEffect, useContext } from "react";
import "../styles/PostModal.css";
import { db, storage } from "../config/firebase";
import { AuthContext } from "./Auth";
import {
  collection,
  setDoc,
  doc,
  Timestamp,
  FieldValue,
  serverTimestamp,
  arrayUnion,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { PostContext } from "./PostContext";
import uuid from "react-uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


interface PostModalProps {
  toggleModals: () => void;
}

function PostModal(props:PostModalProps) {

  function handleUserClose(){
    props.toggleModals()
  }

  const { increaseUpdateSequence } = useContext(PostContext);
  const { currentUser } = useContext(AuthContext);
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSource, setFileSource] = useState<string | null>(null);

  async function addPost() {
    if (postText !== "") {
      let imageUrl: string | null = null;
      let imageRef = null;
      if (selectedFile) {
        imageRef = ref(
          storage,
          `images/${currentUser.uid}/${currentUser.uid}_${uuid()}`
        );
        await uploadBytes(imageRef, selectedFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newPostRef = doc(collection(db, "posts"));

      const serverTimestampObj = serverTimestamp();
      const timestamp = Timestamp.fromMillis(Date.now());

      await setDoc(newPostRef, {
        createdAt: serverTimestampObj,
        text: postText,
        userID: currentUser.uid,
        image: imageUrl,
        timestamp: timestamp,
      });

      const newFollowersFeedRef = doc(
        collection(db, "followers-feed"),
        currentUser.uid
      );

      const followersFeedDoc = await getDoc(newFollowersFeedRef);

      const recentPosts = {
        postId: newPostRef.id,
        published: timestamp,
        text: postText,
      };

      if (!followersFeedDoc.exists()) {
        // create the document if it doesn't exist
        await setDoc(newFollowersFeedRef, {
          lastPost: serverTimestampObj,
          recentPosts: arrayUnion(recentPosts),
          users:[]
        });
      } else {
        await updateDoc(newFollowersFeedRef, {
          lastPost: serverTimestampObj,
          recentPosts: arrayUnion(recentPosts),
        });
      }

      handleUserClose()

      increaseUpdateSequence();
      setPostText("");
      setSelectedFile(null);
      handleRemoveClick();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const fileSource = e.target?.result as string;
        setFileSource(fileSource);
      };
    }
  }

  function handleRemoveClick() {
    setSelectedFile(null);
    setFileSource("");
  }

  return (
    <div className="post-modal-wrapper">
      <div className="post-model-content">
        <div className="post-modal-upper-row">
          <div className="post-modal-title">Create Post</div>

          <span className="material-symbols-outlined post-modal-close-btn" onClick={handleUserClose}>
            cancel
          </span>
        </div>

        <div className="post-modal-middle">
          <textarea
            onChange={(e) => setPostText(e.target.value)}
            value={postText}
            placeholder="What's on your mind today?"
          />

          <div className="post-photo-image-group">
            <div className="post-photo-btn-group">
            {fileSource && <button className="post-photo-image-remove-btn" onClick={handleRemoveClick}><span className="material-symbols-outlined">
delete
</span></button>}
</div>
            {fileSource && (
              <img
                className="post-user-uploaded-image"
                src={fileSource}
                alt="user upload"
              />
            )}
          </div>
        </div>

        <div className="post-modal-additional">
          <div className="post-modal-additional-title">Add to your post</div>

          <div className="photo-upload-group">
            
            <label htmlFor="post-photo-choose-btn">
              <span className="material-symbols-outlined">image</span>
            </label>
            <input
              className="post-photo-choose-btn"
              id="post-photo-choose-btn"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
          </div>
        
        </div>

        <div className="post-modal-lower">
          
          <button className="post-modal-btn" type="button" onClick={addPost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
