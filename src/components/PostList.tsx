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

import { PostData } from "../types/postdata";

function PostList() {
  const { currentUser } = useContext(AuthContext);
  const { updateKey } = useContext(PostContext);

  const [userFeed, setUserFeed] = useState<PostData[]>([]);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();

  useEffect(() => {
    getFeed();
    /*   
    const fetchPosts = async () => {
      const followedUsersPosts = await fetchFollowedUsersPosts();
      setUserFeed(followedUsersPosts);
    };

    fetchPosts();
   */
  }, [updateKey]);

  async function getFeed() {
    const followedUsersRef = collection(db, "followers-feed");

    const q = query(
      followedUsersRef,
      where("users", "array-contains", currentUser.uid),
      orderBy("lastPost", "desc"),
      limit(10)
    );

    const followedUsersSnapshot = await getDocs(q);

    const feedData = followedUsersSnapshot.docs.map((doc) => doc.data());

    const feedCuratedPosts = feedData.reduce(
      (acc, cur) => acc.concat(cur.recentPosts),
      []
    );

    const sortedFeedCuratedPosts = feedCuratedPosts.sort(
      (a: any, b: any) => b.published - a.published
    );

    const postIds = sortedFeedCuratedPosts.map((post:any) => post.postId);
    
    if(postIds.length>0){

    
    const postsQuery = query(
      collection(db, "posts"),
      where(documentId(), "in", postIds)
    );
    const postsSnapshot = await getDocs(postsQuery);
    const postsData = postsSnapshot.docs.map((doc) => doc.data() as PostData);

    setUserFeed(postsData);
  }
    /* 
    const followedUsers = await db.collection('followers-feed')
      .where('users', 'array-contains', currentUser.uid)
      .orderBy('lastPost','desc')
      .limit(10)
      .get()
  
    const data = followedUsers.docs.map(doc=>doc.data());
    
    const posts = data.reduce((acc, cur)=>acc.concat(cur.recentPosts),[]);
    const sortedPosts = posts.sort((a,b)=>b.published))
  
   */
  }

  /* 
  async function fetchFollowedUsersPosts() {
    // Step 1: Fetch the list of users the current user is following
    const followingRef = collection(
      db,
      "following",
      currentUser.uid,
      "userFollowing"
    );
    const followingSnapshot = await getDocs(followingRef);
    const followingUserIds = followingSnapshot.docs.map((doc) => doc.id);
      console.log('logging in followingUserIDs')
      console.log(followingUserIds)
    // Step 2: Fetch the posts of each user in the list
    const allPosts: PostData[] = [];

    for (const userId of followingUserIds) {
      const userPostsRef = query(
        collection(db, "posts"),
        where("userID", "==", userId)
      );

      const userPostsSnapshot = await getDocs(userPostsRef);
      console.log(userPostsSnapshot)
      const userPosts = userPostsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as PostData[];
      allPosts.push(...userPosts);
    }

    // Step 3: Combine and sort the posts by the desired criteria (e.g., timestamp)
    const sortedPosts = allPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return sortedPosts;
  }

   */

  return (
    <div className="posts-wrapper">
      {userFeed.map((post, index) => (
        <div className="post-wrapper" key={index}>
          <div className="post-upper-row">
            <div>
              {queriedUser
                ? queriedUser.name + " " + queriedUser.surname
                : currentUser.displayName}
            </div>
          </div>

          <div className="post-middle-row">
            <div className="post-middle-text">{post.id}</div>

            <div className="post-middle-text">{post.title}</div>
            <div className="post-middle-content">{post.text}</div>
            <img src={post.image} alt="user chosen" />
          </div>
          {/* Add rendering for other post properties as needed */}
        </div>
      ))}
    </div>
  );
}

export default PostList;
