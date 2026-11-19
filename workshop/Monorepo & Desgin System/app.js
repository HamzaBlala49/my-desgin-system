/* ============================================================
   Workshop deck controller
   - renders 68 slides from window.DECK_SLIDES
   - keyboard, touch, TOC, notes, copy, fullscreen
   - 16:9 stage scaling and print/PDF support
   ============================================================ */

(() => {
  "use strict";

  const slidesData = window.DECK_SLIDES || [];
  const stage = document.getElementById("stage");
  const viewport = document.getElementById("viewport");
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const chapterIndicator = document.getElementById("chapterIndicator");

  const tocOverlay = document.getElementById("tocOverlay");
  const tocList = document.getElementById("tocList");
  const tocBtn = document.getElementById("tocBtn");
  const tocClose = document.getElementById("tocClose");

  const notesPanel = document.getElementById("notesPanel");
  const notesBody = document.getElementById("notesBody");
  const notesTitle = document.getElementById("notesTitle");
  const notesBtn = document.getElementById("notesBtn");
  const notesClose = document.getElementById("notesClose");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  const total = slidesData.length;
  let current = 0;
  let lastFocused = null;
  let touchStart = null;
  let tocItems = [];

  const pad = (value) => String(value).padStart(2, "0");
  const stripHtml = (html) => String(html).replace(/<[^>]*>/g, "").trim();
  const chapterLabel = (number) => `Chapter ${pad(number)}`;

  /* ---------- Render ---------- */

  function renderSlide(slide, index) {
    const layout = slide.layout || "standard";
    const classes = [
      "slide",
      `slide--${layout}`,
      slide.dense ? "slide--dense" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const commonAttrs = `data-index="${index}" data-title="${D.esc(
      stripHtml(slide.title || ""),
    )}" aria-roledescription="slide" aria-label="${index + 1} of ${total}: ${D.esc(
      stripHtml(slide.title || ""),
    )}"`;

    if (layout === "hero") {
      return `<section class="${classes}" ${commonAttrs}>
        ${slide.body}
        <div class="slide-footer slide-footer--hero">
          <span>Technical workshop · React / TypeScript / Turborepo</span>
          <span>${pad(index + 1)} / ${pad(total)}</span>
        </div>
      </section>`;
    }

    if (layout === "chapter") {
      return `<section class="${classes}" ${commonAttrs}>
        <div class="chapter-watermark" aria-hidden="true">${pad(slide.chapter)}</div>
        <div class="chapter-top">
          <span class="chapter-index">${chapterLabel(slide.chapter)}</span>
          <span class="chapter-name">${D.esc(slide.chapterName)}</span>
        </div>
        <header class="slide-head">
          <h2 class="slide-title">${slide.title}</h2>
          ${slide.lead ? `<p class="lead">${slide.lead}</p>` : ""}
        </header>
        <div class="slide-content">${slide.body}</div>
        <div class="slide-footer">
          <span>${D.esc(slide.chapterName)}</span>
          <span>${pad(index + 1)} / ${pad(total)}</span>
        </div>
      </section>`;
    }

    if (layout === "qa") {
      return `<section class="${classes}" ${commonAttrs}>
        ${slide.body}
        <div class="slide-footer slide-footer--hero">
          <span>Monorepo &amp; Design System · From Architecture to Production</span>
          <span>${pad(index + 1)} / ${pad(total)}</span>
        </div>
      </section>`;
    }

    return `<section class="${classes}" ${commonAttrs}>
      <header class="slide-head">
        <div class="eyebrow">${slide.eyebrow || `${chapterLabel(slide.chapter)} · ${D.esc(slide.chapterName)}`}</div>
        <h2 class="slide-title ${slide.titleClass || ""}">${slide.title}</h2>
        ${slide.lead ? `<p class="lead">${slide.lead}</p>` : ""}
      </header>
      <div class="slide-content">${slide.body}</div>
      <div class="slide-footer">
        <span>${D.esc(slide.chapterName)}</span>
        <span>${pad(index + 1)} / ${pad(total)}</span>
      </div>
    </section>`;
  }

  stage.innerHTML = slidesData.map(renderSlide).join("");
  const slides = Array.from(stage.querySelectorAll(".slide"));

  /* ---------- Highlighting and copy ---------- */

  function runHighlighting() {
    if (!window.hljs) return;
    document.querySelectorAll("pre code").forEach((block) => {
      try {
        window.hljs.highlightElement(block);
      } catch {
        /* leave plain text if a language is missing */
      }
    });
  }

  runHighlighting();

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-btn");
    if (!button) return;
    const card = button.closest(".code-card");
    const codeBlock = card ? card.querySelector("code") : null;
    if (!codeBlock) return;

    const text = codeBlock.innerText;
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copied";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 1400);
    } catch {
      button.textContent = "Select";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    }
  });

  /* ---------- Sizing ---------- */

  function fitStage() {
    const rect = viewport.getBoundingClientRect();
    const scale = Math.min((rect.width - 28) / 1280, (rect.height - 8) / 720);
    stage.style.transform = `scale(${Math.max(0.18, scale)})`;
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(fitStage).observe(viewport);
  }
  window.addEventListener("resize", fitStage);
  fitStage();

  /* ---------- TOC ---------- */

  const chapterMap = new Map();
  slidesData.forEach((slide, index) => {
    if (!chapterMap.has(slide.chapter)) {
      chapterMap.set(slide.chapter, {
        number: slide.chapter,
        name: slide.chapterName,
        items: [],
      });
    }
    chapterMap.get(slide.chapter).items.push({ slide, index });
  });

  tocList.innerHTML = Array.from(chapterMap.values())
    .map(
      (chapter) => `
      <section class="toc-chapter">
        <header class="toc-chapter-head">
          <span class="toc-chapter-num">${pad(chapter.number)}</span>
          <strong>${D.esc(chapter.name)}</strong>
          <small>${chapter.items.length} slides</small>
        </header>
        <div class="toc-items">
          ${chapter.items
            .map(
              ({ slide, index }) => `
              <button class="toc-item" type="button" data-index="${index}">
                <span class="toc-item-num">${pad(index + 1)}</span>
                <span class="toc-item-title">${stripHtml(slide.title)}</span>
              </button>`,
            )
            .join("")}
        </div>
      </section>`,
    )
    .join("");

  tocItems = Array.from(tocList.querySelectorAll(".toc-item"));

  function updateToc() {
    tocItems.forEach((item) => {
      item.classList.toggle("is-current", Number(item.dataset.index) === current);
    });
  }

  tocList.addEventListener("click", (event) => {
    const item = event.target.closest(".toc-item");
    if (!item) return;
    goTo(Number(item.dataset.index));
    closeToc();
  });

  function openToc() {
    lastFocused = document.activeElement;
    tocOverlay.classList.add("is-open");
    tocOverlay.setAttribute("aria-hidden", "false");
    updateToc();
    const active = tocItems[current];
    if (active) active.scrollIntoView({ block: "nearest" });
    window.setTimeout(() => tocClose.focus(), 30);
  }

  function closeToc() {
    tocOverlay.classList.remove("is-open");
    tocOverlay.setAttribute("aria-hidden", "true");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function toggleToc() {
    if (tocOverlay.classList.contains("is-open")) closeToc();
    else openToc();
  }

  tocBtn.addEventListener("click", toggleToc);
  tocClose.addEventListener("click", closeToc);
  tocOverlay.addEventListener("click", (event) => {
    if (event.target === tocOverlay) closeToc();
  });

  /* ---------- Notes ---------- */

  function updateNotes() {
    const slide = slidesData[current];
    if (!slide) return;
    notesTitle.textContent = `${pad(current + 1)} · ${stripHtml(slide.title || "")}`;

    const notes = slide.notes || {};
    const note = (label, text) =>
      text
        ? `<div class="note-block"><span class="note-label">${label}</span><p>${text}</p></div>`
        : "";

    notesBody.innerHTML = `
      <div class="notes-main">
        ${note("What to explain", notes.say)}
        ${note("Concrete example", notes.example)}
        ${note("Technical detail", notes.detail)}
        ${note("Transition", notes.next)}
      </div>
      ${
        notes.ar
          ? `<div class="note-ar" dir="rtl" lang="ar">
              <span class="note-label">بالعربية</span>
              <p>${notes.ar}</p>
            </div>`
          : ""
      }
    `;
  }

  function openNotes() {
    notesPanel.classList.add("is-open");
    notesPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("notes-open");
    updateNotes();
    window.setTimeout(fitStage, 320);
  }

  function closeNotes() {
    notesPanel.classList.remove("is-open");
    notesPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("notes-open");
    window.setTimeout(fitStage, 320);
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
    current = Math.max(0, Math.min(total - 1, Number(index) || 0));

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.classList.toggle("is-before", slideIndex < current);
      slide.classList.toggle("is-after", slideIndex > current);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    const slide = slidesData[current];
    counter.textContent = `${pad(current + 1)} / ${pad(total)}`;
    progressBar.style.transform = `scaleX(${(current + 1) / total})`;
    chapterIndicator.textContent = `${pad(slide.chapter)} · ${slide.chapterName}`;
    updateToc();
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

    const active = tocItems[current];
    if (active && tocOverlay.classList.contains("is-open")) {
      active.scrollIntoView({ block: "nearest" });
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

  /* ---------- Fullscreen ---------- */

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
      window.setTimeout(fitStage, 140);
    } catch {
      /* fullscreen can be blocked by the browser */
    }
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", () => window.setTimeout(fitStage, 140));

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
        toggleToc();
        break;
      case "n":
      case "N":
        event.preventDefault();
        toggleNotes();
        break;
      case "f":
      case "F":
        event.preventDefault();
        toggleFullscreen();
        break;
      case "Escape":
        if (tocOverlay.classList.contains("is-open")) {
          event.preventDefault();
          closeToc();
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
      if (tocOverlay.classList.contains("is-open")) return;
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;
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

  /* ---------- Print ---------- */

  let themeBeforePrint = null;
  window.addEventListener("beforeprint", () => {
    themeBeforePrint = document.documentElement.dataset.theme;
  });
  window.addEventListener("afterprint", () => {
    themeBeforePrint = null;
  });

  /* ---------- Boot ---------- */

  const initial = readHash();
  goTo(initial === null ? 0 : initial, { fromHash: true });
  tocOverlay.setAttribute("aria-hidden", "true");
  notesPanel.setAttribute("aria-hidden", "true");

  if (document.fonts?.ready) {
    document.fonts.ready.then(fitStage).catch(() => {});
  }
})();
