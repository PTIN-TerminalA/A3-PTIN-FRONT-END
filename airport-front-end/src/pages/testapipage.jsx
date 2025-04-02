import React, { useEffect, useState } from "react";

const TestApiPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al conectar con el backend.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Prueba de Conexión con FastAPI</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {data && <p>{data.message}</p>}
    </div>
  );
};

export default TestApiPage;