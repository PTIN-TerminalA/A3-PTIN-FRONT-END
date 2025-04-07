import React from 'react';
import './assets/ReservaCard.css';

const ReservaCard = ({ reserva }) => {
  return (
    <div className="reserva-card">
      <p><strong>DNI:</strong> {reserva.dni}</p>
      <p><strong>Data:</strong> {reserva.data}</p>
      <p><strong>Hora:</strong> {reserva.hora}</p>
      <p><strong>Matrícula:</strong> {reserva.matricula}</p>
      <p><strong>Tipus:</strong> {reserva.tipus}</p>
    </div>
  );
};

export default ReservaCard;
