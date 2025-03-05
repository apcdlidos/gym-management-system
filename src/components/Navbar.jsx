import { useState, Children } from "react";
import "../styles/Navbar.css";
const Navbar = ({ children }) => {
  return (
    <header className="navbar">
      <h3 className="navtitle">Client</h3>
      {Children.map(children, (child) => {
        return <li className="navlink">{child}</li>;
      })}
    </header>
  );
};

export default Navbar;
