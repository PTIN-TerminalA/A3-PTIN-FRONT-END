import { Routes, Route } from "react-router-dom";

// Importem totes les pàgines de la carpeta /src/pages
// Amb la funció import.meta.glob, podem importar tots els arxius d'una carpeta
const pages = import.meta.glob("/src/pages/*.jsx", { eager: true });

function AppRoutes() {
  return (
    <Routes>
      {Object.entries(pages).map(([path, module]) => {
        // Agafem el nom del arxiu sense l'extensió
        const name = path.split("/").pop().replace(".jsx", "");

        // Fem que l'arxiu home.jsx sigui la pàgina principal (/)
        const routePath = name.toLowerCase() === "home" ? "/" : `/${name.toLowerCase()}`;

        return <Route key={routePath} path={routePath} element={<module.default />} />;
      })}
    </Routes>
  );
}

export default AppRoutes;
