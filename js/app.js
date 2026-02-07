/* =====================================
   ITQAN POS - Main App
   File: app.js
   ===================================== */

import { auth } from "./firebase.js";

/* ===== DOM Elements ===== */
const app = document.getElementById("app");
const loader = document.getElementById("app-loader");
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const navItems = sidebar.querySelectorAll("nav li");
const logoutBtn = document.getElementById("logout");

/* ===== Initial App Load ===== */
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
    app.classList.remove("hidden");
    initSidebar();
    loadPage("dashboard");
  }, 800); // Simulate loading
});

/* ===== Sidebar Navigation ===== */
function initSidebar() {
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      if(item.id === "logout") {
        logoutUser();
        return;
      }
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const page = item.dataset.page;
      loadPage(page);
    });
  });
}

/* ===== Load Pages Dynamically ===== */
function loadPage(page) {
  switch(page) {
    case "dashboard":
      content.innerHTML = `<h2 class="fade-in">لوحة التحكم</h2><p>إحصائيات النظام تظهر هنا.</p>`;
      break;
    case "pos":
      content.innerHTML = `<h2 class="fade-in">نقطة البيع</h2><p>شاشة البيع ستظهر هنا.</p>`;
      break;
    case "products":
      content.innerHTML = `<h2 class="fade-in">الأصناف</h2><p>إدارة الأصناف ستظهر هنا.</p>`;
      break;
    case "customers":
      content.innerHTML = `<h2 class="fade-in">العملاء</h2><p>إدارة العملاء ستظهر هنا.</p>`;
      break;
    case "suppliers":
      content.innerHTML = `<h2 class="fade-in">الموردين</h2><p>إدارة الموردين ستظهر هنا.</p>`;
      break;
    case "reports":
      content.innerHTML = `<h2 class="fade-in">التقارير</h2><p>تقارير النظام ستظهر هنا.</p>`;
      break;
    case "settings":
      content.innerHTML = `<h2 class="fade-in">الإعدادات</h2><p>إعدادات النظام ستظهر هنا.</p>`;
      break;
    default:
      content.innerHTML = `<h2 class="fade-in">الصفحة غير موجودة</h2>`;
  }
}

/* ===== Logout Function ===== */
function logoutUser() {
  auth.signOut()
    .then(() => {
      alert("تم تسجيل الخروج بنجاح");
      window.location.reload();
    })
    .catch(err => console.error("Logout Error:", err));
}
