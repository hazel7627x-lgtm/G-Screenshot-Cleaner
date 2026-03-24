console.log("G-Screenshot Auto-Cleaner Content Script loaded!");

let cooldown = false;

function triggerCleanup() {
  if (cooldown) return; // Don't fire twice for same paste
  cooldown = true;
  setTimeout(() => { cooldown = false; }, 2000);

  console.log("[G-Cleaner] Image detected in Gemini! Sending cleanup request...");
  chrome.runtime.sendMessage({ action: 'cleanup' });
}

// ─────────────── Method 1: Standard paste event ───────────────
// Works when paste event propagates normally
document.addEventListener('paste', (e) => {
  if (!e.clipboardData) return;
  for (const item of e.clipboardData.items) {
    if (item.type.startsWith('image/')) {
      triggerCleanup();
      return;
    }
  }
}, true);

// ─────────────── Method 2: MutationObserver ───────────────
// Watches for Gemini's image preview thumbnail appearing in the DOM.
// This catches cases where Gemini handles paste internally and doesn't
// propagate the standard event.
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      // Check for image elements directly added
      if (node.tagName === 'IMG') {
        const src = node.src || '';
        // Gemini uses blob: URLs for pasted images
        if (src.startsWith('blob:') || src.startsWith('data:image')) {
          triggerCleanup();
          return;
        }
      }

      // Check for image elements within a subtree (e.g. inside a container div)
      const imgs = node.querySelectorAll('img');
      for (const img of imgs) {
        const src = img.src || '';
        if (src.startsWith('blob:') || src.startsWith('data:image')) {
          triggerCleanup();
          return;
        }
      }
    }
  }
});

// Start observing the full body for any added elements
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log("[G-Cleaner] Both paste listener and MutationObserver active.");
