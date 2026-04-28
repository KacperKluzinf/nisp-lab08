const STORAGE_KEY = "cart";

/* ========= SERVICE ========= */
const cartService = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  save(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  },

  remove(id) {
    const updated = this.get().filter(item => item.id !== id);
    this.save(updated);
    return updated;
  },

  getTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
};

/* ========= UI ========= */
const elements = {
  cart: document.getElementById("cart"),
  total: document.getElementById("total")
};

const formatPrice = (value) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(value);

/* ========= RENDER ========= */
function render() {
  const cart = cartService.get();

  elements.cart.innerHTML = "";

  if (cart.length === 0) {
    elements.cart.innerHTML = `<p>Koszyk jest pusty</p>`;
    elements.total.textContent = formatPrice(0);
    return;
  }

  const fragment = document.createDocumentFragment();

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.dataset.id = item.id;

    el.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-meta">
          ${item.quantity} × ${formatPrice(item.price)}
        </span>
      </div>

      <div>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
        <button class="btn danger" data-action="remove">Usuń</button>
      </div>
    `;

    fragment.appendChild(el);
  });

  elements.cart.appendChild(fragment);
  elements.total.textContent = formatPrice(cartService.getTotal(cart));
}

/* ========= EVENTS ========= */
elements.cart.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const itemEl = btn.closest(".cart-item");
  const id = Number(itemEl.dataset.id);

  if (action === "remove") {
    cartService.remove(id);
    render();
  }
});

/* ========= INIT ========= */
render();