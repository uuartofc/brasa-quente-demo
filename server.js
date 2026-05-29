const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 4178);
const ROOT = __dirname;
const ORDERS_FILE = path.join(ROOT, "data", "orders.json");
const SITE_DISCOUNT_RATE = 0.1;
const PAYMENT_METHODS = new Set(["Pix", "Dinheiro", "Cartao de Debito", "Cartao de Credito"]);

const catalog = new Map([
  ["brasa-classico", { name: "Brasa Classico", price: 15.9, meatPoint: true }],
  ["brasa-duplo", { name: "Brasa Duplo", price: 19.9, meatPoint: true }],
  ["brasa-bacon", { name: "Brasa Bacon", price: 22.9, meatPoint: true }],
  ["brasa-vulcao", { name: "Brasa Vulcao", price: 25.9, meatPoint: true }],
  ["brasa-mineiro", { name: "Brasa Mineiro", price: 24.9, meatPoint: true }],
  ["combo-brasa-casa", { name: "Combo Brasa da Casa", price: 27.9, meatPoint: true }],
  ["combo-familia", { name: "Combo Familia", price: 104.9, meatPoint: true }],
  ["batata-pequena", { name: "Batata Pequena", price: 8.9 }],
  ["batata-media", { name: "Batata Media", price: 12.9 }],
  ["batata-brasa", { name: "Batata Brasa", price: 16.9 }],
  ["anel-acebolado", { name: "Anel Acebolado", price: 14.9 }],
  ["refri-lata", { name: "Refrigerante Lata", price: 7.9 }],
  ["agua", { name: "Agua Mineral", price: 4.9 }]
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function money(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

async function saveOrder(order) {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  let orders = [];
  try {
    orders = JSON.parse(await fs.readFile(ORDERS_FILE, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  orders.push(order);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function buildOrder(payload) {
  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  if (!rawItems.length) throw new Error("O pedido precisa ter pelo menos um item.");

  const items = rawItems.map((entry) => {
    const product = catalog.get(entry.id);
    if (!product) throw new Error(`Item invalido: ${entry.id}`);

    const qty = Math.max(1, Math.min(20, Number(entry.qty || 1)));
    const point = product.meatPoint ? entry.point || "Ao ponto" : "";
    return {
      id: entry.id,
      name: product.name,
      qty,
      point,
      unitPrice: product.price,
      total: money(product.price * qty)
    };
  });

  const subtotal = money(items.reduce((sum, item) => sum + item.total, 0));
  const siteDiscount = money(subtotal * SITE_DISCOUNT_RATE);
  const deliveryFee = money(payload.delivery?.fee || 0);
  const total = money(subtotal - siteDiscount + deliveryFee);
  const customer = payload.customer || {};
  const delivery = payload.delivery || {};
  const paymentMethod = String(payload.paymentMethod || "").trim();

  if (!customer.name || !customer.phone) {
    throw new Error("Informe nome e telefone para criar o pedido.");
  }

  if (!delivery.address) {
    throw new Error("Informe o endereco de entrega.");
  }

  if (!PAYMENT_METHODS.has(paymentMethod)) {
    throw new Error("Informe uma forma de pagamento valida.");
  }

  return {
    id: `BQ-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    status: "recebido",
    channel: "site",
    createdAt: new Date().toISOString(),
    customer: {
      name: String(customer.name).trim(),
      phone: String(customer.phone).trim()
    },
    delivery: {
      address: String(delivery.address).trim(),
      complement: String(delivery.complement || "").trim(),
      distanceKm: delivery.distanceKm ? Number(delivery.distanceKm) : null,
      durationMin: delivery.durationMin ? Number(delivery.durationMin) : null,
      fee: deliveryFee
    },
    payment: {
      method: paymentMethod
    },
    pricing: {
      subtotal,
      siteDiscount,
      deliveryFee,
      total
    },
    items
  };
}

async function handleApi(req, res) {
  if (req.method === "POST" && req.url === "/api/orders") {
    try {
      const payload = await readBody(req);
      const order = buildOrder(payload);
      await saveOrder(order);
      sendJson(res, 201, { ok: true, order });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === "GET" && req.url === "/api/orders") {
    try {
      const text = await fs.readFile(ORDERS_FILE, "utf8");
      sendJson(res, 200, { ok: true, orders: JSON.parse(text) });
    } catch (error) {
      if (error.code === "ENOENT") {
        sendJson(res, 200, { ok: true, orders: [] });
      } else {
        sendJson(res, 500, { ok: false, error: error.message });
      }
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: "Rota nao encontrada." });
}

async function serveStatic(req, res) {
  const requestedPath = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
  const safePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(ROOT, safePath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Brasa Quente demo rodando em http://localhost:${PORT}`);
});
