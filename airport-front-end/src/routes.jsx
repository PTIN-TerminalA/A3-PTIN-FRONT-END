import { Routes, Route, Navigate } from "react-router-dom";

const pages = import.meta.glob("/src/pages/*.jsx", { eager: true });

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function ProtectedRoute({ children }) {
  const token = getCookie("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  // Definimos rutas públicas que no necesitan token
  const publicRoutes = ["/", "/login", "/register", "/psswdrecov"];

  return (
    <Routes>
      {Object.entries(pages).map(([path, module]) => {
        const name = path.split("/").pop().replace(".jsx", "");
        const routePath = name.toLowerCase() === "home" ? "/" : `/${name.toLowerCase()}`;

        // Si es una ruta pública, no aplicamos protección
        if (publicRoutes.includes(routePath)) {
          return <Route key={routePath} path={routePath} element={<module.default />} />;
        }

        // Para el resto, protegemos con token
        return (
          <Route
            key={routePath}
            path={routePath}
            element={
              <ProtectedRoute>
                <module.default />
              </ProtectedRoute>
            }
          />
        );
      })}
    </Routes>
  );
}

export default AppRoutes;
