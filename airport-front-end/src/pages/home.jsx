import Navbar from "../components/Navbar.jsx";
import Textbox from "../components/Textbox.jsx";

const whoAreWe = `
  Con Vilanova Intelligent Airport es más fácil que nunca aprovechar el tiempo en el aeropuerto. Con nuestra app, puedes disfrutar de una experiencia única. No volverás a perder un vuelo por estar
  viendo tiendas dentro del aeropuerto o por querer ir a comer algo. 
  

  Con nuestra app podrás ver todas las tiendas y restaurantes del aeropuerto, así como sus horarios de apertura y cierre.
  Además, podrás ver qué tiendas están más cerca de tu puerta de embarque y podrás hacer un recorrido personalizado para que uno de nuestros vehiculos autonomos te lleve a las tiendas o restaurantes que
  quieras visitar.


  Con Vilanova Intelligent Airport, el tiempo de espera en el aeropuerto se convierte en una experiencia
  agradable y productiva.
  
  
  Puedes registrarte desde esta misma página web o descargarte nuestra aplicacion para smartphones que te permitirá reservar los vehiculos así como acceder a todos nuestros servicios.
`;

function Home() {
    return (
    <div>
      <Navbar />
      <Textbox title = "¿Quienes somos?" textin ={whoAreWe}/>
    </div>
    );
  }
  
  export default Home;