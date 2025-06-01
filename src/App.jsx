import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="container">
      
      <Navbar />
      <Home />
      <Productos />
      <Contacto />
      <Footer />

    </div>
  );
}

export default App;
