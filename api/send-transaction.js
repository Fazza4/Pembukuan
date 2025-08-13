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
    // Pastikan body sudah diparsing
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // 🔹 Logika khusus transfer
    if (req.body.type === "transfer") {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyDL9wt6-HzHwUoXepDH-91tiwtoPDh1WvmMxk2NfLLiPXgnUAt2TEvcFl-R1zvqn0bhg/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: req.body.type,   // ✅ kirim type
          date: req.body.date,   // ✅ kirim date
          from: req.body.from,
          to: req.body.to,
          amount: req.body.amount
        })
      });
      const text = await response.text(); // Baca sebagai text dulu
      let data;
      try {
        data = JSON.parse(text); // Coba parse JSON
      } catch {
        data = { success: true, message: text }; // Kalau bukan JSON, anggap sukses
      }

      return res.status(200).json(data);
    }


    // 🔹 Default route ke Apps Script utama
    const response = await fetch("https://script.google.com/macros/s/AKfycbyDL9wt6-HzHwUoXepDH-91tiwtoPDh1WvmMxk2NfLLiPXgnUAt2TEvcFl-R1zvqn0bhg/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

      const text = await response.text(); // Baca sebagai text dulu
      let data;
      try {
        data = JSON.parse(text); // Coba parse JSON
      } catch {
        data = { success: true, message: text }; // Kalau bukan JSON, anggap sukses
      }

      return res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
