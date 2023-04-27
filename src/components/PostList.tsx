import React, { useState, useEffect, useContext } from "react";
import { PostContext } from "./PostContext";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";

interface Post {
  userID: string;
  text: string;
  createdAt?: Timestamp;
}

function PostList() {
  const { currentUser } = useContext(AuthContext);
  const { updateKey} = useContext(PostContext);
  const [userFeed, setUserFeed] = useState<Post[]>([]);

  useEffect(() => {
    getUserPosts();
  }, [updateKey]);

  async function getUserPosts() {
    const q = query(
      collection(db, "posts"),
      where("userID", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);

    const tempUserFeed: Post[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const post = doc.data() as Post;
      tempUserFeed.push(post);
      //console.log(doc.id, " => ", doc.data());
    });

    setUserFeed(tempUserFeed);
  }

  return (
    <div>

      {userFeed.map((post, index) => (
        <div key={index}>
          <div>{currentUser.displayName}</div>
          <div>{post.text}</div>
          <div>{post.createdAt?.toDate().toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
