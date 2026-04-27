document.addEventListener("DOMContentLoaded", () => {

  const editor = document.getElementById("editor");
  const overlay = document.getElementById("overlay");

  const KEY = "exam_offline_content";

  // LOAD
  editor.value = localStorage.getItem(KEY) || "";

  // CURSOR FIX
  setTimeout(() => {
    editor.focus();
    editor.setSelectionRange(editor.value.length, editor.value.length);
  }, 100);

  // OVERLAY
  function updateOverlay() {
    overlay.style.display = editor.value.length ? "none" : "block";
  }
  updateOverlay();

  // AUTOSAVE
  editor.addEventListener("input", () => {
    localStorage.setItem(KEY, editor.value);
    updateOverlay();
  });

  // LOCKDOWN BEHAVIOR
  document.addEventListener("contextmenu", e => e.preventDefault());

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      e.key === "F5" ||
      (e.ctrlKey && ["r","t","n","w"].includes(e.key.toLowerCase()))
    ) {
      e.preventDefault();
    }
  });

  window.addEventListener("blur", () => {
    setTimeout(() => editor.focus(), 0);
  });

});