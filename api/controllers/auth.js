import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // Input validation
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.status(400).json("All fields are required.");
  }

  // Check existing user
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).json("Internal server error.");
    }
    if (data.length) {
      return res.status(409).json("User already exists!");
    }

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insertQuery = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(insertQuery, [values], (err, data) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(500).json("Internal server error.");
      }
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  // Input validation
  if (!req.body.username || !req.body.password) {
    return res.status(400).json("Username and password are required.");
  }

  // Check user existence
  const selectQuery = "SELECT * FROM users WHERE username = ?";
  db.query(selectQuery, [req.body.username], (err, data) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json("Internal server error.");
    }
    if (data.length === 0) {
      return res.status(404).json("User not found!");
    }

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password!");
    }

    // Generate JWT token
    const token = jwt.sign({ id: data[0].id }, "jwtkey", { expiresIn: '1h' });

    // Omit sensitive data from response
    const { password, ...other } = data[0];

    // Set JWT token as cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      // Secure cookie only in production
      secure: true,
      // Limit cookie scope to the same site
      sameSite: 'strict'
    }).status(200).json(other);
  });
};

export const logout = (req, res) => {
  // Clear JWT token cookie
  res.clearCookie("access_token").status(200).json("User has been logged out.");
};
