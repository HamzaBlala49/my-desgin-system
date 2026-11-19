/* ============================================================
   Deck controller
   - Keyboard, touch, pager, deep links
   - Outline overlay, speaker notes
   - Theme toggle, fullscreen
   - 16:9 stage scaling
   ============================================================ */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const stage = $("#stage");
  const viewport = $("#viewport");
  const slides = $$(".slide");
  const total = slides.length;

  const counter = $("#counter");
  const progressBar = $("#progressBar");

  const outlineOverlay = $("#outlineOverlay");
  const outlineGrid = $("#outlineGrid");
  const outlineBtn = $("#outlineBtn");
  const outlineClose = $("#outlineClose");

  const notesPanel = $("#notesPanel");
  const notesBtn = $("#notesBtn");
  const notesClose = $("#notesClose");
  const notesTitle = $("#notesTitle");
  const notesBody = $("#notesBody");

  const themeBtn = $("#themeBtn");
  const fullscreenBtn = $("#fullscreenBtn");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");

  let current = 0;
  let lastFocused = null;
  let touchStart = null;

  const pad = (value) => String(value).padStart(2, "0");
  const titleOf = (slide) => slide.dataset.title || "Untitled";
  const partOf = (slide) => slide.dataset.part || "";

  /* ---------- Sizing ---------- */

  function fitStage() {
    if (!stage || !viewport) return;
    const rect = viewport.getBoundingClientRect();
    const scale = Math.min((rect.width - 32) / 1280, (rect.height - 8) / 720);
    stage.style.transform = `scale(${Math.max(0.18, scale)})`;
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(fitStage).observe(viewport);
  }
  window.addEventListener("resize", fitStage);
  fitStage();

  /* ---------- Outline ---------- */

  const outlineItems = slides.map((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "outline-item";
    button.setAttribute("aria-label", `Go to slide ${index + 1}: ${titleOf(slide)}`);

    const num = document.createElement("span");
    num.className = "outline-num";
    num.textContent = pad(index + 1);

    const title = document.createElement("span");
    title.className = "outline-title";
    title.textContent = titleOf(slide);

    const part = document.createElement("span");
    part.className = "outline-part";
    part.textContent = partOf(slide);

    button.append(num, title, part);
    button.addEventListener("click", () => {
      goTo(index);
      closeOutline();
    });

    outlineGrid.append(button);
    return button;
  });

  function updateOutline() {
    outlineItems.forEach((item, index) => {
      item.classList.toggle("is-current", index === current);
    });

    const active = outlineItems[current];
    if (active && outlineOverlay.classList.contains("is-open")) {
      active.scrollIntoView({ block: "nearest" });
    }
  }

  function openOutline() {
    lastFocused = document.activeElement;
    outlineOverlay.classList.add("is-open");
    outlineOverlay.setAttribute("aria-hidden", "false");
    updateOutline();
    window.setTimeout(() => outlineClose.focus(), 30);
  }

  function closeOutline() {
    outlineOverlay.classList.remove("is-open");
    outlineOverlay.setAttribute("aria-hidden", "true");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function toggleOutline() {
    if (outlineOverlay.classList.contains("is-open")) closeOutline();
    else openOutline();
  }

  outlineBtn.addEventListener("click", toggleOutline);
  outlineClose.addEventListener("click", closeOutline);
  outlineOverlay.addEventListener("click", (event) => {
    if (event.target === outlineOverlay) closeOutline();
  });

  /* ---------- Notes ---------- */

  function updateNotes() {
    const slide = slides[current];
    const note = slide ? slide.querySelector(".notes") : null;
    notesTitle.textContent = slide ? `${pad(current + 1)} · ${titleOf(slide)}` : "Slide";
    notesBody.innerHTML = note ? note.innerHTML : "<p>No notes for this slide.</p>";
  }

  function openNotes() {
    notesPanel.classList.add("is-open");
    notesPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("notes-open");
    updateNotes();
    window.setTimeout(fitStage, 300);
  }

  function closeNotes() {
    notesPanel.classList.remove("is-open");
    notesPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("notes-open");
    window.setTimeout(fitStage, 300);
  }

  function toggleNotes() {
    if (notesPanel.classList.contains("is-open")) closeNotes();
    else openNotes();
  }

  notesBtn.addEventListener("click", toggleNotes);
  notesClose.addEventListener("click", closeNotes);

  /* ---------- Navigation ---------- */

  function readHash() {
    const match = window.location.hash.match(/^#\/(\d+)$/);
    if (!match) return null;
    const index = Number(match[1]) - 1;
    return index >= 0 && index < total ? index : null;
  }

  function goTo(index, options = {}) {
    const next = Math.max(0, Math.min(total - 1, Number(index) || 0));
    current = next;

    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.classList.toggle("is-before", i < current);
      slide.classList.toggle("is-after", i > current);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    counter.textContent = `${pad(current + 1)} / ${pad(total)}`;
    progressBar.style.transform = `scaleX(${(current + 1) / total})`;
    updateOutline();
    updateNotes();

    if (!options.fromHash) {
      const hash = `#/${current + 1}`;
      if (window.location.hash !== hash) {
        try {
          window.history.replaceState(null, "", hash);
        } catch {
          window.location.hash = hash;
        }
      }
    }
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  window.addEventListener("hashchange", () => {
    const index = readHash();
    if (index !== null && index !== current) goTo(index, { fromHash: true });
  });

  /* ---------- Theme ---------- */

  function setTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    themeBtn.title =
      nextTheme === "dark" ? "Switch to light theme (T)" : "Switch to dark theme (T)";
    try {
      window.localStorage.setItem("mds-deck-theme", nextTheme);
    } catch {
      /* storage can be blocked; theme still works for this session */
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  themeBtn.addEventListener("click", toggleTheme);

  try {
    const saved = window.localStorage.getItem("mds-deck-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  } catch {
    /* ignore */
  }

  /* ---------- Fullscreen ---------- */

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
      window.setTimeout(fitStage, 120);
    } catch {
      /* fullscreen may be blocked by the browser */
    }
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", () => window.setTimeout(fitStage, 120));

  /* ---------- Keyboard ---------- */

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const target = event.target;
    const isEditable =
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable);
    if (isEditable) return;

    const isSpace = event.key === " " || event.code === "Space";
    if (isSpace && target instanceof HTMLElement && target.closest("button, a")) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
        event.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        prev();
        break;
      case " ":
      case "Spacebar":
        event.preventDefault();
        next();
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(total - 1);
        break;
      case "o":
      case "O":
        event.preventDefault();
        toggleOutline();
        break;
      case "n":
      case "N":
        event.preventDefault();
        toggleNotes();
        break;
      case "t":
      case "T":
        event.preventDefault();
        toggleTheme();
        break;
      case "f":
      case "F":
        event.preventDefault();
        toggleFullscreen();
        break;
      case "Escape":
        if (outlineOverlay.classList.contains("is-open")) {
          event.preventDefault();
          closeOutline();
        } else if (notesPanel.classList.contains("is-open")) {
          event.preventDefault();
          closeNotes();
        }
        break;
      default:
        break;
    }
  });

  /* ---------- Touch ---------- */

  viewport.addEventListener(
    "touchstart",
    (event) => {
      if (outlineOverlay.classList.contains("is-open")) return;
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;
      if (outlineOverlay.classList.contains("is-open")) {
        touchStart = null;
        return;
      }

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;

      if (Math.abs(dx) > 52 && Math.abs(dy) < 70) {
        if (dx < 0) next();
        else prev();
      }
    },
    { passive: true },
  );

  /* ---------- Accessibility labels ---------- */

  slides.forEach((slide, index) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} of ${total}: ${titleOf(slide)}`);
  });

  outlineOverlay.setAttribute("aria-hidden", "true");
  notesPanel.setAttribute("aria-hidden", "true");

  /* ---------- Print handling ---------- */

  let themeBeforePrint = null;

  window.addEventListener("beforeprint", () => {
    themeBeforePrint = document.documentElement.dataset.theme;
    if (themeBeforePrint === "dark") {
      document.documentElement.dataset.theme = "light";
    }
  });

  window.addEventListener("afterprint", () => {
    if (themeBeforePrint === "dark") {
      document.documentElement.dataset.theme = "dark";
    }
    themeBeforePrint = null;
  });

  /* ---------- Boot ---------- */

  const initial = readHash();
  goTo(initial === null ? 0 : initial, { fromHash: true });

  // Re-fit after fonts load; the stage itself is fixed, but this keeps chrome aligned.
  if (document.fonts?.ready) {
    document.fonts.ready.then(fitStage).catch(() => {});
  }
})();
