import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Productos.css";

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="productos-loader">
        <div className="productos-spinner"></div>
        <p className="productos-loading-text">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="productos-container">
      <h1 className="productos-title">Nuestros Productos</h1>
      {products.length > 0 ? (
        <div className="productos-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="productos-empty">No se encontraron productos.</p>
      )}
    </div>
  );
};

export default Productos;
