console.log("SCRIPT IS RUNNING");

document.addEventListener("DOMContentLoaded", () => {

  const editor = document.getElementById("editor");
  const overlay = document.getElementById("overlay");
  const downloadBtn = document.getElementById("downloadBtn");
  const filenameInput = document.getElementById("filename");
  const status = document.getElementById("status");

  const STORAGE_KEY = "exam_app_content";

  // -----------------------------
  // LOAD SAVED CONTENT
  // -----------------------------
  editor.value = localStorage.getItem(STORAGE_KEY) || "";

  // -----------------------------
  // FORCE CURSOR FOCUS (fix Chromebook issue)
  // -----------------------------
  setTimeout(() => {
    editor.focus();
    editor.setSelectionRange(editor.value.length, editor.value.length);
  }, 120);

  // -----------------------------
  // OVERLAY LOGIC
  // -----------------------------
  function updateOverlay() {
    overlay.style.display = editor.value.length === 0 ? "block" : "none";
  }
  updateOverlay();

  // -----------------------------
  // AUTOSAVE
  // -----------------------------
  editor.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    updateOverlay();

    status.textContent = "Saving...";
    clearTimeout(window.__saveTimer);

    window.__saveTimer = setTimeout(() => {
      status.textContent = "Saved";
    }, 300);
  });

  // -----------------------------
  // DOWNLOAD (FIXED + CHROME SAFE)
  // -----------------------------
  downloadBtn.addEventListener("click", () => {

    console.log("Download triggered");

    const text = editor.value;
    const filename = (filenameInput && filenameInput.value) || "document.txt";

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Required for ChromeOS reliability
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    status.textContent = "Downloaded";
    setTimeout(() => status.textContent = "Saved", 1000);
  });

  // -----------------------------
  // PRINT (optional but useful for exams)
  // -----------------------------
  window.printDocument = function () {
    window.print();
  };

  // -----------------------------
  // SOFT LOCKDOWN (UI-level only)
  // -----------------------------

  // Disable right-click (you already mentioned this)
  document.addEventListener("contextmenu", e => e.preventDefault());

  // Block common shortcuts
  document.addEventListener("keydown", (e) => {

    if (
      e.key === "F12" ||
      e.key === "F5" ||
      (e.ctrlKey && ["r", "t", "n", "w", "p", "s"].includes(e.key.toLowerCase()))
    ) {
      e.preventDefault();
    }

  });

  // Refocus if user tries to leave app
  window.addEventListener("blur", () => {
    setTimeout(() => editor.focus(), 0);
  });

});
