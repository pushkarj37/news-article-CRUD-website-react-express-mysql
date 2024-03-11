import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`/posts/${postId}`);
      setPost(res.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching post:", err);
      setPost(null);
      setLoading(false);
      setError("Failed to fetch post. Please try again later.");
    }
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again later.");
    }
  };

  return (
    <div className="single">
      {loading ? (
        <p>Loading...</p>
      ) : post ? (
        <>
          <div className="content">
            <div className="imgContainer">
              <img src={`/upload/${post?.img}`} alt="" />
            </div>
            <div className="user">
              {post.userImg && <img src={post.userImg} alt="" />}
              <div className="info">
                {post.username && <span>{post.username}</span>}
                {post.date && <p>Posted {moment(post.date).fromNow()}</p>}
              </div>
              {currentUser && currentUser.username === post.username && (
                <div className="edit">
                  <Link to={`/write?edit=${postId}`} state={post}>
                    <button className="editBtn">Edit</button>
                  </Link>
                  <button onClick={handleDelete} className="deleteBtn">
                    Delete
                  </button>
                </div>
              )}
            </div>
            <h1>{post.title}</h1>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc),
              }}
            ></p>
          </div>
          <Menu cat={post.cat} />
        </>
      ) : (
        <p>{error || "No post found"}</p>
      )}
    </div>
  );
};

export default Single;
