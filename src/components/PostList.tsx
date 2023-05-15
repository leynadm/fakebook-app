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
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";
import { User } from "../types/user";
import "../styles/PostList.css";
import Post from "./Post";
import { PostData } from "../types/postdata";

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
          const postData = { ...doc.data(), postId: doc.id } as PostData;
          batchedPostsData.push(postData);
        });
      }

      const userIdToUserData: { [key: string]: any } = {};
      usersData.forEach((userData) => {
        const userId = userData.id;
        userIdToUserData[userId] = userData;
      });

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
        console.log(sortedFeedBatchPostData)
    }
  }

  return (
    <div className="posts-wrapper">
      {userFeed.map((post: PostData, index: number) => (
        <Post key={post.postId} post={post} index={index} />
      ))}
    </div>
  );
}

export default PostList;
