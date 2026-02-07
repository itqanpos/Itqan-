// js/activity-log.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =============================
   DOM
============================= */
const logContainer = document.getElementById("activity-log");

/* =============================
   HELPERS
============================= */
function renderLog(snapshot) {
  logContainer.innerHTML = "";
  snapshot.forEach(docSnap => {
    const log = docSnap.data();
    const div = document.createElement("div");
    div.className = "log-entry fade-in";
    div.innerHTML = `
      <p><strong>${log.user || "نظام"}</strong> قام ب${log.action} - ${log.timestamp.toDate().toLocaleString()}</p>
    `;
    logContainer.appendChild(div);
  });
}

/* =============================
   LOG ACTIVITY
============================= */
export async function logActivity(user, action) {
  await addDoc(collection(db, "activityLog"), {
    user,
    action,
    timestamp: Timestamp.now()
  });
}

/* =============================
   INIT
============================= */
const q = query(collection(db, "activityLog"), orderBy("timestamp", "desc"));
onSnapshot(q, renderLog);
