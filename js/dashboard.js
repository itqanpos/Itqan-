/* =====================================
   ITQAN POS - Dashboard
   File: dashboard.js
   ===================================== */

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== DOM Elements ===== */
const dashboardContainer = document.getElementById("dashboard-container");

/* ===== Load Dashboard Data ===== */
export async function loadDashboard() {
  if (!dashboardContainer) return;

  dashboardContainer.innerHTML = `
    <h2 class="fade-in">لوحة التحكم</h2>
    <div class="cards-container" style="display:flex; gap: var(--space-md); margin-top: var(--space-lg); flex-wrap:wrap;">
      <div class="card fade-in" id="total-sales-card">
        <div class="card-header">إجمالي المبيعات</div>
        <div class="card-body" id="total-sales">0 جنيه</div>
      </div>
      <div class="card fade-in" id="total-products-card">
        <div class="card-header">عدد الأصناف</div>
        <div class="card-body" id="total-products">0</div>
      </div>
      <div class="card fade-in" id="total-customers-card">
        <div class="card-header">عدد العملاء</div>
        <div class="card-body" id="total-customers">0</div>
      </div>
      <div class="card fade-in" id="total-suppliers-card">
        <div class="card-header">عدد الموردين</div>
        <div class="card-body" id="total-suppliers">0</div>
      </div>
    </div>
  `;

  await updateDashboardData();
}

/* ===== Fetch Data from Firestore ===== */
async function updateDashboardData() {
  try {
    // إجمالي المبيعات
    const salesSnap = await getDocs(collection(db, "sales"));
    const totalSales = salesSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
    document.getElementById("total-sales").textContent = totalSales + " جنيه";

    // عدد الأصناف
    const productsSnap = await getDocs(collection(db, "products"));
    document.getElementById("total-products").textContent = productsSnap.size;

    // عدد العملاء
    const customersSnap = await getDocs(collection(db, "customers"));
    document.getElementById("total-customers").textContent = customersSnap.size;

    // عدد الموردين
    const suppliersSnap = await getDocs(collection(db, "suppliers"));
    document.getElementById("total-suppliers").textContent = suppliersSnap.size;

  } catch (error) {
    console.error("Dashboard Load Error:", error);
  }
}
