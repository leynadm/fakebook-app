import React, { useState, useEffect, useContext } from "react";
import "../styles/Profile.css";
import { AuthContext } from "./Auth";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-uuid";

import { User } from "../types/user";

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [coverImageURL, setCoverImageURL] = useState("");

  const [coverImageUpload, setCoverImageUpload] = useState<
    FileList | null | undefined
  >();
  const [uploadCompleted, setUploadCompleted] = useState(false);

  useEffect(() => {
    getProfileImages();
    getProfileData();
  }, [uploadCompleted]);

  async function getProfileImages() {
    const imgCoverURLRef = ref(
      storage,
      `cover-images/${currentUser.uid}/${currentUser.uid + "user_cover_image"}`
    );
    console.log("logging in the image URL reference:");
    const imgCoverURLToUse = await getDownloadURL(imgCoverURLRef);

    setCoverImageURL(imgCoverURLToUse);
  }

  async function getProfileData() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      const userData = docSnap.data() as User;
      setQueriedUser(userData);
      console.log(userData);
      setIsLoading(false);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  const uploadCoverImage = () => {
    setUploadCompleted(false);
    if (coverImageUpload === null || coverImageUpload === undefined) return;

    const coverImage = coverImageUpload[0];
    const coverImageRef = ref(
      storage,
      `cover-images/${currentUser.uid}/${currentUser.uid + "user_cover_image"}`
    );

    uploadBytes(coverImageRef, coverImage).then(() => {
      alert("Image Uploaded!");
    });
    setUploadCompleted(true);
  };

  return (
    <div className="profile-wrapper">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="profile-wrapper-content">
          
          <div className="profile-cover-picture">
            <img
              className="profile-cover-image"
              src={coverImageURL}
              alt="cover"
            />

          <div className="profile-picture-wrapper">

            <div className="profile-picture">Image</div>
            
            <div>  
            <button>Upload Profile</button>
            </div>
          
          </div>

            <div className="profile-cover-buttons-group">
              <div>
                <input
                  className="profile-cover-choose"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(event) => {
                    setCoverImageUpload(event.target.files);
                  }}
                />
              </div>
              <div>
                <button
                  className="profile-cover-upload"
                  type="button"
                  onClick={uploadCoverImage}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>



          <div className="profile-info-bar">


            {currentUser.displayName ? (
              <div>{currentUser.displayName}</div>
            ) : (
              <div>{queriedUser?.name + " " + queriedUser?.surname}</div>
            )}

          </div>

          <div className="profile-content">

          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
