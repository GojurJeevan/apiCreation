import dietItems from "../../data/dietData.js";

export default function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const {
    query: { id },
    method,
  } = req;

  if (method === "GET") {
    const item = dietItems.find((d) => d.id === Number(id));

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(item);
  }

  return res.status(405).json({ message: "Method not allowed" });
}