import express from "express";
import cors from "cors";
import dietItems from "./data/dietData.js";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Diet API is running");
});

app.get("/api/diets", (req, res) => {
  let result = [...dietItems];

  if (req.query.category) {
    result = result.filter(
      (d) =>
        d.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  if (req.query.sort === "calories") {
    result.sort((a, b) => a.calories - b.calories);
  }

  res.json(result);
});

app.get("/api/diets/:name", (req, res) => {
  const name = req.params.name.toLowerCase().trim();

  const item = dietItems.find(
    (d) => d.name.toLowerCase().trim() === name
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json(item);
});

app.get("/api/category/:category", (req, res) => {
  const category = req.params.category.toLowerCase().trim();

  const filtered = dietItems.filter(
    (d) => d.category.toLowerCase() === category
  );

  res.json(filtered);
});

app.get("/api/country/:country", (req, res) => {
  const country = req.params.country.toLowerCase().trim();

  const filtered = dietItems.filter((d) =>
    d.country.toLowerCase().includes(country)
  );

  res.json(filtered);
});

app.get("/api/high-protein", (req, res) => {
  const result = dietItems.filter((d) => d.protein >= 20);
  res.json(result);
});

app.get("/api/search", (req, res) => {
  const query = req.query.q?.toLowerCase().trim() || "";

  const result = dietItems.filter((d) =>
    d.name.toLowerCase().includes(query)
  );

  res.json(result);
});

app.post("/api/diets", (req, res) => {
  const newItem = req.body;

  if (!newItem.name || !newItem.protein) {
    return res.status(400).json({
      message: "Name and protein are required",
    });
  }

  const exists = dietItems.some(
    (d) =>
      d.name.toLowerCase().trim() === newItem.name.toLowerCase().trim()
  );

  if (exists) {
    return res.status(400).json({ message: "Item already exists" });
  }

  dietItems.push(newItem);

  res.status(201).json({
    message: "Item added successfully",
    data: newItem,
  });
});

app.delete("/api/diets/:name", (req, res) => {
  const name = req.params.name.toLowerCase().trim();

  const index = dietItems.findIndex(
    (d) => d.name.toLowerCase().trim() === name
  );

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const deleted = dietItems.splice(index, 1);

  res.json({
    message: "Item deleted",
    data: deleted,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});