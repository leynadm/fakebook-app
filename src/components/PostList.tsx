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
      limit(10)
    );

    // Retrieve the documents that matched the query above
    const followedUsersSnapshot = await getDocs(q);

    // Extract the data from the above query and create an array of objects containing the documents data of the users the logged in user is following

    const feedData = followedUsersSnapshot.docs.map((doc) => doc.data());
    console.log(feedData);

    // Flaten the "recentPosts" array field in the feedData document objects into a single array. The reduce() method iterates over the feedData array and concatenates the recentPosts array of each user into a single array
    const feedCuratedPosts = feedData.reduce(
      (accumulator, currentElement) =>
        accumulator.concat(currentElement.recentPosts),
      []
    );

    console.log(feedCuratedPosts);

    //This line sorts the feedCuratedPosts array in descending order based on the published property of each post.
    const sortedFeedCuratedPosts = feedCuratedPosts.sort(
      (a: any, b: any) => b.published - a.published
    );

    // This line creates an array of post IDs from the sortedFeedCuratedPosts array.
    const postIds = sortedFeedCuratedPosts.map((post: any) => post.postId);

    // Creates a query that retrieves the posts from the "posts" collection where the document IDs are contained in the postIds array. Then retrieves the documents that match the query and create an array of objects called postsData
    if (postIds.length > 0) {
      const postsQuery = query(
        collection(db, "posts"),
        where(documentId(), "in", postIds)
      );

      const postsSnapshot = await getDocs(postsQuery);

      const postsDataPromises = postsSnapshot.docs.map(async (document) => {
        const postData = document.data() as PostData;
        const userID = postData.userID;

        // Query the users collection to retrieve the document with the given userID
        const userDoc = await getDoc(doc(db, "users", userID));

        if (userDoc.exists()) {
          // Get the name, surname, imageURL properties from the userDoc
          const { name, surname } = userDoc.data() as {
            name: string;
            surname: string;
          };

          // Add the name, surname properties to the postData object
          return {
            ...postData,
            name,
            surname,
          };
        }
      });

      // Wait for all queries to finish and set the userFeed
      const postsData = await Promise.all(postsDataPromises);
      setUserFeed(postsData);
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
  : */ currentUser.photoURL
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
            {post.image&&<img
              className="post-middle-image"
              src={post.image}
              alt="user chosen"
            />}
            
          </div>
          {/* Add rendering for other post properties as needed */}
        </div>
      ))}
    </div>
  );
}

export default PostList;
