const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${parseFloat(product.price).toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
