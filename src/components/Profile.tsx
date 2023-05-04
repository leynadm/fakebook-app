import React, { useState, useEffect, useContext } from "react";
import "../styles/Profile.css";
import { AuthContext } from "./Auth";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  orderBy,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL, list } from "firebase/storage";
import type { StorageReference } from "firebase/storage";
import { User } from "../types/user";
import { PostData } from "../types/postdata";
import PostInput from "./PostInput";
import PostModal from "./PostModal";
  
function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();
  const [coverImageURL, setCoverImageURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("");
  const [userPostsArr, setUserPostsArr] = useState<PostData[]>([]);
  const [togglePostModal, setTogglePostModal] = useState<boolean>(false);
  const [uploadCount, setUploadCount] = useState(0);
  
  useEffect(() => {
    fetchProfileDataAndImages().then(() => {
      getUserPosts();
    });
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadCount]);

  async function fetchProfileDataAndImages() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data() as User;
      setQueriedUser(userData);
  
      // Fetch the cover and profile images
      const coverImageRef = ref(storage, `cover-images/${currentUser.uid}/${currentUser.uid}user_cover_image`);
      const profileImageRef = ref(storage, `profile-images/${currentUser.uid}/${currentUser.uid}user_profile_image`);
  
      try {
        const coverImageURL = await getDownloadURL(coverImageRef);
        setCoverImageURL(coverImageURL);
      } catch (error) {
        console.error("Error fetching cover image:", error);
        if (userData.coverImage) {
          setCoverImageURL(userData.coverImage);
        }
      }
  
      try {
        const profileImageURL = await getDownloadURL(profileImageRef);
        setProfileImageURL(profileImageURL);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        if (userData.profileImage) {
          setProfileImageURL(userData.profileImage);
        }
      }
    } else {
      console.log("No such document!");
    }
  }



  async function getUserPosts() {
    const q = query(
      collection(db, "posts"),
      where("userID", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const userPosts = querySnapshot.docs.map((doc) => doc.data() as PostData);

    setUserPostsArr(userPosts);
    console.log("logging in userPosts query snapshot map result");
    console.log(userPosts);

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      const userData = docSnap.data() as User;
      setQueriedUser(userData);
    }
  }

  const handleCoverImageUpload =
    (updateType: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      let imageRef: StorageReference | null = null;

      if (updateType === "cover") {
        imageRef = ref(
          storage,
          `cover-images/${currentUser.uid}/${
            currentUser.uid + "user_cover_image"
          }`
        );
      } else if (updateType === "profile") {
        imageRef = ref(
          storage,
          `profile-images/${currentUser.uid}/${
            currentUser.uid + "user_profile_image"
          }`
        );
      }

      if (imageRef) {
        uploadBytes(imageRef, file).then(() => {
          alert("Image uploaded!");
          updateUserImages(updateType, imageRef, currentUser.uid);
        });
      }
    };

  async function updateUserImages(
    linkType: string,
    imageRef: any,
    userID: string
  ) {
    const newImageURL = await getDownloadURL(imageRef);

    if (linkType === "profile") {
      await updateDoc(doc(db, "users", userID), {
        profileImage: newImageURL,
      });
    } else {
      await updateDoc(doc(db, "users", userID), {
        coverImage: newImageURL,
      });
    }

    onUploadPerformed();
  }

  function onUploadPerformed() {
    setUploadCount(uploadCount + 1);
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

  function toggleModals() {
    setTogglePostModal(!togglePostModal);
  }

  return (
    <div className="profile-wrapper">


{togglePostModal && <PostModal toggleModals={toggleModals} onUploadPerformed={onUploadPerformed}/>}

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

              <div className="profile-button">
                <label htmlFor="profile-photo-choose-btn">
                  <span className="material-symbols-outlined profile-photo-choose-btn-icon">
                    photo_camera
                  </span>
                </label>

                <input
                  className="profile-photo-choose-btn-input"
                  id="profile-photo-choose-btn"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleCoverImageUpload("profile")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-bar">
        <div className="profile-info-details">
          {currentUser.displayName ? (
            <div className="profile-user-name">{currentUser.displayName}</div>
          ) : (
            <div className="profile-user-name">
              {queriedUser?.name + " " + queriedUser?.surname}
            </div>
          )}
        </div>

        <div className="profile-info-bio">Bio</div>

        {/*<div className="profile-utility-buttons">
          <button className="profile-utility-edit-btn">Edit Profile</button>
        </div> */}
      </div>

      <PostInput toggleModals={toggleModals} />

      <div className="profile-content">
        <div className="profile-posts-wrapper">
          {userPostsArr.map((post, index) => (
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
                    {queriedUser
                      ? queriedUser.name + " " + queriedUser.surname
                      : currentUser.displayName}
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
  );
}

export default Profile;
