export default async function handler(req, res) {
  // CORS Allow All
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 🔹 Logika khusus transfer
    if (req.body.type === "transfer") {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzjIAINuZQ1ds6fTZ3X6IBQ5OGag03_3-pVZ2UDPHJaljUR1GxewYnQayMvR0Z2g4Iq/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: req.body.from,
          to: req.body.to,
          amount: req.body.amount
        })
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    // 🔹 Default route ke Apps Script utama
    const response = await fetch("https://script.google.com/macros/s/AKfycbzjIAINuZQ1ds6fTZ3X6IBQ5OGag03_3-pVZ2UDPHJaljUR1GxewYnQayMvR0Z2g4Iq/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
