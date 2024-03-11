import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;
  const [content, setContent] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw new Error("Failed to upload file. Please try again later.");
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !cat.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const imgUrl = file ? await upload() : "";

      const postData = {
        title,
        desc: content,
        cat,
        img: imgUrl,
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      };

      if (state) {
        await axios.put(`/posts/${state.id}`, postData);
      } else {
        await axios.post(`/posts/`, postData);
      }

      navigate("/");
    } catch (err) {
      console.error("Error publishing post:", err);
      setError("Failed to publish post. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Visibility:</b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button onClick={handleClick} disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "politics"}
              name="cat"
              value="politics"
              id="politics"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="politics">Politics</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "business"}
              name="cat"
              value="business"
              id="business"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="business">Business</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "sports"}
              name="cat"
              value="sports"
              id="sports"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="sports">Sports</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "tech"}
              name="cat"
              value="tech"
              id="tech"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="tech">Tech</label>
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Write;
