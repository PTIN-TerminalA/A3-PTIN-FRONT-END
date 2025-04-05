import Navbar from "../components/Navbar.jsx";
import Textbox from "../components/Textbox.jsx";

const whoAreWe = `
  Amb Vilanova Intelligent Airport és més fàcil que mai aprofitar el temps a l'aeroport. Amb la nostra app, pots gaudir d'una experiència única. No tornaràs a perdre un vol per estar mirant botigues dins de l'aeroport o per voler anar a menjar alguna cosa.
  

  Amb la nostra app podràs veure totes les botigues i restaurants de l'aeroport, així com els seus horaris d'obertura i tancament.
  A més, podràs veure quines botigues estan més a prop de la teva porta d'embarcament i podràs fer un recorregut personalitzat perquè un dels nostres vehicles autònoms et porti a les botigues o restaurants que vulguis visitar.


  Amb Vilanova Intelligent Airport, el temps d'espera a l'aeroport es converteix en una experiència agradable i productiva.
  
  
  Pots registrar-te des d'aquesta mateixa pàgina web o descarregar-te la nostra aplicació per a smartphones que et permetrà reservar els vehicles així com accedir a tots els nostres serveis.
`;

function Home() {
    return (
    <div>
      <Navbar />
      <Textbox title = "¿Qui som?" textin ={whoAreWe}/>
    </div>
    );
  }
  
  export default Home;