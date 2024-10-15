import React from "react";
import styles from "./CountryItem.module.css";
function CountryItem({ name, emoji }) {
  return (
    <li className={styles.countryItem}>
      <span>{emoji}</span>
      <span>{name}</span>
    </li>
  );
}

export default CountryItem;
