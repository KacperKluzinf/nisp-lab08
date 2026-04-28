const STORAGE_KEY = "cart";

const formatPrice = (value) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(value);

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
}

function renderSummary() {
  const summary = document.getElementById("summary");
  const totalEl = document.getElementById("total");

  const cart = getCart();

  if (!cart.length) {
    summary.innerHTML = "<p>Brak produktów</p>";
    totalEl.textContent = formatPrice(0);
    return;
  }

  let total = 0;

  summary.innerHTML = cart.map(item => {
    const sum = item.price * item.quantity;
    total += sum;

    return `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>${item.quantity} × ${formatPrice(item.price)}</span>
        <strong>${formatPrice(sum)}</strong>
      </div>
    `;
  }).join("");

  totalEl.textContent = formatPrice(total);
}

document.getElementById("confirm").addEventListener("click", () => {
  clearCart();

  // UX > alert
  document.body.innerHTML = `
    <div class="container">
      <h1>Dziękujemy za zamówienie 🎉</h1>
      <a href="index.html" class="btn primary">Powrót do sklepu</a>
    </div>
  `;
});

renderSummary();