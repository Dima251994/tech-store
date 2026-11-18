import type { Request, Response } from "express";
import { pool } from "../config/database.js";

type CreateOrderBody = {
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    paymentMethod: "cod" | "online";
  };
  items: {
    productId: number;
    quantity: number;
  }[];
};

export const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
) => {
  const { customer, items } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({
      message: "Invalid order data",
    });
  }

  const hasInvalidItems = items.some(
    (item) =>
      !Number.isInteger(item.productId) ||
      item.productId <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0,
  );

  if (hasInvalidItems) {
    return res.status(400).json({
      message: "Invalid product data",
    });
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productIds = items.map((item) => item.productId);

    const hasDuplicateProducts = new Set(productIds).size !== productIds.length;
    if (hasDuplicateProducts) {
      throw new Error("Duplicate products in order");
    }

    const productsResult = await client.query(
      `SELECT
        id,
        name,
        price,
        stock_quantity AS "stockQuantity"
        FROM products
        WHERE id = ANY($1::int[])
        FOR UPDATE`,
      [productIds],
    );

    if (productsResult.rows.length !== productIds.length) {
      throw new Error("Some products were not found");
    }

    const insufficientItem = items.find((item) => {
      const dbProduct = productsResult.rows.find(
        (row) => row.id === item.productId,
      );

      return !dbProduct || item.quantity > dbProduct.stockQuantity;
    });

    if (insufficientItem) {
      throw new Error(
        `Insufficient stock for product ID: ${insufficientItem.productId}`,
      );
    }

    const total = items.reduce((sum, item) => {
      // Знаходимо актуальний товар у результатах із бази даних
      const dbProduct = productsResult.rows.find(
        (row) => row.id === item.productId,
      );

      // Якщо товар є в БД, беремо його актуальну ціну
      const currentPrice = Number(dbProduct.price);

      return sum + currentPrice * item.quantity;
    }, 0);

    const orderItems = items.map((item) => {
      // Знаходимо відповідний товар у базі даних за його ID
      const dbProduct = productsResult.rows.find(
        (product) => product.id === item.productId,
      );

      // Перевірка на випадок, якщо товар раптом не знайдено
      if (!dbProduct) {
        throw new Error(`Товар з ID ${item.productId} не знайдено`);
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: Number(dbProduct.price), // Беремо актуальну ціну з бази даних
      };
    });

    const orderResult = await client.query(
      `INSERT INTO orders (
    full_name,
    phone,
    city,
    address,
    payment_method,
    total
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id`,
      [
        customer.fullName,
        customer.phone,
        customer.city,
        customer.address,
        customer.paymentMethod,
        total,
      ],
    );

    const orderId = orderResult.rows[0].id;

    for (const item of orderItems) {
      const itemQuery = `
       INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        price )
       VALUES ($1, $2, $3, $4)
      `;
      await client.query(itemQuery, [
        orderId,
        item.productId,
        item.quantity,
        item.price,
      ]);

      const updateStockQuery = `
      UPDATE products
      SET
        stock_quantity = stock_quantity - $1,
        in_stock = (stock_quantity - $1) > 0
      WHERE id = $2
      AND stock_quantity >= $1
      RETURNING id;
      `;
      const stockResult = await client.query(updateStockQuery, [
        item.quantity,
        item.productId,
      ]);

      if (stockResult.rows.length === 0) {
        throw new Error(`Insufficient stock for product ID: ${item.productId}`);
      }
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Замовлення успішно створено",
      order: {
        id: orderId,
        customer,
        items,
        total,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
