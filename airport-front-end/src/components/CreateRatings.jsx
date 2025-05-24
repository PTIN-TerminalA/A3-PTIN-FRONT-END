import React, { useState } from "react";
import './assets/CreateRatings.css';
import Cookies from 'js-cookie';

const _uri = "http://localhost:8000";


function CreateRatings({ serviceId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('service_id', serviceId);
      formData.append('rating', rating);
      formData.append('comment', comment);
      const res = await fetch(`${_uri}/api/rate-service`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error("Error enviant la valoració");
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3>Valora el servei</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Puntuació:
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <br />
          <label>
            Comentari:
            <textarea value={comment} onChange={e => setComment(e.target.value)} required />
          </label>
          <br />
          <button type="submitRating" disabled={loading}>{loading ? "Enviant..." : "Enviar"}</button>
          {error && <p style={{color:'red'}}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateRatings;
