import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../styles/SearchProfile.css";
import { doc, getDoc,collection } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, getDownloadURL, list } from "firebase/storage";
import defaultProfileImage from "../assets/default-profile.jpeg";
import defaultCoverImage from "../assets/default-cover.jpeg";
import { User } from "../types/user";


function SearchProfile() {
  const { id } = useParams<{ id: string }>();
  const [coverImageURL, setCoverImageURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("");
  const [queriedUser, setQueriedUser] = useState<User | undefined>();

    useEffect(()=>{
        getProfileImages()
        getProfileData()
    },[])

  async function getProfileImages() {
    const imgCoverURLRef = ref(
      storage,
      `cover-images/${id}/${id + "user_cover_image"}`
    );

    const coverImageList = await list(ref(storage, `cover-images/${id}`));

    if (coverImageList.items.length > 0) {
      const imgCoverURLToUse = await getDownloadURL(imgCoverURLRef);
      setCoverImageURL(imgCoverURLToUse);
    } else {
      setCoverImageURL(defaultCoverImage);
    }

    const imgProfileURLRef = ref(
      storage,
      `profile-images/${id}/${
        id + "user_profile_image"
      }`
    );

    const profileImageList = await list(
      ref(storage, `profile-images/${id}`)
    );

    if (profileImageList.items.length > 0) {
      const imgProfileURLToUse = await getDownloadURL(imgProfileURLRef);
      setProfileImageURL(imgProfileURLToUse);
    } else {
      setProfileImageURL(defaultProfileImage);
    }
  }


  async function getProfileData() {
    const userRef = doc(collection(db, "users"), id);
    /* 
    const docRef = doc(db, "users", id);
   */
    const docSnap = await getDoc(userRef);

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

  useEffect(() => {}, []);

  return <div className="search-profile-wrapper">
        <div className="search-profile-wrapper-content">
          <div className="search-profile-cover-picture">
            <img
              className="search-profile-cover-image"
              src={coverImageURL}
              alt="cover"
            />
            <div className="search-profile-picture-wrapper">
              <div className="search-profile-picture">
                <img
                  className="search-profile-photo-image"
                  src={profileImageURL}
                  alt="cover"
                />
              </div>

            </div>
          </div>

          <div className="search-profile-info-bar">
              <div>{queriedUser?.name + " " + queriedUser?.surname}</div>

          </div>

          <div className="search-profile-content"></div>
        </div>
  </div>;


}

export default SearchProfile;
