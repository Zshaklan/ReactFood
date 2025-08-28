import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "node:fs/promises";
import serverless from "serverless-http"; // <--- new import

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Routes
app.get("/api/meals", async (req, res) => {
  try {
    const meals = await fs.readFile("./data/available-meals.json", "utf8");
    res.json(JSON.parse(meals));
  } catch (err) {
    res.status(500).json({ message: "Could not load meals." });
  }
});

app.post("/api/orders", async (req, res) => {
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
    const ordersFile = await fs.readFile("./data/orders.json", "utf8");
    allOrders = ordersFile ? JSON.parse(ordersFile) : [];
  } catch (err) {
    allOrders = [];
  }

  allOrders.push(newOrder);
  await fs.writeFile("./data/orders.json", JSON.stringify(allOrders, null, 2));
  res.status(201).json({ message: "Order created!" });
});

// Export handler for Vercel
export const handler = serverless(app);
