import { Navigate } from "react-router-dom";

function getCookie(name) {
  // Función para obtener el valor de una cookie por nombre
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function ProtectedRoute({ children }) {
  const token = getCookie("token"); // Cambia "token" por el nombre de la cookie que usas

  if (!token) {
    // Si no hay cookie de token, redirigimos a "/"
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectedRoute;