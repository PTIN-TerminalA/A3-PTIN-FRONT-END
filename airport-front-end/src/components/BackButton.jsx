import React from "react";
import { useNavigate } from "react-router-dom";
import "./assets/BackButton.css";

function BackButton({ label = "Volver" }) {
  const navigate = useNavigate();
  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      {label}
    </button>
  );
}

export default BackButton;
