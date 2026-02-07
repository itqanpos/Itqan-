// js/suppliers.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   DOM
============================= */
const form = document.getElementById("add-supplier-form");
const container = document.getElementById("suppliers-container");
const message = document.getElementById("supplier-message");

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
   ADD SUPPLIER
============================= */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form["supplier-name"].value.trim();
  const phone = form["supplier-phone"].value.trim();
  const balance = Number(form["supplier-balance"].value || 0);

  if (!name) {
    showMessage("اسم المورد مطلوب", "error");
    return;
  }

  await addDoc(collection(db, "suppliers"), {
    name,
    phone,
    balance,
    createdAt: Timestamp.now()
  });

  form.reset();
  showMessage("تمت إضافة المورد بنجاح");
});

/* =============================
   RENDER SUPPLIERS
============================= */
function renderSuppliers(snapshot) {
  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const supplier = { id: docSnap.id, ...docSnap.data() };

    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
      <div class="card-header">${supplier.name}</div>
      <div class="card-body">
        <p>الهاتف: ${supplier.phone || "-"}</p>
        <p>الرصيد: <strong>${supplier.balance} جنيه</strong></p>

        <div class="actions">
          <button class="btn btn-secondary edit">تعديل</button>
          <button class="btn btn-info statement">كشف حساب</button>
          <button class="btn btn-danger delete">حذف</button>
        </div>

        <div class="statement-box" style="display:none"></div>
      </div>
    `;

    card.querySelector(".delete").onclick =
      () => deleteSupplier(supplier.id);

    card.querySelector(".edit").onclick =
      () => editSupplier(supplier);

    card.querySelector(".statement").onclick =
      () => loadStatement(supplier, card);

    container.appendChild(card);
  });
}

/* =============================
   DELETE
============================= */
async function deleteSupplier(id) {
  if (!confirm("حذف المورد؟")) return;
  await deleteDoc(doc(db, "suppliers", id));
}

/* =============================
   EDIT
============================= */
async function editSupplier(supplier) {
  const newName = prompt("اسم جديد", supplier.name);
  const newPhone = prompt("هاتف", supplier.phone || "");
  const newBalance = prompt("الرصيد", supplier.balance);

  if (newName === null) return;

  await updateDoc(doc(db, "suppliers", supplier.id), {
    name: newName,
    phone: newPhone,
    balance: Number(newBalance),
    updatedAt: Timestamp.now()
  });
}

/* =============================
   ACCOUNT STATEMENT
============================= */
async function loadStatement(supplier, card) {
  const box = card.querySelector(".statement-box");

  if (box.style.display === "block") {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  box.innerHTML = "جارٍ تحميل كشف الحساب...";

  const q = query(
    collection(db, "purchases"),
    where("supplierId", "==", supplier.id)
  );

  const snapshot = await getDocs(q);
  let html = `<h4>كشف حساب المورد</h4><ul>`;
  let total = 0;

  snapshot.forEach(docSnap => {
    const purchase = docSnap.data();
    total += purchase.total;
    html += `<li>فاتورة شراء: ${purchase.total} جنيه</li>`;
  });

  html += `</ul><p><strong>الإجمالي: ${total} جنيه</strong></p>`;
  box.innerHTML = html;
}

/* =============================
   INIT
============================= */
function loadSuppliers() {
  const col = collection(db, "suppliers");
  onSnapshot(col, renderSuppliers);
}

loadSuppliers();
