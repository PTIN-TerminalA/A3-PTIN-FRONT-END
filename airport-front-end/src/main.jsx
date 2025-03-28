import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Prueba from "./pages/prueba.jsx"
const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>  
    <Prueba /> 
  </StrictMode>
)
