import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
        );

        if (response.status === 404) {
          setProduct(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Помилка при завантаженні товару");
        }

        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Сталася помилка");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <p>Завантаження товару...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Товар не знайдено</p>;
  }

  const specifications = Object.entries(product.specifications || {});

  return (
    <main className="main-content">
      <Link to="/">Назад до каталогу</Link>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>
        Ціна:{" "}
        {product.price.toLocaleString("uk-UA", {
          style: "currency",
          currency: "UAH",
        })}
      </p>
      <p>{product.inStock ? "Є в наявності" : "Немає в наявності"}</p>
      {specifications.length > 0 && (
        <div>
          <h3>Характеристики:</h3>
          <ul>
            {specifications.map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

export default ProductPage;
