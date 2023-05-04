import React, { useState, useEffect, useContext } from "react";
import { PostContext } from "./PostContext";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  documentId,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";
import { User } from "../types/user";
import "../styles/PostList.css";

import { PostData } from "../types/postdata";

interface FollowedUserData {
  recentPosts: Array<PostData & { id: string }>;
  // Add any other properties you expect to have in the feedData elements
}

function PostList() {
  const { currentUser } = useContext(AuthContext);
  const { updateKey } = useContext(PostContext);
  const [userFeed, setUserFeed] = useState<any>([]);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();

  useEffect(() => {
    getFeed();
  }, [updateKey]);

  async function getFeed() {
    // Get a reference to the followers-feed collection
    const followedUsersRef = collection(db, "followers-feed");

    // Create a query to get all the documents of the users in the followers-feed collection followed by the logged in user (the recentPosts field should be limited to 10)
    const q = query(
      followedUsersRef,
      where("users", "array-contains", currentUser.uid),
      orderBy("lastPost", "desc"),
      limit(2)
    );

    // Retrieve the documents that matched the query above
    const followedUsersSnapshot = await getDocs(q);

    // Extract the data from the above query and create an array of objects containing the documents data of the users the logged in user is following

    let feedData = followedUsersSnapshot.docs.map((doc) => doc.data());

    // Flaten the "recentPosts" array field in the feedData document objects into a single array. The reduce() method iterates over the feedData array and concatenates the recentPosts array of each user into a single array
    const feedCuratedPosts = feedData.reduce(
      (accumulator, currentElement) =>
        accumulator.concat(currentElement.recentPosts),
      []
    );

    const sortedFeedCuratedPosts = feedCuratedPosts.sort((a: any, b: any) => {
      const dateA = new Date(a.published);
      const dateB = new Date(b.published);
      return dateA.getTime() - dateB.getTime();
    });
    // This line creates an array of post IDs from the sortedFeedCuratedPosts array.
    const postIds = sortedFeedCuratedPosts.map((post: any) => post.postId);

    const documentIds: string[] = [];

    followedUsersSnapshot.forEach((doc) => {
      documentIds.push(doc.id);
    });

    // Slice the postIds array into chunks of 10 or less
    const chunks = [];
    for (let i = 0; i < documentIds.length; i += 10) {
      chunks.push(documentIds.slice(i, i + 10));
    }

    const usersData: any[] = [];

    for (const chunk of chunks) {
      const usersQuery = query(
        collection(db, "users"),
        where(documentId(), "in", chunk)
      );
      const usersSnapshot = await getDocs(usersQuery);

      usersSnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() }; // Include the document ID
        usersData.push(userData);
      });
    }

    if (postIds.length > 0) {
      const batchedPostIds = [];

      for (let i = 0; i < postIds.length; i += 10) {
        batchedPostIds.push(postIds.slice(i, i + 10));
      }

      const batchedPostsData: PostData[] = [];

      for (const batch of batchedPostIds) {
        const postsQuery = query(
          collection(db, "posts"),
          where(documentId(), "in", batch)
        );

        const postsSnapshot = await getDocs(postsQuery);

        postsSnapshot.forEach((doc) => {
          batchedPostsData.push(doc.data() as PostData);
        });
      }

      const userIdToUserData: { [key: string]: any } = {};
      usersData.forEach((userData) => {
        const userId = userData.id;
        userIdToUserData[userId] = userData;
      });

      console.log("logging userId to userData");
      console.log(userIdToUserData);

      const postsDataBatch: any = batchedPostsData.map(async (post: any) => {
        const userID = post.userID;

        // Check if the user data is available in the mapping
        if (userIdToUserData.hasOwnProperty(userID)) {
          const { name, surname, profileImage } = userIdToUserData[userID];

          // Add the name, surname, and profileImage properties to the postData object
          return {
            ...post,
            name,
            surname,
            profileImage,
          };
        }
      });

      const feedBatchPostData = await Promise.all(postsDataBatch);

      const sortedFeedBatchPostData = feedBatchPostData.sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      );
      setUserFeed(sortedFeedBatchPostData);
    }
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
    <div className="posts-wrapper">
      {userFeed.map((post: PostData, index: number) => (
        <div className="post-wrapper" key={index}>
          <div className="post-upper-row">
            <div className="post-upper-row-user-image-wrapper">
              <img
                className="post-upper-row-user-image"
                src={
                  /* queriedUser
  ? queriedUser.image
  : */ post.profileImage
                }
                alt="user profile"
              />
            </div>
            <div className="post-upper-row-user-details-wrapper">
              <div className="post-upper-row-user-name">
                {post.name + " " + post.surname}

                {/* 
                {queriedUser
                  ? queriedUser.name + " " + queriedUser.surname
                  : currentUser.displayName}
              */}
              </div>

              <div className="post-upper-row-timestamp">
                {getTimeDifference(post.createdAt)}
              </div>
            </div>
          </div>
          <div className="post-middle-row">
            <div className="post-middle-content">{post.text}</div>
            {post.image && (
              <img
                className="post-middle-image"
                src={post.image}
                alt="user chosen"
              />
            )}
          </div>
          {/* Add rendering for other post properties as needed */}
        </div>
      ))}
    </div>
  );
}

export default PostList;
