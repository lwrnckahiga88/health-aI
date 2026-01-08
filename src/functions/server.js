import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
app.use(bodyParser.json());

/* ===== CONFIG ===== */
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.CALLBACK_URL;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

/* ===== LEDGER (LOCK v1) ===== */
const ledger = [];

/* ===== MPESA AUTH ===== */
async function mpesaToken() {
  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return (await res.json()).access_token;
}

/* ===== STK PUSH ===== */
app.post("/mpesa/stkpush", async (req, res) => {
  const { phone, amount } = req.body;
  const token = await mpesaToken();

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    MPESA_SHORTCODE + MPESA_PASSKEY + timestamp
  ).toString("base64");

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: "HealthNav",
        TransactionDesc: "Emergency Service"
      })
    }
  );

  res.json(await response.json());
});

/* ===== WHATSAPP ===== */
app.post("/whatsapp/send", async (req, res) => {
  const { phone, message } = req.body;

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        text: { body: message }
      })
    }
  );

  res.json(await response.json());
});

/* ===== LEDGER ENTRY ===== */
app.post("/ledger", (req, res) => {
  const entry = {
    id: crypto.randomUUID(),
    ...req.body,
    hash: crypto
      .createHash("sha256")
      .update(JSON.stringify(req.body))
      .digest("hex"),
    time: new Date().toISOString()
  };

  ledger.push(entry);
  res.json(entry);
});

app.listen(3000, () => console.log("🚑 HealthNav backend live"));
