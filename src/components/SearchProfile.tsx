import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import "../styles/SearchProfile.css";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, getDownloadURL, list } from "firebase/storage";
import defaultProfileImage from "../assets/default-profile.jpeg";
import defaultCoverImage from "../assets/default-cover.jpeg";
import { User } from "../types/user";
import { AuthContext } from "./Auth";

function SearchProfile() {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [coverImageURL, setCoverImageURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("");
  const [queriedUser, setQueriedUser] = useState<User | undefined>();
  const [follow, setFollow] = useState<string>("");

  useEffect(() => {
    getProfileImages();
    getProfileData();
    getRelationshipStatus();
  }, []);

  async function getRelationshipStatus() {
    if (!id) {
      console.error("User ID is undefined");
      return;
    }
    
    const followersFeedRef = doc(db, "followers-feed", id);
    const documentSnapshot = await getDoc(followersFeedRef);

    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data();
      const users = data.users || [];

      if (users.includes(currentUser.uid)) {
        setFollow("Unfollow");
      } else {
        setFollow("Follow");
      }
    } else {
      setFollow("Follow");
    }
  }

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
      `profile-images/${id}/${id + "user_profile_image"}`
    );

    const profileImageList = await list(ref(storage, `profile-images/${id}`));

    if (profileImageList.items.length > 0) {
      const imgProfileURLToUse = await getDownloadURL(imgProfileURLRef);
      setProfileImageURL(imgProfileURLToUse);
    } else {
      setProfileImageURL(defaultProfileImage);
    }
  }

  async function getProfileData() {
    const userRef = doc(collection(db, "users"), id);
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

  async function followUser() {
    const followersFeedRef = doc(collection(db, "followers-feed"), `${id}`);

    const followersFeedDoc = await getDoc(followersFeedRef);

    if (!followersFeedDoc.exists()) {
      await setDoc(followersFeedRef, {
        lastPost: null,
        recentPosts: [],
        users: arrayUnion(currentUser.uid),
      });
    }

    await updateDoc(followersFeedRef, {
      users: arrayUnion(currentUser.uid),
    });

    setFollow("Unfollow");
  }

  function handleFollowerClick() {
    if (follow === "Follow") {
      followUser();
    } else {
      deleteUserFollower();
    }
  }

  async function deleteUserFollower() {
    if (!id) {
      console.error("User ID is undefined");
      return;
    }

    const userRef = doc(
      collection(db, "followers", `${id}`, "userFollowers"),
      currentUser.uid
    );
    await deleteDoc(userRef);
    // Delete following entry from 'Following' collection
    const followingRef = doc(
      collection(db, "following", `${currentUser.uid}`, "userFollowing"),
      id
    );
    await deleteDoc(followingRef);

    setFollow("Follow");
  }

  return (
    <div className="search-profile-wrapper">
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
          <div className="search-profile-follow-group">
            <button
              onClick={handleFollowerClick}
              className="search-profile-follow-btn"
              type="button"
            >
              {follow}
              <span className="material-symbols-outlined search-profile-follow-icon">
                {follow === "Follow" ? "favorite" : "heart_broken"}
              </span>
            </button>
          </div>
          <div className="search-profile-verified-group">
            <span className="material-symbols-outlined search-profile-follow-icon">
              {queriedUser?.verified === true ? "verified" : ""}
            </span>
          </div>
        </div>

        <div className="search-profile-content"></div>
      </div>
    </div>
  );
}

export default SearchProfile;
