import './home.css';
import Button from "./Button.jsx";

function Navbar() {
    return (
      <div className="container">
        <h1>Pagina de inicio</h1>
        <Button label="Iniciar Sesion" />
        <Button label="Registrarse" />
      </div>
    );
  }
  
  export default Navbar;