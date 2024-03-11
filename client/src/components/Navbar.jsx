import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.svg";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=politics">
            <h6>POLITICS</h6>
          </Link>
          <Link className="link" to="/?cat=business">
            <h6>BUSINESS</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>SCIENCE</h6>
          </Link>
          <Link className="link" to="/?cat=sports">
            <h6>SPORTS</h6>
          </Link>
          <Link className="link" to="/?cat=tech">
            <h6>TECH</h6>
          </Link>
          
          
          {currentUser ? (
            <>
            <span className="simpleButton">{currentUser?.username}</span>
            <span className="simpleButton" onClick={logout}>logout</span>
            <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
          </>
          ) : (
            <span className="simpleButton">
              <Link className="link" to="/login">
              login
            </Link>

            </span>
            
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
