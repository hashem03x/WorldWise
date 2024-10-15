import React from "react";
import style from "./AppNav.module.css";
import { NavLink } from "react-router-dom";
function AppNav() {
  return (
    <div className={style.nav}>
      <ul>
        <li>
          <NavLink to="cities">Cities</NavLink>
        </li>
        <li>
          <NavLink to="countries">Countries</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default AppNav;
