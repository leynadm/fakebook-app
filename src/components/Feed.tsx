import React from "react";
import "../styles/Feed.css"
import PostList from "./PostList";
function Feed(){

    return(
        <div className="feed-wrapper">
            <PostList/>            
        </div>
    )
}

export default Feed