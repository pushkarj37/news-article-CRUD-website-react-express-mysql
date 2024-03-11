import React from "react";
import Logo from "../img/logo.svg";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
        <b>"news article CRUD website" made with react-node-express-mysql</b>
      </span>
    </footer>
  );
};

export default Footer;
