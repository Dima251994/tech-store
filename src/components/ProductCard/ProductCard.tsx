import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const [, , addToCart] = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>
        Ціна:{" "}
        {product.price.toLocaleString("uk-UA", {
          style: "currency",
          currency: "UAH",
        })}
      </p>
      <p>{product.inStock ? "Є в наявності" : "Немає в наявності"}</p>
      <Link to={`/products/${product.id}`} className="details-button">
        Детальніше
      </Link>
      <button
        type="button"
        disabled={!product.inStock}
        onClick={() => addToCart(product)}
      >
        {product.inStock ? "Додати в кошик" : "Немає в наявності"}
      </button>
    </div>
  );
}

export default ProductCard;
