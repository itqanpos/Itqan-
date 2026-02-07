/* =====================================
   ITQAN POS - Login
   File: login.js
   ===================================== */

import { auth } from "./firebase.js";

/* ===== DOM Elements ===== */
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginMessage = document.getElementById("login-message");

/* ===== Handle Login ===== */
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      displayMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور", "danger");
      return;
    }

    loginBtn.disabled = true;
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        displayMessage("تم تسجيل الدخول بنجاح", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      })
      .catch(error => {
        displayMessage("خطأ في تسجيل الدخول: " + error.message, "danger");
        loginBtn.disabled = false;
      });
  });
}

/* ===== Helper Function ===== */
function displayMessage(msg, type) {
  if (!loginMessage) return;
  loginMessage.textContent = msg;
  loginMessage.className = "";
  loginMessage.classList.add("fade-in");
  loginMessage.classList.add(type === "danger" ? "badge-danger" : "badge-success");
}
