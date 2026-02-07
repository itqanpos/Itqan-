// js/pos.js
import {
  db
} from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   STATE
============================= */
let products = [];
let cart = [];

/* =============================
   DOM ELEMENTS
============================= */
const productsGrid = document.getElementById("pos-products");
const cartTable = document.getElementById("cart-items");
const totalEl = document.getElementById("total-amount");
const searchInput = document.getElementById("search-product");
const payBtn = document.getElementById("pay-btn");

/* =============================
   LOAD PRODUCTS
============================= */
export async function loadPOSProducts() {
  productsGrid.innerHTML = "جارٍ التحميل...";
  const querySnapshot = await getDocs(collection(db, "products"));
  products = [];

  querySnapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });

  renderProducts(products);
}

/* =============================
   RENDER PRODUCTS
============================= */
function renderProducts(list) {
  productsGrid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "pos-product-card fade-in";
    card.innerHTML = `
      <h4>${product.name}</h4>
      <p>${product.price} جنيه</p>
      <button class="btn btn-primary">إضافة</button>
    `;

    card.querySelector("button").onclick = () => addToCart(product);
    productsGrid.appendChild(card);
  });
}

/* =============================
   CART LOGIC
============================= */
function addToCart(product) {
  const item = cart.find(i => i.id === product.id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  renderCart();
}

/* =============================
   RENDER CART
============================= */
function renderCart() {
  cartTable.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const row = document.createElement("tr");
    const subtotal = item.price * item.qty;
    total += subtotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <button class="qty-btn">-</button>
        ${item.qty}
        <button class="qty-btn">+</button>
      </td>
      <td>${item.price}</td>
      <td>${subtotal}</td>
      <td><button class="btn btn-danger">X</button></td>
    `;

    const [minus, plus] = row.querySelectorAll(".qty-btn");
    minus.onclick = () => changeQty(item.id, -1);
    plus.onclick = () => changeQty(item.id, 1);

    row.querySelector(".btn-danger").onclick =
      () => removeFromCart(item.id);

    cartTable.appendChild(row);
  });

  totalEl.textContent = total.toFixed(2);
}

/* =============================
   SEARCH
============================= */
searchInput?.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

/* =============================
   PAYMENT
============================= */
payBtn?.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  await addDoc(collection(db, "sales"), {
    items: cart,
    total: Number(totalEl.textContent),
    createdAt: Timestamp.now()
  });

  cart = [];
  renderCart();
  alert("تم تسجيل الفاتورة بنجاح");
});

/* =============================
   INIT
============================= */
loadPOSProducts();
