console.log("SCRIPT IS RUNNING");

document.addEventListener("DOMContentLoaded", () => {

  const editor = document.getElementById("editor");
  const overlay = document.getElementById("overlay");
  const downloadBtn = document.getElementById("downloadBtn");
  const status = document.getElementById("status");

  const STORAGE_KEY = "exam_app_content";

  // -----------------------------
  // LOAD SAVED CONTENT
  // -----------------------------
  editor.value = localStorage.getItem(STORAGE_KEY) || "";

  // -----------------------------
  // CURSOR FIX (always visible on load)
  // -----------------------------
  setTimeout(() => {
    editor.focus();

    if (editor.value.length === 0) {
      editor.setSelectionRange(0, 0);
    } else {
      editor.setSelectionRange(editor.value.length, editor.value.length);
    }
  }, 200);

  // -----------------------------
  // OVERLAY LOGIC (start typing screen)
  // -----------------------------
  function updateOverlay() {
    overlay.style.display =
      editor.value.trim().length === 0 ? "block" : "none";
  }
  updateOverlay();

  // -----------------------------
  // AUTOSAVE
  // -----------------------------
  let saveTimer;

  editor.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    updateOverlay();

    status.textContent = "Autosaving...";

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      status.textContent = "Autosaved";
    }, 300);
  });

  // -----------------------------
  // DOWNLOAD (exam-safe version)
  // -----------------------------
  downloadBtn.addEventListener("click", () => {

    console.log("Download triggered");

    status.textContent = "Preparing download...";

    const text = editor.value;

    const filename = `AP_Exam_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.txt`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    status.textContent = "Saved to Downloads folder";
    setTimeout(() => {
      status.textContent = "Autosaved";
    }, 2000);
  });

  // -----------------------------
  // PRINT SUPPORT (optional)
  // -----------------------------
  window.printDocument = function () {
    window.print();
  };

  // -----------------------------
  // BASIC LOCKDOWN BEHAVIOR (soft, Chrome-safe)
  // -----------------------------

  document.addEventListener("contextmenu", (e) => e.preventDefault());

  document.addEventListener("keydown", (e) => {
    const blocked = ["F12", "F5"];

    if (
      blocked.includes(e.key) ||
      (e.ctrlKey &&
        ["r", "t", "n", "w", "p", "s"].includes(e.key.toLowerCase()))
    ) {
      e.preventDefault();
    }
  });

  window.addEventListener("blur", () => {
    setTimeout(() => editor.focus(), 0);
  });

});


// -----------------------------
// SERVICE WORKER REGISTRATION
// -----------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.log("Service Worker FAILED:", err);
      });
  });
}
