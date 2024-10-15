import { useEffect, createContext, useContext, useReducer, useCallback } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();


const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};


function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true }
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload }
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload }
    case "city/created":
      return { ...state, isLoading: false, cities: [...state.cities, action.payload], currentCity: action.payload }
    case "city/deleted":
      return { ...state, isLoading: false, cities: state.cities.filter((city) => action.payload !== city.id), currentCity: {} }
    default: throw new Error("Unkown Action Type");
  }
}


function CitiesProvider({ children }) {

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        alert("There Was an error Loading Cities");
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(

    async function getCity(id) {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        alert("There Was an error Loading Data");
      }
    }
    , [])


  async function createNewCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      alert("There Was an error Creating City.");
    }
  }
  async function DeleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      alert("There Was an error Deleting City");
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, getCity, currentCity, createNewCity, DeleteCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("Context is Used Outside the Cities Provider");
  return context;
}

export { CitiesProvider, useCities };
