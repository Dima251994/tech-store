import express from "express";
import productsRouter from "./routes/productsRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./config/database.js";

const app = express();

app.use(express.json());
app.use(productsRouter);
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
