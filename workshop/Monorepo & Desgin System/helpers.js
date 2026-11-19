/* ============================================================
   Shared slide helpers
   Each chapter file calls D.register([...])
   ============================================================ */

(() => {
  "use strict";

  window.DECK_SLIDES = window.DECK_SLIDES || [];

  const esc = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  function dedent(source) {
    const lines = String(source)
      .replace(/^\n+/, "")
      .replace(/\n+$/, "")
      .split("\n");

    const indents = lines
      .filter((line) => line.trim().length > 0)
      .map((line) => (line.match(/^\s*/) || [""])[0].length);

    const min = indents.length ? Math.min(...indents) : 0;
    return lines.map((line) => line.slice(min)).join("\n");
  }

  function code(lang, source, file = "", options = {}) {
    const label = file || lang;
    return `
      <div class="code-card ${options.className || ""}">
        <div class="code-head">
          <span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="code-file">${esc(label)}</span>
          <span class="code-lang">${esc(lang)}</span>
          <button class="copy-btn" type="button" aria-label="Copy code">Copy</button>
        </div>
        <pre class="code-body"><code class="language-${esc(lang)}">${esc(dedent(source))}</code></pre>
      </div>`;
  }

  function terminal(title, rows) {
    return `
      <div class="terminal">
        <div class="term-head">
          <span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span>${esc(title)}</span>
        </div>
        <pre class="term-body">${rows
          .map(
            (row) =>
              `<span class="term-line term-${row.type || "out"}">${
                row.type === "cmd" ? '<span class="term-prompt">$</span> ' : ""
              }${esc(row.text)}</span>`,
          )
          .join("\n")}</pre>
      </div>`;
  }

  function table(headers, rows, options = {}) {
    const cols = options.cols || `repeat(${headers.length}, minmax(0, 1fr))`;
    const head = headers.map((cell) => `<span>${cell}</span>`).join("");
    const body = rows
      .map(
        (row) =>
          `<div class="trow">${row
            .map((cell, index) => {
              const cls = options.accentCol === index ? "col-accent" : "";
              return `<span class="${cls}">${cell}</span>`;
            })
            .join("")}</div>`,
      )
      .join("");

    return `
      <div class="table ${options.compact ? "table--compact" : ""}" style="--cols:${cols}">
        <div class="trow thead">${head}</div>
        ${body}
      </div>`;
  }

  function flow(steps, options = {}) {
    return `
      <div class="flow ${options.className || ""}">
        ${steps
          .map(
            (step, index) => `
            ${
              index > 0
                ? `<span class="flow-arrow" aria-hidden="true">${options.vertical ? "↓" : "→"}</span>`
                : ""
            }
            <div class="flow-step ${step.active ? "flow-step--active" : ""}">
              ${step.num ? `<span class="flow-num">${step.num}</span>` : ""}
              <strong>${step.title}</strong>
              ${step.text ? `<p>${step.text}</p>` : ""}
              ${step.foot ? `<span class="flow-foot">${step.foot}</span>` : ""}
            </div>`,
          )
          .join("")}
      </div>`;
  }

  function bullets(items, className = "") {
    return `<ul class="bullets ${className}">${items
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  }

  function checks(items, className = "") {
    return `<ul class="checks ${className}">${items
      .map((item) => `<li><span aria-hidden="true">✓</span><span>${item}</span></li>`)
      .join("")}</ul>`;
  }

  function crosses(items, className = "") {
    return `<ul class="crosses ${className}">${items
      .map((item) => `<li><span aria-hidden="true">×</span><span>${item}</span></li>`)
      .join("")}</ul>`;
  }

  function card({ kicker, title, text, foot, className = "" }) {
    return `
      <div class="card ${className}">
        ${kicker ? `<span class="card-kicker">${kicker}</span>` : ""}
        ${title ? `<h3>${title}</h3>` : ""}
        ${text ? `<p>${text}</p>` : ""}
        ${foot ? `<div class="card-foot">${foot}</div>` : ""}
      </div>`;
  }

  function pill(text, className = "") {
    return `<span class="pill ${className}">${text}</span>`;
  }

  function metric(value, label, sub = "") {
    return `
      <div class="metric">
        <strong>${value}</strong>
        <span>${label}</span>
        ${sub ? `<small>${sub}</small>` : ""}
      </div>`;
  }

  function tokenChip(name, value = "", className = "") {
    return `
      <div class="token-chip ${className}">
        <span class="token-name">${name}</span>
        ${value ? `<span class="token-value">${value}</span>` : ""}
      </div>`;
  }

  function register(slides) {
    window.DECK_SLIDES.push(...slides);
  }

  window.D = {
    esc,
    dedent,
    code,
    terminal,
    table,
    flow,
    bullets,
    checks,
    crosses,
    card,
    pill,
    metric,
    tokenChip,
    register,
  };
})();
