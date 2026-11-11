import { Link, useParams } from "react-router-dom";
import products from "../../data/products";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams();

  const product = products.find((product) => product.id === Number(id));

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
