// js/settings.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   DOM
============================= */
const currencyInput = document.getElementById("currency");
const languageSelect = document.getElementById("language");
const settingsForm = document.getElementById("currency-language-form");
const settingsMsg = document.getElementById("settings-message");

const userNameInput = document.getElementById("user-name");
const branchNameInput = document.getElementById("branch-name");
const usersBranchesForm = document.getElementById("users-branches-form");
const usersBranchesMsg = document.getElementById("users-branches-message");

/* =============================
   HELPERS
============================= */
function showMessage(el, text, type = "success") {
  if (!el) return;
  el.textContent = text;
  el.className = type === "error" ? "text-danger" : "text-success";
  setTimeout(() => (el.textContent = ""), 3000);
}

/* =============================
   SAVE SETTINGS
============================= */
settingsForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currency = currencyInput.value.trim();
  const language = languageSelect.value;

  if (!currency) return showMessage(settingsMsg, "العملة مطلوبة", "error");

  await addDoc(collection(db, "settings"), {
    currency,
    language,
    createdAt: Timestamp.now()
  });

  showMessage(settingsMsg, "تم حفظ الإعدادات بنجاح");
});

/* =============================
   ADD USER
============================= */
usersBranchesForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = userNameInput.value.trim();
  const branchName = branchNameInput.value.trim();

  if (userName) {
    await addDoc(collection(db, "users"), {
      name: userName,
      createdAt: Timestamp.now()
    });
  }

  if (branchName) {
    await addDoc(collection(db, "branches"), {
      name: branchName,
      createdAt: Timestamp.now()
    });
  }

  usersBranchesForm.reset();
  showMessage(usersBranchesMsg, "تمت الإضافات بنجاح");
});
