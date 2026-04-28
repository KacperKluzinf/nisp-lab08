const STORAGE_KEY = "cart";

/* ========= FAKE DATA ========= */
const products = [
  { id: 1, name: "Jabłko", price: 3 },
  { id: 2, name: "Chleb", price: 5 },
  { id: 3, name: "Mleko", price: 4 },
  { id: 4, name: "Ser", price: 8 }
];

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

  add(product) {
    const cart = this.get();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.save(cart);
  }
};

/* ========= HELPERS ========= */
const formatPrice = (value) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(value);

/* ========= UI ========= */
const container = document.getElementById("products");

/* ========= RENDER ========= */
function renderProducts() {
  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const el = document.createElement("div");
    el.className = "product";

    el.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)}</div>
      <button class="btn primary" data-id="${product.id}">
        Dodaj do koszyka
      </button>
    `;

    fragment.appendChild(el);
  });

  container.appendChild(fragment);
}

/* ========= EVENTS ========= */
container.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const product = products.find(p => p.id === id);

  cartService.add(product);

  // UX feedback (lepsze niż alert)
  btn.textContent = "Dodano ✓";
  setTimeout(() => {
    btn.textContent = "Dodaj do koszyka";
  }, 1000);
});

/* ========= INIT ========= */
renderProducts();