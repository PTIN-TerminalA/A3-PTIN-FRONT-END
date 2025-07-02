// src/pages/UserFlights.jsx
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function UserFlights() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    fetch("https://flysy.software/api/flights", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(console.error);
  }, []);

  return (
    <div className="user-flights">
      <h1>Els meus vols</h1>
      <table className="flight-table">
        <thead>
          <tr>
            <th>Aerolínia</th>
            <th>Origen</th>
            <th>Destinació</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.id}>
              <td>{flight.airline}</td>
              <td>{flight.route.originName}</td>
              <td>{flight.route.destinationName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
