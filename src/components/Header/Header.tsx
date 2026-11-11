import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Header.css";

function Header() {
  const [cart] = useCart();

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <h1>TechStore</h1>
      <Link to="/" className="nav-link">
        Каталог
      </Link>
      <Link to="/cart" className="nav-link">
        &#128722; Кошик {totalQuantity}
      </Link>
    </header>
  );
}

export default Header;
