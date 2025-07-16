import { Link } from "react-router-dom";
import { useContext } from "react";
import { CarritoContext } from "../App";

const ProductCard = ({ product }) => {
  const { agregarAlCarrito } = useContext(CarritoContext);
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>${parseFloat(product.price).toFixed(2)}</p>
        <button onClick={e => { e.preventDefault(); agregarAlCarrito(product); }} style={{marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#0077b6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Agregar al carrito</button>
      </div>
    </Link>
  );
};

export default ProductCard;
