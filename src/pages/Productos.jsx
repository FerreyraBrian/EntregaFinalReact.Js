import { useEffect, useState } from "react";
import { fetchProducts, updateProduct, deleteProduct, addProduct } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Productos.css";
import { useAuth } from "../App";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", image: "", description: "" });
  const [modalId, setModalId] = useState(null);
  const { isAuthenticated } = useAuth();
  const [addForm, setAddForm] = useState({ name: "", price: "", image: "", description: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al obtener productos. Intenta más tarde.");
        setLoading(false);
      });
  }, []);

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditData({ name: product.name, price: product.price, image: product.image, description: product.description });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProduct(editId, editData);
      setProducts((prev) => prev.map((p) => (p.id === editId ? updated : p)));
      setEditId(null);
      setError("");
      toast.success("Producto editado correctamente");
    } catch (err) {
      setError("Error al editar producto");
      toast.error("Error al editar producto");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setModalId(null);
      setError("");
      toast.success("Producto eliminado correctamente");
    } catch (err) {
      setError("Error al eliminar producto");
      toast.error("Error al eliminar producto");
    }
  };

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
      const nuevo = await addProduct(addForm);
      setProducts((prev) => [...prev, nuevo]);
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

  // Filtrado de productos por búsqueda
  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = p.category?.toLowerCase().includes(search.toLowerCase());
    return nameMatch || categoryMatch;
  });

  if (loading) {
    return (
      <div className="productos-loader">
        <div className="productos-spinner"></div>
        <p className="productos-loading-text">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-container">
        <h1 className="productos-title">Nuestros Productos</h1>
        <div style={{color:'red',margin:'2rem auto',textAlign:'center'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className="productos-container">
      <h1 className="productos-title">Nuestros Productos</h1>
      {/* Barra de búsqueda */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',maxWidth:400,margin:'0 auto 1.5rem auto'}}>
        <FaSearch style={{color:'#0077b6'}} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '0.7rem 1rem',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
      </div>
      {/* Fin barra de búsqueda */}
      {error && <div style={{color:'red',marginBottom:'1rem'}}>{error}</div>}
      {/* Formulario para agregar productos */}
      {/* (Eliminado, ahora estará en AdminPage) */}
      {/* Fin formulario */}
      {filteredProducts.length > 0 ? (
        <div className="productos-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} style={{position:'relative'}}>
              {editId === product.id ? (
                <form onSubmit={handleEditSubmit} style={{background:'#f9f9f9',padding:'1rem',borderRadius:8,boxShadow:'0 2px 8px #eee'}}>
                  <input name="name" value={editData.name} onChange={handleEditChange} placeholder="Nombre" required style={{marginBottom:'0.5rem'}} />
                  <input name="price" value={editData.price} onChange={handleEditChange} placeholder="Precio" required type="number" min="0" style={{marginBottom:'0.5rem'}} />
                  <input name="image" value={editData.image} onChange={handleEditChange} placeholder="URL Imagen" required style={{marginBottom:'0.5rem'}} />
                  <textarea name="description" value={editData.description} onChange={handleEditChange} placeholder="Descripción" required style={{marginBottom:'0.5rem'}} />
                  <button type="submit" style={{background:'#0077b6',color:'#fff',border:'none',borderRadius:6,padding:'0.4rem 1rem',marginRight:'0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><FaSave /> Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)} style={{background:'#aaa',color:'#fff',border:'none',borderRadius:6,padding:'0.4rem 1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><FaTimes /> Cancelar</button>
                </form>
              ) : (
                <ProductCard product={product} />
              )}
              {isAuthenticated && editId !== product.id && (
                <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem',justifyContent:'center'}}>
                  <button onClick={()=>handleEdit(product)} style={{background:'#0077b6',color:'#fff',border:'none',borderRadius:6,padding:'0.3rem 0.7rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><FaEdit /> Editar</button>
                  <button onClick={()=>setModalId(product.id)} style={{background:'#e63946',color:'#fff',border:'none',borderRadius:6,padding:'0.3rem 0.7rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><FaTrash /> Eliminar</button>
                </div>
              )}
              {/* Modal de confirmación */}
              {modalId === product.id && (
                <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
                  <div style={{background:'#fff',padding:'2rem',borderRadius:12,boxShadow:'0 4px 16px #333'}}>
                    <h3>¿Seguro que deseas eliminar este producto?</h3>
                    <div style={{display:'flex',gap:'1rem',marginTop:'1rem',justifyContent:'center'}}>
                      <button onClick={()=>handleDelete(product.id)} style={{background:'#e63946',color:'#fff',border:'none',borderRadius:6,padding:'0.5rem 1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><FaTrash /> Sí, eliminar</button>
                      <button onClick={()=>setModalId(null)} style={{background:'#aaa',color:'#fff',border:'none',borderRadius:6,padding:'0.5rem 1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><FaTimes /> Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="productos-empty">No se encontraron productos.</p>
      )}
    </div>
  );
};

export default Productos;
