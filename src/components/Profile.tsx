import React, { useState, useEffect, useContext } from "react";
import "../styles/Profile.css";
import { AuthContext } from "./Auth";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  list,
} from "firebase/storage";
import { User } from "../types/user";

import defaultProfileImage from "../assets/default-profile.jpeg";
import defaultCoverImage from "../assets/default-cover.jpeg";

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();
  const [coverImageURL, setCoverImageURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("");
  const profileImage: HTMLImageElement = new Image();
  profileImage.src = defaultProfileImage;

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

    const coverImageList = await list(
      ref(storage, `cover-images/${currentUser.uid}`)
    );

    if (coverImageList.items.length > 0) {
      const imgCoverURLToUse = await getDownloadURL(imgCoverURLRef);
      setCoverImageURL(imgCoverURLToUse);
    } else {
      setCoverImageURL(defaultCoverImage);
    }

    const imgProfileURLRef = ref(
      storage,
      `profile-images/${currentUser.uid}/${
        currentUser.uid + "user_profile_image"
      }`
    );

    const profileImageList = await list(
      ref(storage, `profile-images/${currentUser.uid}`)
    );

    if (profileImageList.items.length > 0) {
      const imgProfileURLToUse = await getDownloadURL(imgProfileURLRef);
      setProfileImageURL(imgProfileURLToUse);
    } else {
      setProfileImageURL(defaultProfileImage);
    }
  }

  async function getProfileData() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      const userData = docSnap.data() as User;
      setQueriedUser(userData);
      console.log(userData);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  const handleCoverImageUpload =
    (updateType: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      let coverImageRef;

      if (updateType === "cover") {
        coverImageRef = ref(
          storage,
          `cover-images/${currentUser.uid}/${
            currentUser.uid + "user_cover_image"
          }`
        );
      } else if (updateType === "profile") {
        coverImageRef = ref(
          storage,
          `profile-images/${currentUser.uid}/${
            currentUser.uid + "user_profile_image"
          }`
        );
      }

      if (coverImageRef !== undefined) {
        uploadBytes(coverImageRef, file).then(() => {
          setUploadCompleted(true);
          alert("Image uploaded!");
        });
      }
    };

  return (
    <div className="profile-wrapper">

        <div className="profile-wrapper-content">
          <div className="profile-cover-picture">
            <img
              className="profile-cover-image"
              src={coverImageURL}
              alt="cover"
            />

            <div className="profile-cover-choose-group">
              <label htmlFor="profile-cover-choose-btn">
                <span className="material-symbols-outlined">photo_camera</span>
              </label>
              <input
                className="profile-cover-choose-btn"
                id="profile-cover-choose-btn"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleCoverImageUpload("cover")}
              />
            </div>

            <div className="profile-picture-wrapper">
              <div className="profile-picture">
                <img
                  className="profile-photo-image"
                  src={profileImageURL}
                  alt="cover"
                />
              </div>

              <div className="profile-button">
                <label htmlFor="profile-photo-choose-btn">
                  <span className="material-symbols-outlined">
                    photo_camera
                  </span>
                </label>
                <input
                  className="profile-photo-choose-btn"
                  id="profile-photo-choose-btn"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleCoverImageUpload("profile")}
                />
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

          <div className="profile-content"></div>
        </div>
    </div>
  );
}

export default Profile;
