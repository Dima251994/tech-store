import ProductCard from "../../components/ProductCard/ProductCard";
import type { Product } from "../../types/product";
import "./CatalogPage.css";
import categories from "../../data/categories";
import { useState, useEffect } from "react";

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Не вдалося завантажити товари");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Сталася помилка");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === null || product.category === selectedCategory,
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((product) => {
      if (minPrice === null && maxPrice === null) {
        return true;
      }
      if (minPrice !== null && product.price < minPrice) {
        return false;
      }
      if (maxPrice !== null && product.price > maxPrice) {
        return false;
      }
      return true;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.price - b.price; // Від дешевих до дорогих
    }
    if (sortOption === "price-desc") {
      return b.price - a.price; // Від дорогих до дешевих
    }
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name, "uk"); // За алфавітом (А-Я)
    }
    if (sortOption === "name-desc") {
      return b.name.localeCompare(a.name, "uk"); // За алфавітом (Я-А)
    }
    return 0;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    console.log(`Selected category: ${category}`);
  };

  if (isLoading) return <p>Завантаження товарів...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <main className="main-content">
      <h2>Ласкаво просимо до TechStore</h2>
      <p>Тут ви можете знайти найкращі технології для вашого дому та роботи.</p>
      {categories.map((category) => (
        <div key={category}>
          <button type="button" onClick={() => handleCategoryClick(category)}>
            {category}
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setSelectedCategory(null)}>
        Усі товари
      </button>
      <input
        type="text"
        placeholder="Пошук товарів..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        <input
          type="number"
          placeholder="Мінімальна ціна"
          value={minPrice ?? ""}
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : null)
          }
        />
        <input
          type="number"
          placeholder="Максимальна ціна"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : null)
          }
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">За замовчуванням</option>
          <option value="price-asc">Ціна: від низької до високої</option>
          <option value="price-desc">Ціна: від високої до низької</option>
          <option value="name-asc">Назва: від А до Я</option>
          <option value="name-desc">Назва: від Я до А</option>
        </select>
      </div>
      <ul className="products-list">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))
        ) : (
          <p>Товарів по вашому запиту не знайдено</p>
        )}
      </ul>
    </main>
  );
}

export default CatalogPage;
