import React, { useState, useEffect, useContext } from "react";
import { PostContext } from "./PostContext";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
  doc
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";
import { User } from "../types/user";
import "../styles/PostList.css"


interface Post {
  userID: string;
  text: string;
  createdAt: Timestamp;
  image?:string
}

function PostList() {
  const { currentUser } = useContext(AuthContext);
  const { updateKey} = useContext(PostContext);
  const [userFeed, setUserFeed] = useState<Post[]>([]);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();

  useEffect(() => {
    getUserPosts();
  }, [updateKey]);

  async function getUserPosts() {
  
    const q = query(
      collection(db, "posts"),
      where("userID", "==", currentUser.uid)
    );
  
    
    const querySnapshot = await getDocs(q);

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      const userData = docSnap.data() as User;
      setQueriedUser(userData);
    }

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
    <div className="posts-wrapper">

      {userFeed.map((post, index) => (
        <div className="post-wrapper" key={index}>

          <div className="post-upper-row">
            
            <div>{queriedUser ? queriedUser.name + " " + queriedUser.surname : currentUser.displayName}</div>
            <div>{post.createdAt.toDate().toLocaleString()}</div>
          
          </div>

          <div className="post-middle-row">

          <div className="post-middle-text">{post.text}</div>
          {post.image && <img className="post-middle-image" src={post.image} alt="random" />}
          </div>



        </div>
      ))}
    </div>
  );
}

export default PostList;
