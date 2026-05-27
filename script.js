const menu = [
  {
    id: "brasa-classico",
    name: "Brasa Classico",
    category: "burgers",
    initials: "BC",
    image: "assets/menu/brasa-classico.png",
    colors: ["#d12e24", "#f2b326"],
    description: "Blend bovino, queijo derretido, alface, tomate, picles e molho da casa no pao tostado.",
    price: 32.9
  },
  {
    id: "bacon-artesanal",
    name: "Bacon Artesanal",
    category: "burgers",
    initials: "BA",
    image: "assets/menu/bacon-artesanal.png",
    colors: ["#7b251c", "#f2b326"],
    description: "Blend bovino, cheddar, bacon crocante, cebola caramelizada e barbecue da casa.",
    price: 37.9
  },
  {
    id: "cheddar-brasa",
    name: "Cheddar Brasa",
    category: "burgers",
    initials: "CB",
    colors: ["#f2b326", "#d85b24"],
    description: "Carne selada na chapa, cheddar cremoso, cebola dourada e toque suave de paprica.",
    price: 35.9
  },
  {
    id: "frango-ervas",
    name: "Frango com Ervas",
    category: "burgers",
    initials: "FE",
    image: "assets/menu/frango-ervas.png",
    colors: ["#258452", "#f2b326"],
    description: "Frango grelhado, queijo cremoso, salada fresca e maionese de ervas.",
    price: 33.9
  },
  {
    id: "combo-brasa-casa",
    name: "Combo Brasa da Casa",
    category: "combos",
    initials: "CB",
    colors: ["#d12e24", "#258452"],
    description: "Dois burgers artesanais, batata rustica grande, dois refrigerantes e molho da casa.",
    price: 78.9
  },
  {
    id: "combo-familia",
    name: "Combo Familia",
    category: "combos",
    initials: "CF",
    colors: ["#1d1715", "#d12e24"],
    description: "Quatro burgers, duas batatas rusticas, refrigerante 2 litros e molhos extras.",
    price: 154.9
  },
  {
    id: "batata-rustica",
    name: "Batata Rustica",
    category: "porcoes",
    initials: "BR",
    image: "assets/menu/batata-rustica.png",
    colors: ["#f2b326", "#7b251c"],
    description: "Batatas douradas com ervas, sal da casa e maionese artesanal para acompanhar.",
    price: 26.9
  },
  {
    id: "aneis-cebola",
    name: "Aneis de Cebola",
    category: "porcoes",
    initials: "AC",
    colors: ["#d85b24", "#1d1715"],
    description: "Porcao crocante de onion rings com barbecue suave ou maionese verde.",
    price: 24.9
  },
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    category: "bebidas",
    initials: "RL",
    colors: ["#258452", "#1b5f94"],
    description: "Lata gelada de 350 ml. Consulte sabores disponiveis no balcao.",
    price: 7.9
  },
  {
    id: "limonada-casa",
    name: "Limonada da Casa",
    category: "bebidas",
    initials: "LC",
    colors: ["#258452", "#f2b326"],
    description: "Limonada fresca com hortela, feita para acompanhar burger e batata.",
    price: 11.9
  }
];

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const state = {
  filter: "todos",
  cart: new Map()
};

const grid = document.querySelector("[data-menu-grid]");
const cart = document.querySelector("[data-cart]");
const scrim = document.querySelector("[data-scrim]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const header = document.querySelector("[data-header]");

function visibleItems() {
  if (state.filter === "todos") return menu;
  return menu.filter((item) => item.category === state.filter);
}

function renderMenu() {
  grid.innerHTML = visibleItems()
    .map((item) => `
      <article class="menu-card" data-category="${item.category}">
        ${item.image
          ? `<img class="food-photo" src="${item.image}" alt="${item.name}">`
          : `<div class="food-badge" style="--badge-a: ${item.colors[0]}; --badge-b: ${item.colors[1]}">${item.initials}</div>`}
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <div class="menu-meta">
          <strong class="price">${formatter.format(item.price)}</strong>
          <button class="add-button" type="button" data-add="${item.id}">Adicionar</button>
        </div>
      </article>
    `)
    .join("");
}

function cartSummary() {
  return [...state.cart.values()].reduce(
    (summary, entry) => {
      summary.count += entry.qty;
      summary.total += entry.qty * entry.item.price;
      return summary;
    },
    { count: 0, total: 0 }
  );
}

function renderCart() {
  const entries = [...state.cart.values()];
  const summary = cartSummary();

  cartCount.textContent = summary.count;
  cartTotal.textContent = formatter.format(summary.total);

  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho esta vazio. Escolha um lanche no cardapio para comecar.</p>';
    return;
  }

  cartItems.innerHTML = entries
    .map(({ item, qty }) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <small>${formatter.format(item.price)} cada</small>
        </div>
        <div class="qty-controls" aria-label="Quantidade de ${item.name}">
          <button type="button" data-decrease="${item.id}">-</button>
          <span>${qty}</span>
          <button type="button" data-increase="${item.id}">+</button>
        </div>
      </div>
    `)
    .join("");
}

function addToCart(id) {
  const item = menu.find((entry) => entry.id === id);
  if (!item) return;

  const current = state.cart.get(id);
  state.cart.set(id, { item, qty: current ? current.qty + 1 : 1 });
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const current = state.cart.get(id);
  if (!current) return;

  const nextQty = current.qty + delta;
  if (nextQty <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, { item: current.item, qty: nextQty });
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
scrim.addEventListener("click", closeCart);

document.querySelector("[data-featured-add]").addEventListener("click", () => {
  addToCart("combo-brasa-casa");
});

document.querySelector("[data-checkout]").addEventListener("click", () => {
  const entries = [...state.cart.values()];
  if (!entries.length) {
    alert("Escolha pelo menos um item antes de finalizar.");
    return;
  }

  const lines = entries.map(({ item, qty }) => `${qty}x ${item.name}`);
  const total = formatter.format(cartSummary().total);
  const message = encodeURIComponent(`Oi! Quero fazer um pedido na Brasa Quente:\n${lines.join("\n")}\nTotal: ${total}`);
  window.open(`https://wa.me/5500000000000?text=${message}`, "_blank", "noreferrer");
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

renderMenu();
renderCart();
