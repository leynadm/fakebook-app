import React, {useState} from "react";
import CreatePost from "./CreatePost";
import Feed from "./Feed";

function HomeContent() {

  return (
    <div>
      <CreatePost />
      <Feed />
    </div>
  );
}

export default HomeContent;
