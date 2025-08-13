export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const GAS_URL = "https://script.google.com/macros/s/AKfycbyDL9wt6-HzHwUoXepDH-91tiwtoPDh1WvmMxk2NfLLiPXgnUAt2TEvcFl-R1zvqn0bhg/exec";

    if (body.type === "transfer") {
      const from = (body.from || '').trim();
      const to = (body.to || '').trim();
      const amount = Number(body.amount);

      if (!from || !to) {
        return res.status(400).json({ success: false, message: 'FROM_TO_REQUIRED' });
      }
      if (from === to) {
        return res.status(400).json({ success: false, message: 'FROM_TO_MUST_DIFFER' });
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: 'INVALID_AMOUNT' });
      }

      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); }
      catch { data = { status: 'success', message: text }; }

      const success = data.success ?? (data.status === 'success');
      return res.status(200).json({ success, ...data });
    }

    // Default transaksi biasa
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'INVALID_AMOUNT' });
    }

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { status: 'success', message: text }; }

    const success = data.success ?? (data.status === 'success');
    return res.status(200).json({ success, ...data });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

