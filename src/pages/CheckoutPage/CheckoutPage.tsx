import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    paymentMethod: "cod",
  });

  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Ваш кошик порожній!");
      return;
    }

    if (cart.some((item) => item.quantity > item.product.stockQuantity)) {
      alert(
        "Вибачте, деякі товари у вашому кошику недоступні в потрібній кількості.",
      );
      return;
    }

    const trimmedFullName = formData.fullName.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedCity = formData.city.trim();
    const trimmedAddress = formData.address.trim();

    if (!trimmedFullName) {
      alert("Будь ласка, введіть коректне ім'я та прізвище.");
      return;
    }

    // Перевірка номеру телефону
    const allowedCharsRegex = /^[+]?[\d\s\-()]+$/;
    if (!allowedCharsRegex.test(trimmedPhone)) {
      alert("Номер містить недопустимі символи.");
      return;
    }

    const digitsOnly = trimmedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      alert("Номер телефону повинен містити щонайменше 10 цифр.");
      return;
    }

    if (!trimmedCity) {
      alert("Будь ласка, введіть коректне місто.");
      return;
    }

    if (!trimmedAddress) {
      alert("Будь ласка, введіть коректну адресу.");
      return;
    }

    const orderData = {
      ...formData,
      fullName: trimmedFullName,
      phone: trimmedPhone,
      city: trimmedCity,
      address: trimmedAddress,
    };

    const order = {
      customer: orderData,
      items: cart,
      total: cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      createdAt: new Date().toISOString(),
    };

    setCart([]);

    navigate("/order-success", {
      state: { order },
    });
  }

  return (
    <>
      <div className="checkout-page">
        <p>Сторінка замовлення</p>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Ім'я та прізвище:</label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Номер телефону:</label>
            <input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Місто:</label>
            <input
              id="city"
              type="text"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Адреса доставки:</label>
            <input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Спосіб оплати: </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
            >
              <option value="cod">Оплата при отриманні</option>
              <option value="online">Онлайн-оплата</option>
            </select>
          </div>

          <button type="submit">Оформити замовлення</button>
        </form>
      </div>
    </>
  );
}

export default CheckoutPage;
