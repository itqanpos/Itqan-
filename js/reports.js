// js/reports.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   DOM
============================= */
const dateInput = document.getElementById("report-date");
const loadBtn = document.getElementById("load-report");
const summaryContainer = document.getElementById("report-summary");

/* =============================
   HELPERS
============================= */
function formatCurrency(amount) {
  return `${amount.toFixed(2)} جنيه`;
}

/* =============================
   LOAD REPORT
============================= */
async function loadReport() {
  const selectedDate = dateInput.value;
  if (!selectedDate) return alert("اختر التاريخ");

  const start = new Date(selectedDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(selectedDate);
  end.setHours(23, 59, 59, 999);

  const salesCol = collection(db, "sales");
  const purchasesCol = collection(db, "purchases");
  const expensesCol = collection(db, "expenses");

  const salesSnap = await getDocs(
    query(salesCol, where("createdAt", ">=", Timestamp.fromDate(start)), where("createdAt", "<=", Timestamp.fromDate(end)))
  );

  const purchasesSnap = await getDocs(
    query(purchasesCol, where("createdAt", ">=", Timestamp.fromDate(start)), where("createdAt", "<=", Timestamp.fromDate(end)))
  );

  const expensesSnap = await getDocs(
    query(expensesCol, where("createdAt", ">=", Timestamp.fromDate(start)), where("createdAt", "<=", Timestamp.fromDate(end)))
  );

  let totalSales = 0, totalPurchases = 0, totalExpenses = 0;

  salesSnap.forEach(doc => totalSales += doc.data().total);
  purchasesSnap.forEach(doc => totalPurchases += doc.data().total);
  expensesSnap.forEach(doc => totalExpenses += doc.data().amount);

  summaryContainer.innerHTML = `
    <div class="card fade-in">
      <div class="card-body">
        <h3>تقرير ${selectedDate}</h3>
        <p>إجمالي المبيعات: <strong>${formatCurrency(totalSales)}</strong></p>
        <p>إجمالي المشتريات: <strong>${formatCurrency(totalPurchases)}</strong></p>
        <p>إجمالي المصروفات: <strong>${formatCurrency(totalExpenses)}</strong></p>
        <p>صافي الربح: <strong>${formatCurrency(totalSales - totalPurchases - totalExpenses)}</strong></p>
      </div>
    </div>
  `;
}

/* =============================
   INIT
============================= */
loadBtn?.addEventListener("click", loadReport);
