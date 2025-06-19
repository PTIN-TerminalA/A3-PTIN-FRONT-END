import React, { useEffect, useState } from "react";
import './assets/ServiceRatings.css';

const _uri = "https://flysy.software";

function ServiceRatings({ serviceId, onClose }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${_uri}/api/service-ratings?service_id=${serviceId}`)
      .then(async (res) => {
        if (!res.ok) {
          let errorMsg = "Error carregant valoracions";
          try {
            const errData = await res.json();
            if (errData && errData.detail) {
              errorMsg = errData.detail;
            }
          } catch {}
          if (res.status === 404) {
            setRatings([]);
            setLoading(false);
            setError(errorMsg);
            return;
          } else {
            setError(errorMsg);
            setLoading(false);
            return;
          }
        }
        const data = await res.json();
        setRatings(Array.isArray(data.ratings) ? data.ratings : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error carregant valoracions");
        setLoading(false);
      });
  }, [serviceId]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3>Valoracions del servei</h3>
        {loading && <p>Carregant...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        {!loading && !error && ratings.length === 0 && <p>No hi ha valoracions.</p>}
        <ul className="ratings-list">
          {ratings.map((r, idx) => (
            <li key={idx} className="rating-item">
              {r.rating}/5
              <br />
              <span>{r.comment}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ServiceRatings;
