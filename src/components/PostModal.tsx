import React, { useState, useEffect, useContext } from "react";
import "../styles/PostModal.css";
import { db,storage } from "../config/firebase";
import { AuthContext } from "./Auth";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { PostContext } from "./PostContext";
import uuid from "react-uuid";
import { ref,uploadBytes, getDownloadURL} from "firebase/storage";
function PostModal(){

  const { increaseUpdateSequence } = useContext(PostContext);
  const { currentUser } = useContext(AuthContext);
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSource, setFileSource] = useState<string | null>(null);

  async function addPost() {



    if (postText !== "") {
    
      const newPostRef = doc(collection(db, "posts"));

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

      await setDoc(newPostRef, {
        createdAt: serverTimestamp(),
        text: postText,
        userID: currentUser.uid,
        image: imageUrl,
      });
      increaseUpdateSequence();
      setPostText("");
      setSelectedFile(null);
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
    setFileSource('');
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
      <label htmlFor="post-photo-choose-btn">
                <span className="material-symbols-outlined">photo_camera</span>
              </label>
      <input
                className="post-photo-choose-btn"
                id="post-photo-choose-btn"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
        <div className="post-photo-image-group">
        
        {fileSource && <button onClick={handleRemoveClick}>Remove</button>}
        
        {fileSource && <img className="post-user-uploaded-image" src={fileSource} alt="user upload"/>}
        </div>

        <button type="button" onClick={addPost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default PostModal;
