import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/meals", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "available-meals.json");
    const meals = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(meals));
  } catch (err) {
    console.error("Error loading meals:", err);
    res.status(500).json({ message: "Could not load meals." });
  }
});

app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: "Missing data." });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };

  let allOrders = [];
  try {
    const ordersPath = path.join(__dirname, "data", "orders.json");
    const ordersFile = await fs.readFile(ordersPath, "utf8");
    allOrders = ordersFile ? JSON.parse(ordersFile) : [];
  } catch (err) {
    allOrders = [];
  }

  allOrders.push(newOrder);

  try {
    const ordersPath = path.join(__dirname, "data", "orders.json");
    await fs.writeFile(ordersPath, JSON.stringify(allOrders, null, 2));
    res.status(201).json({ message: "Order created!" });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Could not save order." });
  }
});

// Export for Vercel
export default app;
