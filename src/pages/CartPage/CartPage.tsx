import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

function CartPage() {
  const [cart, , , removeFromCart, increaseQuantity, decreaseQuantity] =
    useCart();

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div>
      <h1>Кошик</h1>
      {cart.length === 0 ? (
        <p>Ваш кошик порожній</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.product.id}>
              <p>{item.product.name}</p>
              <p>Кількість: {item.quantity}</p>
              <p>Ціна: {item.product.price.toLocaleString("uk-UA")} грн</p>
              <p>
                Загальна ціна:{" "}
                {(item.product.price * item.quantity).toLocaleString("uk-UA")}{" "}
                грн
              </p>
              <button onClick={() => removeFromCart(item.product.id)}>
                Видалити
              </button>
              <button
                disabled={item.quantity >= item.product.stockQuantity}
                type="button"
                onClick={() => increaseQuantity(item.product.id)}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => decreaseQuantity(item.product.id)}
              >
                -
              </button>
            </li>
          ))}
        </ul>
      )}
      <p>Загальна сума замовлення: {totalPrice.toLocaleString("uk-UA")} грн</p>
      {cart.length > 0 && <Link to="/checkout">Оформити замовлення</Link>}
    </div>
  );
}

export default CartPage;
