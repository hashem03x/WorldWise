
import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const { createNewCity, isLoading } = useCities()

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [isLoadingGeoCode, setIsLoadingGeoCode] = useState(false)
  const [geoCodeError, setGeoCodeError] = useState("")
  const [lat, lng] = useUrlPosition()
  const [emoji, setEmoji] = useState("");
  const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

  useEffect(() => {
    if (!lat && !lng) return
    async function fetchCityData() {
      setGeoCodeError("")
      setIsLoadingGeoCode(true)
      try {
        const response = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await response.json()
        if (!data.countryCode) throw new Error("That doesn't Seem To Be a City. Please click Somewhere Else.😉")
        setCityName(data.city || data.locality || "")
      } catch (err) {
        setGeoCodeError(err.message)
      } finally {
        setIsLoadingGeoCode(false)
      }
    }
    fetchCityData()
  }, [lat, lng])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!cityName || !date) return

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng
      },
    }
    await createNewCity(newCity)
    navigate("/app/cities");
  }

  if (isLoadingGeoCode) return <Spinner />
  if (geoCodeError) return <Message message={geoCodeError} />
  if (!lat && !lng) return <Message message="Start By Clicking Somewhere on the Map" />
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go To {cityName}?</label>
        <DatePicker dateFormat="dd/MM/yyy" selected={date} onChange={(date) => setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
