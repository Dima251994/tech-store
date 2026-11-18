import express from "express";
import productsRouter from "./routes/productsRouter.js";
import ordersRouter from "./routes/ordersRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./config/database.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(productsRouter);
app.use(ordersRouter);
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
