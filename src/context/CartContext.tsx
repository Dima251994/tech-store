import type { Product } from "../types/product";
import {
  type ReactNode,
  type SetStateAction,
  type Dispatch,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = [
  CartItem[],
  Dispatch<SetStateAction<CartItem[]>>,
  addToCart: (product: Product) => void,
  removeFromCart: (productId: number) => void,
  increaseQuantity: (productId: number) => void,
  decreaseQuantity: (productId: number) => void,
];

const CartContext = createContext<CartContextType | null>(null);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (!storedCart) return [];

      const parsedData = JSON.parse(storedCart);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product: Product) {
    if (product.inStock === false) {
      alert("Товар відсутній на складі");
      return;
    }

    setCart((prevCart) => {
      // Шукаємо товар в актуальному стані кошика
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id,
      );

      // Перевіряємо, чи не досягнуто ліміту складу
      if (existingItem && existingItem.quantity >= product.stockQuantity) {
        alert("Досягнуто максимальної кількості товару на складі");
        return prevCart; // Повертаємо старий кошик без змін
      }

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  }

  // Функція для видалення товару з кошика
  function removeFromCart(productId: number) {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  }

  // Функція для збільшення кількості товару
  function increaseQuantity(productId: number) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId &&
        item.quantity < item.product.stockQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  // Функція для зменшення кількості товару
  function decreaseQuantity(productId: number) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <CartContext.Provider
      value={[
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      ]}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("значення немає");
  }

  return context;
};

export default CartProvider;
