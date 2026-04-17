import dietItems from "../data/dietData.js";

export default function handler(req, res) {
  const { method, query } = req;

  /* ------------ GET REQUESTS ------------ */
  if (method === "GET") {
    let result = [...dietItems];

    // 🔍 Search
    if (query.q) {
      result = result.filter((d) =>
        d.name.toLowerCase().includes(query.q.toLowerCase())
      );
    }

    // 📂 Filter by category
    if (query.category) {
      result = result.filter(
        (d) =>
          d.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    // 🌍 Filter by country
    if (query.country) {
      result = result.filter((d) =>
        d.country.toLowerCase().includes(query.country.toLowerCase())
      );
    }

    // 💪 High protein
    if (query.highProtein === "true") {
      result = result.filter((d) => d.protein >= 20);
    }

    // 🔃 Sort
    if (query.sort === "calories") {
      result.sort((a, b) => a.calories - b.calories);
    }

    return res.status(200).json(result);
  }

  /* ------------ POST REQUEST ------------ */
  if (method === "POST") {
    const newItem = req.body;

    if (!newItem.name || !newItem.protein) {
      return res.status(400).json({
        message: "Name and protein are required",
      });
    }

    return res.status(201).json({
      message: "Item received (not stored in Vercel)",
      data: newItem,
    });
  }

  /* ------------ DELETE REQUEST ------------ */
  if (method === "DELETE") {
    return res.status(200).json({
      message: "Delete not supported in serverless (no DB)",
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}