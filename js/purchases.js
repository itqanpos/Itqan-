// js/purchases.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   DOM
============================= */
const form = document.getElementById("purchase-form");
const supplierSelect = document.getElementById("supplier-select");
const productSelect = document.getElementById("product-select");
const qtyInput = document.getElementById("purchase-qty");
const priceInput = document.getElementById("purchase-price");
const message = document.getElementById("purchase-message");
const container = document.getElementById("purchases-container");

/* =============================
   HELPERS
============================= */
function showMessage(text, type = "success") {
  if (!message) return;
  message.textContent = text;
  message.className = type === "error" ? "text-danger" : "text-success";
  setTimeout(() => (message.textContent = ""), 3000);
}

/* =============================
   LOAD SUPPLIERS & PRODUCTS
============================= */
async function loadSuppliers() {
  const snap = await getDocs(collection(db, "suppliers"));
  supplierSelect.innerHTML = "";
  snap.forEach(docSnap => {
    supplierSelect.innerHTML +=
      `<option value="${docSnap.id}">${docSnap.data().name}</option>`;
  });
}

async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));
  productSelect.innerHTML = "";
  snap.forEach(docSnap => {
    productSelect.innerHTML +=
      `<option value="${docSnap.id}">${docSnap.data().name}</option>`;
  });
}

/* =============================
   ADD PURCHASE
============================= */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const supplierId = supplierSelect.value;
  const productId = productSelect.value;
  const qty = Number(qtyInput.value);
  const price = Number(priceInput.value);
  const total = qty * price;

  if (!supplierId || !productId || qty <= 0 || price < 0) {
    showMessage("بيانات غير صحيحة", "error");
    return;
  }

  // Save purchase
  await addDoc(collection(db, "purchases"), {
    supplierId,
    productId,
    qty,
    price,
    total,
    createdAt: Timestamp.now()
  });

  // Update product stock
  const productRef = doc(db, "products", productId);
  const productSnap = await getDocs(collection(db, "products"));
  productSnap.forEach(async p => {
    if (p.id === productId) {
      await updateDoc(productRef, {
        stock: (p.data().stock || 0) + qty
      });
    }
  });

  // Update supplier balance
  const supplierRef = doc(db, "suppliers", supplierId);
  const supplierSnap = await getDocs(collection(db, "suppliers"));
  supplierSnap.forEach(async s => {
    if (s.id === supplierId) {
      await updateDoc(supplierRef, {
        balance: (s.data().balance || 0) + total
      });
    }
  });

  form.reset();
  showMessage("تم تسجيل فاتورة الشراء");
});

/* =============================
   RENDER PURCHASES
============================= */
function renderPurchases(snapshot) {
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
      <div class="card-body">
        <p>كمية: ${p.qty}</p>
        <p>السعر: ${p.price}</p>
        <p>الإجمالي: <strong>${p.total} جنيه</strong></p>
      </div>
    `;
    container.appendChild(card);
  });
}

/* =============================
   INIT
============================= */
async function init() {
  await loadSuppliers();
  await loadProducts();

  onSnapshot(collection(db, "purchases"), renderPurchases);
}

init();
