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
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, getDownloadURL, list } from "firebase/storage";
import defaultProfileImage from "../assets/default-profile.jpeg";
import defaultCoverImage from "../assets/default-cover.jpeg";
import { User } from "../types/user";
import { AuthContext } from "./Auth";
import { PostData } from "../types/postdata";

function SearchProfile() {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [coverImageURL, setCoverImageURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("");
  const [queriedUser, setQueriedUser] = useState<User | undefined>();
  const [follow, setFollow] = useState<string>("");
  const [userFeed, setUserFeed] = useState<any>([]);
  useEffect(() => {
    getProfileImages();
    getProfileData();
    getRelationshipStatus();
    getUsersPosts();
    console.log(queriedUser);
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

  async function getUsersPosts() {
    const followedUserPostsRef = collection(db, "posts");

    // Create a query to get all the posts documents of the user
    const q = query(
      followedUserPostsRef,
      where("userID", "==", id),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    // Retrieve the documents that matched the query above
    const followedUserPostSnapshot = await getDocs(q);

    let followedUserFeedData = followedUserPostSnapshot.docs.map((doc) =>
      doc.data()
    );
    setUserFeed(followedUserFeedData);
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

  function getTimeDifference(createdAt: any) {
    if (createdAt instanceof Timestamp) {
      // If the createdAt value is a Firebase Timestamp object, convert it to a Date object
      createdAt = createdAt.toDate();
    } else if (!(createdAt instanceof Date)) {
      // If the createdAt value is not a Date object or a Timestamp object, try to parse it as a string
      const parsedDate = Date.parse(createdAt);
      if (!isNaN(parsedDate)) {
        // If the parsed value is a valid date, create a new Date object from it
        createdAt = new Date(parsedDate);
      } else {
        // Otherwise, throw an error
        throw new Error(`Invalid createdAt value: ${createdAt}`);
      }
    }

    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    // Convert milliseconds to minutes, hours, and days
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Determine the appropriate format based on the time difference
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-wrapper-content">
        <div className="profile-cover-picture">
          <img
            className="profile-cover-image"
            src={coverImageURL}
            alt="cover"
          />

          <div className="profile-picture-wrapper">
            <div className="profile-picture">
              <img
                className="profile-photo-image"
                src={profileImageURL}
                alt="cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-bar">
        <div className="profile-info-details">
          {queriedUser?.fullname ? (
            <div className="profile-user-name">{queriedUser.fullname}</div>
          ) : (
            <div className="profile-user-name">
              {queriedUser?.name + " " + queriedUser?.surname}
            </div> 
          )}
        </div>

        <div className="profile-info-bio">{queriedUser?.bio}</div>
      </div>

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

      <div className="profile-content">
        <div className="profile-posts-wrapper">
          {userFeed.map((post: PostData, index: number) => (
            <div className="profile-post-wrapper" key={index}>
              <div className="profile-post-upper-row">
                <div className="profile-post-upper-row-user-image-wrapper">
                  <img
                    className="profile-post-upper-row-user-image"
                    src={profileImageURL}
                    alt="user profile"
                  />
                </div>
                <div className="profile-post-upper-row-user-details-wrapper">
                  <div className="profile-post-upper-row-user-name">
                    {queriedUser?.fullname ? (
                      <div className="profile-post-user-name">
                        {queriedUser.fullname}
                      </div>
                    ) : (
                      <div className="profile-post-user-name">
                        {queriedUser?.name + " " + queriedUser?.surname}
                      </div>
                    )}
                  </div>

                  <div className="profile-post-upper-row-timestamp">
                        
                        {getTimeDifference(post.createdAt)}
                     
                  </div>
                </div>
              </div>
              <div className="profile-post-middle-row">
                 
                    <div className="profile-post-middle-content">{post.text}</div>

                
                    {post.image && (
                      <img
                        className="profile-post-middle-image"
                        src={post.image}
                        alt="user chosen"
                      />
                    )}
         
              </div>
              {/* Add rendering for other post properties as needed */}
            </div>
          ))}
        </div>
      </div>
    </div>

    /*
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

    */
  );
}

export default SearchProfile;
