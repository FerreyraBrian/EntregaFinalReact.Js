import { useState, useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { CarritoContext } from "../App";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login, logout } = useAuth ? useAuth() : { isAuthenticated: false };
  const { carrito } = useContext(CarritoContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Mi Tienda - Talento Tech React.js</div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/carrito"><span style={{background:'#0077b6',color:'#fff',borderRadius:'8px',padding:'0.2rem 0.7rem',marginLeft:'0.5rem'}}>🛒 {carrito.reduce((acc, p) => acc + p.cantidad, 0)}</span></Link></li>
      </ul>
      <div style={{marginLeft: '1rem'}}>
        {isAuthenticated ? (
          <button onClick={logout} style={{background: 'none', color: '#fff', border: 'none', cursor: 'pointer'}}>Logout</button>
        ) : (
          <button onClick={login} style={{background: 'none', color: '#fff', border: 'none', cursor: 'pointer'}}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
