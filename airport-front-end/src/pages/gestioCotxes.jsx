import React from "react";

const fakeCotxes = [
  {
    _id: "cotxe001",
    battery: 78,
    state: "Disponible",
  },
  {
    _id: "cotxe002",
    battery: 45,
    state: "En curs",
  },
  {
    _id: "cotxe003",
    battery: 90,
    state: "Esperant",
  },
];

export default function GestionarCotxes() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Gestió de Cotxes</h1>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {fakeCotxes.map((cotxe) => (
          <div key={cotxe._id} style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>ID: {cotxe._id}</h2>
            <p>Bateria: <strong>{cotxe.battery}%</strong></p>
            <p>Estat: <span style={{ textTransform: "capitalize", fontWeight: "500" }}>{cotxe.state}</span></p>
            <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button style={btnStyle}>Disponible</button>
              <button style={btnStyle}>Solicitat</button>
              <button style={btnStyle}>Esperant</button>
              <button style={btnStyle}>En curs</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "0.4rem 0.75rem",
  background: "#eee",
  border: "1px solid #bbb",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem"
};

