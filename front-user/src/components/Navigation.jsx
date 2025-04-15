import React from "react";
import { NavLink } from "react-router-dom";
// import s from "../style/navigation.module.css";
const Nivigation = () => {
  return (
    <div>
      <div>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="registration">Registration</NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Nivigation;
