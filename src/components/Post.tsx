import React, { useState } from "react";
import CommentInput from "./CommentInput";
import { PostData } from "../types/postdata";
import getTimeDifference from "../utils/getTimeDifference";
interface PostProps {
  post: PostData;
  index: number;
}

const Post: React.FC<PostProps> = ({ post, index }) => {
  const [showCommentsInput, setShowCommentInput] = useState(false);

  function toggleCommentInput() {
    setShowCommentInput(!showCommentsInput);
  }

  return (
    <div className="post-wrapper" key={index}>
      <div className="post-upper-row">
        <div className="post-upper-row-user-image-wrapper">
          <img
            className="post-upper-row-user-image"
            src={post.profileImage}
            alt="user profile"
          />
        </div>
        <div className="post-upper-row-user-details-wrapper">
          <div className="post-upper-row-user-name">
            {post.name + " " + post.surname}
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

      <div className="post-bottom-row">
        <button className="post-see-comments-btn" onClick={toggleCommentInput}>
          <span className="material-symbols-outlined post-leave-comment-icon">
            rate_review
          </span>{" "}
          {post.commentsCount === 0 ? (
            <p>This post has no comments...</p>
          ) : (
            <p>Check the {post.commentsCount} of this post</p>
          )}
        </button>
      </div>

      <div className="post-comments-section"></div>

      {showCommentsInput && <CommentInput postId={post.postId} />}
    </div>
  );
};

export default Post;
