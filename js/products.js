/* =====================================
   ITQAN POS - Products Management
   File: products.js
   ===================================== */

import { db } from "./firebase.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== DOM Elements ===== */
const productsContainer = document.getElementById("products-container");
const addProductForm = document.getElementById("add-product-form");
const addProductBtn = document.getElementById("add-product-btn");
const productMessage = document.getElementById("product-message");

/* ===== Load Products ===== */
export async function loadProducts() {
  if (!productsContainer) return;

  const productsSnap = await getDocs(collection(db, "products"));
  let html = `<h2 class="fade-in">الأصناف</h2>
              <div class="cards-container" style="display:flex; flex-wrap:wrap; gap: var(--space-md); margin-top: var(--space-lg);">`;

  productsSnap.forEach(docSnap => {
    const product = docSnap.data();
    html += `
      <div class="card fade-in" data-id="${docSnap.id}" style="width:220px;">
        <div class="card-header">${product.name}</div>
        <div class="card-body">
          <p>السعر: ${product.price} جنيه</p>
          <p>الكمية: ${product.stock}</p>
          <p>الفئة: ${product.category}</p>
          <button class="btn btn-outline btn-edit">تعديل</button>
          <button class="btn btn-danger btn-delete">حذف</button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  productsContainer.innerHTML = html;

  initProductActions();
}

/* ===== Product Actions ===== */
function initProductActions() {
  const editBtns = productsContainer.querySelectorAll(".btn-edit");
  const deleteBtns = productsContainer.querySelectorAll(".btn-delete");

  editBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const id = card.dataset.id;
      editProduct(id);
    });
  });

  deleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const id = card.dataset.id;
      deleteProduct(id);
    });
  });
}

/* ===== Add Product ===== */
if (addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = addProductForm["product-name"].value.trim();
    const price = parseFloat(addProductForm["product-price"].value);
    const stock = parseInt(addProductForm["product-stock"].value);
    const category = addProductForm["product-category"].value.trim();

    if (!name || !price || !stock || !category) {
      displayMessage("جميع الحقول مطلوبة", "danger");
      return;
    }

    try {
      await addDoc(collection(db, "products"), { name, price, stock, category, createdAt: new Date() });
      displayMessage("تم إضافة الصنف بنجاح", "success");
      addProductForm.reset();
      loadProducts();
    } catch (error) {
      displayMessage("خطأ أثناء إضافة الصنف: " + error.message, "danger");
    }
  });
}

/* ===== Edit Product ===== */
async function editProduct(id) {
  const productRef = doc(db, "products", id);
  const newName = prompt("أدخل اسم الصنف الجديد:");
  const newPrice = parseFloat(prompt("أدخل السعر الجديد:"));
  const newStock = parseInt(prompt("أدخل الكمية الجديدة:"));
  const newCategory = prompt("أدخل الفئة الجديدة:");

  if (!newName || isNaN(newPrice) || isNaN(newStock) || !newCategory) return;

  try {
    await updateDoc(productRef, { name: newName, price: newPrice, stock: newStock, category: newCategory });
    displayMessage("تم تعديل الصنف بنجاح", "success");
    loadProducts();
  } catch (error) {
    displayMessage("خطأ أثناء تعديل الصنف: " + error.message, "danger");
  }
}

/* ===== Delete Product ===== */
async function deleteProduct(id) {
  if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
  try {
    await deleteDoc(doc(db, "products", id));
    displayMessage("تم حذف الصنف بنجاح", "success");
    loadProducts();
  } catch (error) {
    displayMessage("خطأ أثناء حذف الصنف: " + error.message, "danger");
  }
}

/* ===== Helper Function ===== */
function displayMessage(msg, type) {
  if (!productMessage) return;
  productMessage.textContent = msg;
  productMessage.className = "";
  productMessage.classList.add("fade-in");
  productMessage.classList.add(type === "danger" ? "badge-danger" : "badge-success");
}
