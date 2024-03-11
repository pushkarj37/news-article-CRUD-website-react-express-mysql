import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const { cat } = req.query;
  const query = cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts";

  db.query(query, [cat], (err, data) => {
    if (err) {
      console.error("Error retrieving posts:", err);
      return res.status(500).json("Internal server error.");
    }

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const query =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(query, [req.params.id], (err, data) => {
    if (err) {
      console.error("Error retrieving post:", err);
      return res.status(500).json("Internal server error.");
    }

    if (data.length === 0) {
      return res.status(404).json("Post not found!");
    }

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const query =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(query, [values], (err, data) => {
      if (err) {
        console.error("Error adding post:", err);
        return res.status(500).json("Internal server error.");
      }

      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;
    const query = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(query, [postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json("Internal server error.");
      }

      if (data.affectedRows === 0) {
        return res.status(403).json("You can delete only your post!");
      }

      return res.json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;
    const query =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    db.query(query, [...values, postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error updating post:", err);
        return res.status(500).json("Internal server error.");
      }

      if (data.affectedRows === 0) {
        return res.status(403).json("You can update only your post!");
      }

      return res.json("Post has been updated.");
    });
  });
};
