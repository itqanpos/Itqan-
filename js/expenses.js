// js/expenses.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   DOM
============================= */
const form = document.getElementById("add-expense-form");
const titleInput = document.getElementById("expense-title");
const categorySelect = document.getElementById("expense-category");
const amountInput = document.getElementById("expense-amount");
const message = document.getElementById("expense-message");
const container = document.getElementById("expenses-container");

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
   ADD EXPENSE
============================= */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const amount = Number(amountInput.value);

  if (!title || amount <= 0) {
    showMessage("بيانات غير صحيحة", "error");
    return;
  }

  await addDoc(collection(db, "expenses"), {
    title,
    category,
    amount,
    createdAt: Timestamp.now()
  });

  form.reset();
  showMessage("تم تسجيل المصروف بنجاح");
});

/* =============================
   RENDER EXPENSES
============================= */
function renderExpenses(snapshot) {
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const exp = docSnap.data();
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
      <div class="card-body">
        <p>الوصف: ${exp.title}</p>
        <p>التصنيف: ${exp.category}</p>
        <p>المبلغ: <strong>${exp.amount} جنيه</strong></p>
        <p>التاريخ: ${exp.createdAt.toDate().toLocaleString()}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

/* =============================
   INIT
============================= */
function initExpenses() {
  const col = collection(db, "expenses");
  onSnapshot(col, renderExpenses);
}

initExpenses();
