// js/customers.js
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
const form = document.getElementById("add-customer-form");
const container = document.getElementById("customers-container");
const message = document.getElementById("customer-message");

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
   ADD CUSTOMER
============================= */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form["customer-name"].value.trim();
  const phone = form["customer-phone"].value.trim();
  const balance = Number(form["customer-balance"].value || 0);

  if (!name) {
    showMessage("اسم العميل مطلوب", "error");
    return;
  }

  await addDoc(collection(db, "customers"), {
    name,
    phone,
    balance,
    createdAt: Timestamp.now()
  });

  form.reset();
  showMessage("تمت إضافة العميل بنجاح");
});

/* =============================
   RENDER CUSTOMERS
============================= */
function renderCustomers(snapshot) {
  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const customer = { id: docSnap.id, ...docSnap.data() };

    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
      <div class="card-header">${customer.name}</div>
      <div class="card-body">
        <p>الهاتف: ${customer.phone || "-"}</p>
        <p>الرصيد: <strong>${customer.balance} جنيه</strong></p>

        <div class="actions">
          <button class="btn btn-secondary edit">تعديل</button>
          <button class="btn btn-info statement">كشف حساب</button>
          <button class="btn btn-danger delete">حذف</button>
        </div>

        <div class="statement-box" style="display:none"></div>
      </div>
    `;

    card.querySelector(".delete").onclick =
      () => deleteCustomer(customer.id);

    card.querySelector(".edit").onclick =
      () => editCustomer(customer);

    card.querySelector(".statement").onclick =
      () => loadStatement(customer, card);

    container.appendChild(card);
  });
}

/* =============================
   DELETE
============================= */
async function deleteCustomer(id) {
  if (!confirm("حذف العميل؟")) return;
  await deleteDoc(doc(db, "customers", id));
}

/* =============================
   EDIT
============================= */
async function editCustomer(customer) {
  const newName = prompt("اسم جديد", customer.name);
  const newPhone = prompt("هاتف", customer.phone || "");
  const newBalance = prompt("الرصيد", customer.balance);

  if (newName === null) return;

  await updateDoc(doc(db, "customers", customer.id), {
    name: newName,
    phone: newPhone,
    balance: Number(newBalance),
    updatedAt: Timestamp.now()
  });
}

/* =============================
   ACCOUNT STATEMENT
============================= */
async function loadStatement(customer, card) {
  const box = card.querySelector(".statement-box");

  if (box.style.display === "block") {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  box.innerHTML = "جارٍ تحميل كشف الحساب...";

  const q = query(
    collection(db, "sales"),
    where("customerId", "==", customer.id)
  );

  const snapshot = await getDocs(q);
  let html = `<h4>كشف الحساب</h4><ul>`;
  let total = 0;

  snapshot.forEach(docSnap => {
    const sale = docSnap.data();
    total += sale.total;
    html += `<li>فاتورة: ${sale.total} جنيه</li>`;
  });

  html += `</ul><p><strong>الإجمالي: ${total} جنيه</strong></p>`;
  box.innerHTML = html;
}

/* =============================
   INIT
============================= */
function loadCustomers() {
  const col = collection(db, "customers");
  onSnapshot(col, renderCustomers);
}

loadCustomers();
