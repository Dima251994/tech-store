import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { pool } from "../config/database.js";

export const getAllProducts = async (req: Request, res: Response) => {
  const query = `
  SELECT
  id,
  name,
  price,
  description,
  category,
  image,
  in_stock AS "inStock",
  stock_quantity AS "stockQuantity",
  specifications
  FROM products`;

  const result = await pool.query(query);

  const products = result.rows.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  res.json(products);
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.id);

  // Перевірка на валідність ID, щоб уникнути помилки в Postgres (invalid input syntax for type integer)
  if (isNaN(productId)) {
    return next(new AppError(400, "Invalid product ID"));
  }

  const query = `SELECT
  id,
  name,
  price,
  description,
  category,
  image,
  in_stock AS "inStock",
  stock_quantity AS "stockQuantity",
  specifications
  FROM products
  WHERE id = $1`;

  const result = await pool.query(query, [productId]);

  const product = result.rows[0];

  if (!product) {
    next(new AppError(404, "Product not found"));
    return;
  }

  res.json(product);
};

interface CreateProductBody {
  name: string;
  price: number;
}

export const createProduct = async (
  req: Request<{}, {}, CreateProductBody>,
  res: Response,
) => {
  const { name, price } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Поле 'name' є обов'язковим і має бути не порожнім рядком.",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      error: "Поле 'price' має бути числом і має бути більшим за нуль.",
    });
  }

  const query = `
      INSERT INTO products (name, price)
      VALUES ($1, $2)
      RETURNING *
    `;

  const values = [name.trim(), price];

  const result = await pool.query(query, values);
  const newProduct = result.rows[0];

  return res.status(201).json(newProduct);
};

interface UpdateProductBody {
  name?: string;
  price?: number;
}

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductBody>,
  res: Response,
) => {
  const productId = Number(req.params.id);

  const { name, price } = req.body;

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error: "Поле 'name' є обов'язковим і має бути не порожнім рядком.",
      });
    }
    updates.push(`name = $${values.length + 1}`);
    values.push(name.trim());
  }

  if (price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        error: "Поле 'price' має бути числом і більшим за нуль.",
      });
    }
    updates.push(`price = $${values.length + 1}`);
    values.push(price);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      error: "Не передано жодного поля для оновлення.",
    });
  }

  values.push(productId);
  const setClause = updates.join(", ");

  const query = `
  UPDATE products
  SET ${setClause}
  WHERE id = $${values.length}
  RETURNING *
`;

  const result = await pool.query(query, values);

  const updatedProduct = result.rows[0];

  if (!updatedProduct) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const productId = Number(req.params.id);

  const query = `
  DELETE FROM products
  WHERE id = $1
  RETURNING *;`;

  const result = await pool.query(query, [productId]);
  const product = result.rows[0];

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    message: "Product deleted successfully",
  });
};
