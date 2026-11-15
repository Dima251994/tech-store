import type { Request, Response, NextFunction } from "express";
import products from "../data/products.js";
import { AppError } from "../utils/AppError.js";

export const getAllProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const getProductById = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

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

export const createProduct = (
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

  const newProduct = {
    id: products.length + 1,
    name: name.trim(),
    price: price,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
};

interface UpdateProductBody {
  name?: string;
  price?: number;
}

export const updateProduct = (
  req: Request<{ id: string }, {}, UpdateProductBody>,
  res: Response,
) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    res.status(404).json({
      message: "Product not found",
    });
    return;
  }

  const { name, price } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error: "Поле 'name' є обов'язковим і має бути не порожнім рядком.",
      });
    }
    product.name = name.trim();
  }

  if (price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        error: "Поле 'price' має бути числом і більшим за нуль.",
      });
    }
    product.price = price;
  }

  res.status(200).json({
    message: "Product updated successfully",
    product,
  });
};

export const deleteProduct = (req: Request<{ id: string }>, res: Response) => {
  const productId = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(productIndex, 1);

  res.status(200).json({
    message: "Product deleted successfully",
  });
};
