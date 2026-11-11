import { useLocation } from "react-router-dom";
import type { CartItem } from "../../context/CartContext";
import "./OrderSuccessPage..css";

function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;
  console.log(order);

  if (!order) {
    return <p>Дані замовлення не знайдено.</p>;
  }

  return (
    <div className="order-success">
      <h1>Замовлення успішно оформлено!</h1>
      <p>Дякуємо за ваше замовлення, {order.customer.fullName}!</p>
      <p>Номер телефону: {order.customer.phone}</p>
      <p>Місто: {order.customer.city}</p>
      <p>Адреса доставки: {order.customer.address}</p>
      <p>
        Спосіб оплати:{" "}
        {order.customer.paymentMethod === "cod"
          ? "Оплата при отриманні"
          : "Онлайн-оплата"}
      </p>
      <p>Дата замовлення: {new Date(order.createdAt).toLocaleString()}</p>
      <p>Ваше замовлення</p>
      {order.items.map((item: CartItem) => (
        <div className="order-item" key={item.product.id}>
          <p>Назва продукту: {item.product.name}</p>
          <p>
            Ціна за одиницю: {item.product.price.toLocaleString("uk-UA")} грн
          </p>
          <p>Кількість: {item.quantity}</p>
          <p>
            Сума: {(item.product.price * item.quantity).toLocaleString("uk-UA")}{" "}
            грн
          </p>
        </div>
      ))}
      <p>Загальна сума: {order.total.toLocaleString("uk-UA")} грн</p>
    </div>
  );
}

export default OrderSuccessPage;
