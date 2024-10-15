import React from "react";
import Countryitem from "./CountryItem";
import styles from "./CountryList.module.css";
import { useCities } from "../context/CitiesContext";

export default function CountryList() {
  const { cities } = useCities();
  return (
    <ul className={styles.countryList}>
      {cities.map((city) => (
        <Countryitem
          emoji={city.emoji}
          name={city.country}
          key={city.country}
        />
      ))}
    </ul>
  );
}
