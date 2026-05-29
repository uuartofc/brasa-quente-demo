const STORE_ADDRESS = "Rua Diamante, Jardim Kennedy II, Pocos de Caldas, MG, 37706-528";
const STORE_COORDS = { lat: -21.84089, lon: -46.57681 };
const MEAT_POINTS = ["Mal passado", "Ao ponto", "Bem passado"];
const SITE_DISCOUNT_RATE = 0.1;

const menu = [
  {
    id: "brasa-classico",
    name: "Brasa Classico",
    category: "smash",
    initials: "BC",
    image: "assets/menu/brasa-classico.png",
    colors: ["#d12e24", "#f2b326"],
    description: "Pao brioche, smash 80g, cheddar e Molho Brasa.",
    price: 15.9,
    meatPoint: true
  },
  {
    id: "brasa-duplo",
    name: "Brasa Duplo",
    category: "smash",
    initials: "BD",
    colors: ["#7b251c", "#f2b326"],
    description: "Dois smash 80g, cheddar duplo, Molho Brasa e cebola caramelizada.",
    price: 19.9,
    meatPoint: true
  },
  {
    id: "brasa-bacon",
    name: "Brasa Bacon",
    category: "smash",
    initials: "BB",
    image: "assets/menu/bacon-artesanal.png",
    colors: ["#d12e24", "#7b251c"],
    description: "Smash 100g, cheddar, bacon crocante e Molho Brasa.",
    price: 22.9,
    meatPoint: true
  },
  {
    id: "brasa-vulcao",
    name: "Brasa Vulcao",
    category: "assinatura",
    initials: "BV",
    colors: ["#f2b326", "#d85b24"],
    description: "Dois smash 100g, cheddar cremoso, bacon, anel acebolado e Molho Vulcao.",
    price: 25.9,
    meatPoint: true
  },
  {
    id: "brasa-mineiro",
    name: "Brasa Mineiro",
    category: "assinatura",
    initials: "BM",
    colors: ["#258452", "#f2b326"],
    description: "Smash 100g, queijo minas macaricado, bacon e molho de alho artesanal.",
    price: 24.9,
    meatPoint: true
  },
  {
    id: "combo-brasa-casa",
    name: "Combo Brasa da Casa",
    category: "combos",
    initials: "CB",
    colors: ["#d12e24", "#258452"],
    description: "Brasa Classico, batata pequena e refrigerante lata.",
    price: 27.9,
    meatPoint: true
  },
  {
    id: "combo-familia",
    name: "Combo Familia",
    category: "combos",
    initials: "CF",
    colors: ["#1d1715", "#d12e24"],
    description: "Quatro smashs, duas batatas medias, refrigerante 2 litros e molhos extras.",
    price: 104.9,
    meatPoint: true
  },
  {
    id: "batata-pequena",
    name: "Batata Pequena",
    category: "porcoes",
    initials: "BP",
    colors: ["#f2b326", "#7b251c"],
    description: "Crocante, sequinha e feita para beliscar.",
    price: 8.9
  },
  {
    id: "batata-media",
    name: "Batata Media",
    category: "porcoes",
    initials: "BM",
    image: "assets/menu/batata-rustica.png",
    colors: ["#f2b326", "#7b251c"],
    description: "Boa para dividir ou acompanhar um burger parrudo.",
    price: 12.9
  },
  {
    id: "batata-brasa",
    name: "Batata Brasa",
    category: "porcoes",
    initials: "BR",
    colors: ["#d85b24", "#1d1715"],
    description: "Batata crocante com cheddar cremoso e bacon crocante.",
    price: 16.9
  },
  {
    id: "anel-acebolado",
    name: "Anel Acebolado",
    category: "porcoes",
    initials: "AA",
    colors: ["#f2b326", "#d85b24"],
    description: "Aneis empanados, dourados e crocantes.",
    price: 14.9
  },
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    category: "bebidas",
    initials: "RL",
    colors: ["#258452", "#1b5f94"],
    description: "Coca-Cola, Coca Zero, Guarana Antarctica ou Fanta Laranja.",
    price: 7.9
  },
  {
    id: "agua",
    name: "Agua Mineral",
    category: "bebidas",
    initials: "AG",
    colors: ["#1b5f94", "#258452"],
    description: "Com ou sem gas. Consulte disponibilidade.",
    price: 4.9
  }
];

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const state = {
  filter: "todos",
  cart: new Map(),
  delivery: null
};

const grid = document.querySelector("[data-menu-grid]");
const cart = document.querySelector("[data-cart]");
const scrim = document.querySelector("[data-scrim]");
const cartItems = document.querySelector("[data-cart-items]");
const cartSubtotal = document.querySelector("[data-cart-subtotal]");
const deliveryFee = document.querySelector("[data-delivery-fee]");
const siteDiscount = document.querySelector("[data-site-discount]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const header = document.querySelector("[data-header]");
const customerName = document.querySelector("[data-customer-name]");
const customerPhone = document.querySelector("[data-customer-phone]");
const addressInput = document.querySelector("[data-address]");
const addressComplement = document.querySelector("[data-complement]");
const deliveryStatus = document.querySelector("[data-delivery-status]");
const orderStatus = document.querySelector("[data-order-status]");

function visibleItems() {
  if (state.filter === "todos") return menu;
  return menu.filter((item) => item.category === state.filter);
}

function renderMenu() {
  grid.innerHTML = visibleItems()
    .map((item) => {
      const pointControl = item.meatPoint
        ? `<label class="point-select">Ponto da carne
            <select data-point="${item.id}">
              ${MEAT_POINTS.map((point) => `<option ${point === "Ao ponto" ? "selected" : ""}>${point}</option>`).join("")}
            </select>
          </label>`
        : "";

      return `
        <article class="menu-card" data-category="${item.category}">
          ${item.image
            ? `<img class="food-photo" src="${item.image}" alt="${item.name}">`
            : `<div class="food-badge" style="--badge-a: ${item.colors[0]}; --badge-b: ${item.colors[1]}">${item.initials}</div>`}
          <div>
            <span class="category-label">${categoryName(item.category)}</span>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
          <div>
            ${pointControl}
            <div class="menu-meta">
              <strong class="price">${formatter.format(item.price)}</strong>
              <button class="add-button" type="button" data-add="${item.id}">Adicionar</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function categoryName(category) {
  return {
    smash: "Linha Smash",
    assinatura: "Linha Assinatura",
    combos: "Combos",
    porcoes: "Porcoes",
    bebidas: "Bebidas"
  }[category] || "Cardapio";
}

function cartSummary() {
  return [...state.cart.values()].reduce(
    (summary, entry) => {
      summary.count += entry.qty;
      summary.subtotal += entry.qty * entry.item.price;
      return summary;
    },
    { count: 0, subtotal: 0 }
  );
}

function deliveryValue() {
  return state.delivery?.fee ?? 0;
}

function discountValue(subtotal) {
  return Math.round(subtotal * SITE_DISCOUNT_RATE * 100) / 100;
}

function renderCart() {
  const entries = [...state.cart.values()];
  const summary = cartSummary();
  const discount = discountValue(summary.subtotal);
  const total = summary.subtotal - discount + deliveryValue();

  cartCount.textContent = summary.count;
  cartSubtotal.textContent = formatter.format(summary.subtotal);
  siteDiscount.textContent = `- ${formatter.format(discount)}`;
  deliveryFee.textContent = state.delivery ? formatter.format(state.delivery.fee) : "A calcular";
  cartTotal.textContent = formatter.format(total);

  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho esta vazio. Escolha um item no cardapio para comecar.</p>';
    return;
  }

  cartItems.innerHTML = entries
    .map(({ key, item, qty, point }) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <small>${point ? `Ponto: ${point} · ` : ""}${formatter.format(item.price)} cada</small>
        </div>
        <div class="qty-controls" aria-label="Quantidade de ${item.name}">
          <button type="button" data-decrease="${key}">-</button>
          <span>${qty}</span>
          <button type="button" data-increase="${key}">+</button>
        </div>
      </div>
    `)
    .join("");
}

function addToCart(id) {
  const item = menu.find((entry) => entry.id === id);
  if (!item) return;

  const point = item.meatPoint ? document.querySelector(`[data-point="${id}"]`)?.value || "Ao ponto" : "";
  const key = point ? `${id}::${point}` : id;
  const current = state.cart.get(key);
  state.cart.set(key, { key, item, point, qty: current ? current.qty + 1 : 1 });
  renderCart();
  openCart();
}

function changeQty(key, delta) {
  const current = state.cart.get(key);
  if (!current) return;

  const nextQty = current.qty + delta;
  if (nextQty <= 0) {
    state.cart.delete(key);
  } else {
    state.cart.set(key, { ...current, qty: nextQty });
  }

  renderCart();
}

function openCart() {
  cart.classList.add("open");
  scrim.classList.add("open");
  cart.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cart.classList.remove("open");
  scrim.classList.remove("open");
  cart.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

async function geocode(address) {
  const query = `${address}, Pocos de Caldas, Minas Gerais, Brasil`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Nao foi possivel localizar o endereco.");
  const results = await response.json();
  if (!results.length) throw new Error("Endereco nao encontrado. Confira rua, numero e bairro.");
  return { lat: Number(results[0].lat), lon: Number(results[0].lon), label: results[0].display_name };
}

async function routeDistanceKm(destination) {
  const coords = `${STORE_COORDS.lon},${STORE_COORDS.lat};${destination.lon},${destination.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Nao foi possivel calcular a rota.");
  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) throw new Error("Rota nao encontrada para esse endereco.");
  return {
    distanceKm: route.distance / 1000,
    durationMin: Math.round(route.duration / 60)
  };
}

function estimateFee(distanceKm) {
  const fee = Math.max(6, 5 + distanceKm * 2.2);
  return Math.round(fee * 2) / 2;
}

async function calculateDelivery() {
  const address = addressInput.value.trim();
  if (!address) {
    deliveryStatus.textContent = "Informe rua, numero e bairro para calcular.";
    return;
  }

  deliveryStatus.textContent = "Calculando rota e frete...";
  state.delivery = null;
  renderCart();

  try {
    const destination = await geocode(address);
    const route = await routeDistanceKm(destination);
    const fee = estimateFee(route.distanceKm);
    state.delivery = {
      address,
      complement: addressComplement.value.trim(),
      fee,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      label: destination.label
    };
    deliveryStatus.textContent = `Rota estimada: ${route.distanceKm.toFixed(1)} km · ${route.durationMin} min · frete ${formatter.format(fee)}.`;
  } catch (error) {
    state.delivery = null;
    deliveryStatus.textContent = `${error.message} Frete fica a confirmar pelo atendimento.`;
  }

  renderCart();
}

function orderPayload() {
  const entries = [...state.cart.values()];
  return {
    customer: {
      name: customerName.value.trim(),
      phone: customerPhone.value.trim()
    },
    delivery: state.delivery
      ? {
          address: state.delivery.address,
          complement: state.delivery.complement || addressComplement.value.trim(),
          distanceKm: state.delivery.distanceKm,
          durationMin: state.delivery.durationMin,
          fee: state.delivery.fee
        }
      : {
          address: addressInput.value.trim(),
          complement: addressComplement.value.trim(),
          fee: 0
        },
    items: entries.map(({ item, qty, point }) => ({
      id: item.id,
      qty,
      point
    }))
  };
}

async function checkout() {
  if (!state.cart.size) {
    alert("Escolha pelo menos um item antes de finalizar.");
    return;
  }

  if (!customerName.value.trim() || !customerPhone.value.trim()) {
    orderStatus.textContent = "Informe nome e telefone para enviar o pedido.";
    return;
  }

  if (!state.delivery) {
    orderStatus.textContent = "Calcule o frete antes de enviar o pedido pelo site.";
    return;
  }

  orderStatus.textContent = "Enviando pedido para a cozinha...";

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload())
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Nao foi possivel criar o pedido.");

    const order = result.order;
    orderStatus.textContent = `Pedido ${order.id} recebido. Total com desconto do site: ${formatter.format(order.pricing.total)}.`;
    state.cart.clear();
    renderCart();
  } catch (error) {
    orderStatus.textContent = `${error.message} Se estiver em GitHub Pages, rode o servidor local com npm start para usar a API.`;
  }
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");

  if (addButton) addToCart(addButton.dataset.add);
  if (increaseButton) changeQty(increaseButton.dataset.increase, 1);
  if (decreaseButton) changeQty(decreaseButton.dataset.decrease, -1);
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderMenu();
  });
});

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
document.querySelector("[data-calculate-delivery]").addEventListener("click", calculateDelivery);
document.querySelector("[data-checkout]").addEventListener("click", checkout);
scrim.addEventListener("click", closeCart);

document.querySelector("[data-featured-add]").addEventListener("click", () => {
  addToCart("combo-brasa-casa");
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

renderMenu();
renderCart();
