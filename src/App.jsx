import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from "react";
import { fetchProducts, addProduct } from "./services/api";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Componente de ejemplo para la ruta dinámica
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((products) => {
      const found = products.find((p) => p.id === id);
      setProduct(found);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Cargando producto...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%' }} />
      <h2>{product.name}</h2>
      <p>${parseFloat(product.price).toFixed(2)}</p>
      <p>{product.description}</p>
    </div>
  );
};


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('auth', 'false');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};


const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.user === 'admin' && form.pass === '1234') {
      login();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      margin: '2rem auto',
      maxWidth: 400,
      padding: '2rem',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#0077b6', marginBottom: '1rem' }}>Iniciar sesión</h2>
        <input
          type="text"
          name="user"
          placeholder="Usuario"
          value={form.user}
          onChange={handleChange}
          required
          style={{
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <input
          type="password"
          name="pass"
          placeholder="Contraseña"
          value={form.pass}
          onChange={handleChange}
          required
          style={{
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        {error && <div style={{color:'red',textAlign:'center'}}>{error}</div>}
        <button
          type="submit"
          style={{
            padding: '0.8rem',
            backgroundColor: '#0077b6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};


const AdminPage = () => {
  const { logout } = useAuth();
  // Estado y lógica del formulario de agregar producto
  const [addForm, setAddForm] = useState({ name: "", price: "", image: "", description: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError("");
    // Validaciones
    if (!addForm.name.trim()) {
      setAddError("El nombre es obligatorio");
      toast.error("El nombre es obligatorio");
      return;
    }
    if (Number(addForm.price) <= 0) {
      setAddError("El precio debe ser mayor a 0");
      toast.error("El precio debe ser mayor a 0");
      return;
    }
    if (!addForm.description || addForm.description.length < 10) {
      setAddError("La descripción debe tener al menos 10 caracteres");
      toast.error("La descripción debe tener al menos 10 caracteres");
      return;
    }
    setAddLoading(true);
    try {
      await addProduct(addForm);
      setAddForm({ name: "", price: "", image: "", description: "" });
      setAddError("");
      toast.success("Producto agregado correctamente");
    } catch (err) {
      setAddError("Error al agregar producto");
      toast.error("Error al agregar producto");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Panel de Admin</h2>
      <button onClick={logout}>Cerrar sesión</button>
      {/* Formulario para agregar productos */}
      <form onSubmit={handleAddSubmit} style={{background:'#f9f9f9',padding:'1rem',borderRadius:8,boxShadow:'0 2px 8px #eee',maxWidth:400,margin:'2rem auto',display:'flex',flexDirection:'column',gap:'0.7rem'}}>
        <h3 style={{color:'#0077b6',marginBottom:0}}>Agregar Producto</h3>
        <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Nombre" required />
        <input name="price" value={addForm.price} onChange={handleAddChange} placeholder="Precio" required type="number" min="0" />
        <input name="image" value={addForm.image} onChange={handleAddChange} placeholder="URL Imagen" required />
        <textarea name="description" value={addForm.description} onChange={handleAddChange} placeholder="Descripción" required minLength={10} />
        {addError && <div style={{color:'red'}}>{addError}</div>}
        <button type="submit" disabled={addLoading} style={{background:'#0077b6',color:'#fff',border:'none',borderRadius:6,padding:'0.5rem 1.2rem',marginTop:'0.5rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <FaPlus /> {addLoading ? 'Agregando...' : 'Agregar'}
        </button>
      </form>
      {/* Fin formulario */}
    </div>
  );
};

import React from "react";
export const CarritoContext = React.createContext();

const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

const CarritoPage = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useContext(CarritoContext);
  const total = carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketItems, setTicketItems] = useState([]);

  const handlePedido = () => {
    setTicketItems([...carrito]);
    setShowTicket(true);
    vaciarCarrito();
  };

 
  const handleCerrarTicket = () => {
    setShowTicket(false);
  };

  const ticketTotal = ticketItems.reduce((acc, p) => acc + p.price * p.cantidad, 0);

  return (
    <div style={{maxWidth:600,margin:'2rem auto',background:'#fff',borderRadius:12,padding:'2rem',boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}}>
      <h2 style={{color:'#0077b6'}}>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul style={{listStyle:'none',padding:0}}>
            {carrito.map((p) => (
              <li key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem',borderBottom:'1px solid #eee',paddingBottom:'0.5rem'}}>
                <span>{p.name} x{p.cantidad}</span>
                <span>${(p.price * p.cantidad).toFixed(2)}</span>
                <button onClick={() => eliminarDelCarrito(p.id)} style={{background:'#e63946',color:'#fff',border:'none',borderRadius:6,padding:'0.3rem 0.7rem',cursor:'pointer'}}>Eliminar</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={vaciarCarrito} style={{background:'#0077b6',color:'#fff',border:'none',borderRadius:8,padding:'0.6rem 1.2rem',cursor:'pointer',marginTop:'1rem',marginRight:'1rem'}}>Vaciar carrito</button>
          <button 
            onClick={handlePedido}
            disabled={carrito.length === 0}
            style={{
              background:'#43aa8b',
              color:'#fff',
              border:'none',
              borderRadius:8,
              padding:'0.6rem 1.2rem',
              cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
              marginTop:'1rem'
            }}
          >
            Realizar pedido
          </button>
        </>
      )}
      {/* Modal de ticket */}
      {showTicket && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:12,boxShadow:'0 4px 16px #333',maxWidth:400}}>
            <h2 style={{color:'#0077b6'}}>¡Gracias por tu compra!</h2>
            <h4>Ticket de pedido:</h4>
            <ul style={{listStyle:'none',padding:0}}>
              {ticketItems.map((p) => (
                <li key={p.id} style={{marginBottom:'0.5rem'}}>
                  {p.name} x{p.cantidad} - ${ (p.price * p.cantidad).toFixed(2) }
                </li>
              ))}
            </ul>
            <h3>Total: ${ticketTotal.toFixed(2)}</h3>
            <button onClick={handleCerrarTicket} style={{background:'#0077b6',color:'#fff',border:'none',borderRadius:8,padding:'0.6rem 1.2rem',cursor:'pointer',marginTop:'1rem'}}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <CarritoProvider>
      <AuthProvider>
        <Router>
          <div className="container">
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/carrito" element={
                <ProtectedRoute>
                  <CarritoPage />
                </ProtectedRoute>
              } />
              {}
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </CarritoProvider>
  );
}

export default App;
