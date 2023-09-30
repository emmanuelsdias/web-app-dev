import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import cities from './citiesData';
import './index.css'

function App() {
  const [selectedCity, selectCity] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:3001/city/${selectedCity}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.json();
        })
        .then(data => {
          setCityInfo(data);
        })
        .catch(error => {
          console.error("Error fetching city details:", error);
        });
    }
  }, [selectedCity]);

  const closeInfos = (e) => {
    e.stopPropagation();
    setCityInfo(null);
    selectCity(null);
  };

  return (
    <div>
      <ul>
        {cities.map(city => (
          <li key={city} onClick={() => selectCity(city)}>
            {city}
            {city === selectedCity && cityInfo && (
              <div>
                <p><strong>Country:</strong> {cityInfo.country}</p>
                <img src={cityInfo.imagePath} alt="City Image" />
                <p><i>{cityInfo.description}</i></p>
                <button onClick={(e) => closeInfos(e)}>Close</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
