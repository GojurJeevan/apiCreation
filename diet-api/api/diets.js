import dietItems from "../data/dietData.js";

export default function handler(req, res) {
  // ✅ CORS HEADERS (IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { method, query } = req;

  // ✅ Handle preflight request (VERY IMPORTANT for POST)
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  /* ------------ GET REQUESTS ------------ */
  if (method === "GET") {
    let result = [...dietItems];

    if (query.q) {
      result = result.filter((d) =>
        d.name.toLowerCase().includes(query.q.toLowerCase())
      );
    }

    if (query.category) {
      result = result.filter(
        (d) =>
          d.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    if (query.country) {
      result = result.filter((d) =>
        d.country.toLowerCase().includes(query.country.toLowerCase())
      );
    }

    if (query.highProtein === "true") {
      result = result.filter((d) => d.protein >= 20);
    }

    if (query.sort === "calories") {
      result.sort((a, b) => a.calories - b.calories);
    }

    return res.status(200).json(result);
  }

  /* ------------ POST REQUESTS ------------ */
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

  return res.status(405).json({ message: "Method not allowed" });
}