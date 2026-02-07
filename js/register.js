/* =====================================
   ITQAN POS - Register
   File: register.js
   ===================================== */

import { auth, db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== DOM Elements ===== */
const registerForm = document.getElementById("register-form");
const emailInput = document.getElementById("reg-email");
const passwordInput = document.getElementById("reg-password");
const nameInput = document.getElementById("reg-name");
const roleSelect = document.getElementById("reg-role");
const registerBtn = document.getElementById("register-btn");
const registerMessage = document.getElementById("register-message");

/* ===== Handle Registration ===== */
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const name = nameInput.value.trim();
    const role = roleSelect.value;

    if (!email || !password || !name || !role) {
      displayMessage("جميع الحقول مطلوبة", "danger");
      return;
    }

    registerBtn.disabled = true;

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // حفظ البيانات في Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        createdAt: new Date()
      });

      displayMessage("تم إنشاء الحساب بنجاح", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);

    } catch (error) {
      displayMessage("خطأ أثناء التسجيل: " + error.message, "danger");
      registerBtn.disabled = false;
    }
  });
}

/* ===== Helper Function ===== */
function displayMessage(msg, type) {
  if (!registerMessage) return;
  registerMessage.textContent = msg;
  registerMessage.className = "";
  registerMessage.classList.add("fade-in");
  registerMessage.classList.add(type === "danger" ? "badge-danger" : "badge-success");
}
