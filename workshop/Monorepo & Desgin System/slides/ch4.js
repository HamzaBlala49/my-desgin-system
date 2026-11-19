/* Chapter 4 — Design Tokens (slides 28–33) */

(() => {
  const { code, table, bullets, checks, card, tokenChip, pill } = window.D;

  window.D.register([
    {
      chapter: 4,
      chapterName: "Design Tokens",
      layout: "chapter",
      title: "Tokens are <em>decisions</em>, not values",
      lead: "A token gives a design decision a stable name, so every platform can resolve it differently.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "Color",
            title: "color.action.primary",
            text: "A role, not a hex value. Resolves per theme and brand.",
            className: "card--accent",
          })}
          ${card({
            kicker: "Typography",
            title: "text.body.md",
            text: "Font family, size, line height, weight, and tracking.",
          })}
          ${card({
            kicker: "Spacing",
            title: "space.4",
            text: "A scale step, not “16px somewhere in the layout”.",
          })}
          ${card({
            kicker: "Radius",
            title: "radius.md",
            text: "One corner decision reused across components.",
          })}
          ${card({
            kicker: "Shadow",
            title: "shadow.raised",
            text: "Elevation with a name and a purpose.",
          })}
          ${card({
            kicker: "Breakpoints",
            title: "breakpoint.md",
            text: "Responsive behavior shared by every app.",
          })}
        </div>
        <div class="callout" style="margin-top:12px">
          <span>@</span>
          <p><strong>A token is a contract:</strong> the name is stable, the value can change with theme, brand, or platform.</p>
        </div>
      `,
      notes: {
        say: "A token is not just a CSS variable. It is a named decision. The name says what it means; the value can change with theme or brand.",
        example: "color.action.primary can resolve to blue.600 in light mode and blue.400 in dark mode without changing the component.",
        detail: "Start with the decisions you actually repeat: color roles, type styles, spacing, radius, shadow, and breakpoints. Do not tokenize every number.",
        next: "Here is the difference between a hardcoded value and a token in real CSS.",
        ar: "التوكن ليس مجرد متغير CSS، بل قرار تصميم له اسم ثابت. الاسم يبقى، والقيمة يمكن أن تتغير حسب الثيم أو العلامة التجارية.",
      },
    },

    {
      chapter: 4,
      chapterName: "Design Tokens",
      title: "Hardcoded values <em>do not scale</em>",
      eyebrow: "Before / after",
      lead: "The same button, with and without a design decision behind it.",
      body: `
        <div class="grid-2">
          <div class="stack">
            <div class="row row--between"><span class="tag tag--rose">Before</span><span class="mono dim" style="font-size:8px">button.css</span></div>
            ${code(
              "css",
              `
              .button {
                background: #2563eb;
                color: #ffffff;
                border-radius: 8px;
                padding: 10px 16px;
              }

              .button:hover {
                background: #1d4ed8;
              }
              `,
              "button.css",
            )}
          </div>
          <div class="stack">
            <div class="row row--between"><span class="tag tag--green">After</span><span class="mono dim" style="font-size:8px">button.css</span></div>
            ${code(
              "css",
              `
              .button {
                background: var(--ds-color-action-primary);
                color: var(--ds-color-action-primary-foreground);
                border-radius: var(--ds-radius-md);
                padding: var(--ds-space-2) var(--ds-space-4);
              }

              .button:hover {
                background: var(--ds-color-action-primary-hover);
              }
              `,
              "button.css",
            )}
          </div>
        </div>
        <div class="grid-3" style="margin-top:12px">
          <div class="card card--bad">
            <span class="card-kicker">Problem 01</span>
            <h3>Theme switch</h3>
            <p>Every hardcoded value needs a second dark-mode rule.</p>
          </div>
          <div class="card card--bad">
            <span class="card-kicker">Problem 02</span>
            <h3>Rebrand</h3>
            <p>A new brand color becomes a search-and-replace across apps.</p>
          </div>
          <div class="card card--bad">
            <span class="card-kicker">Problem 03</span>
            <h3>Consistency</h3>
            <p>Two components with the same role drift to different values.</p>
          </div>
        </div>
        <div class="callout" style="margin-top:10px">
          <span>→</span>
          <p><strong>A raw value is a decision without a name.</strong> Tokens make the decision reviewable.</p>
        </div>
      `,
      notes: {
        say: "This is the simplest before-and-after in the workshop. The left button works until you need a theme, a rebrand, or a second component with the same role.",
        example: "Search a real codebase for hex colors. Every match outside the token package is a decision that escaped the system.",
        detail: "CSS variables are the delivery format, not the source of truth. The token JSON is where the decision and its aliases live.",
        next: "Tokens are organized in three layers.",
        ar: "القيمة المباشرة تعمل مؤقتاً، لكنها تفشل عند تغيير الثيم أو الهوية أو إضافة مكون جديد. التوكن يمنح القرار اسماً قابلاً للمراجعة.",
      },
    },

    {
      chapter: 4,
      chapterName: "Design Tokens",
      title: "Three layers, <em>one direction</em>",
      eyebrow: "Token types",
      lead: "Each layer answers a different question. The reference direction never flips.",
      body: `
        <div class="split">
          <div class="tier-stack">
            <div class="tier tier--component">
              <div><span class="tier-label">Component</span><strong>button.primary.background</strong></div>
              <small>component contract</small>
            </div>
            <div class="tier tier--semantic">
              <div><span class="tier-label">Semantic</span><strong>color.action.primary</strong></div>
              <small>role in the UI</small>
            </div>
            <div class="tier tier--primitive">
              <div><span class="tier-label">Primitive</span><strong>blue.500</strong></div>
              <small>raw value</small>
            </div>
            <div class="mono dim" style="font-size:7.5px;letter-spacing:0.1em">REFERENCES ↓</div>
          </div>

          <div class="stack">
            ${card({
              kicker: "Primitive",
              title: "Raw material",
              text: "blue.500, gray.100, space.4, radius.md. No product meaning. A stable scale.",
            })}
            ${card({
              kicker: "Semantic",
              title: "Meaning",
              text: "color.action.primary, color.text.primary, color.surface.raised. This is where light and dark diverge.",
              className: "card--accent",
            })}
            ${card({
              kicker: "Component",
              title: "Local contract",
              text: "button.primary.background, input.border.focus. Optional precision for one component.",
            })}
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Components reference semantic tokens,</strong> never primitives. Skipping the middle tier breaks theming.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Three layers: primitive, semantic, component. The component layer references semantic; semantic references primitive. Never the other way around.",
        example: "In light mode, color.action.primary resolves to blue.600. In dark mode, the same semantic token resolves to blue.400.",
        detail: "Component tokens are optional. Add them when a component needs a decision that is more specific than the semantic layer, not to duplicate every property.",
        next: "Naming is the API of the token system. Let's make it predictable.",
        ar: "الطبقات ثلاث: بدائي، دلالي، ومكوّن. المكوّن يشير إلى الدلالي، والدلالي يشير إلى البدائي. عكس الاتجاه يكسر الثيمات.",
      },
    },

    {
      chapter: 4,
      chapterName: "Design Tokens",
      title: "A token name is <em>an API</em>",
      eyebrow: "Naming conventions",
      lead: "Name the role, not the value. Keep one order everywhere.",
      body: `
        <div class="diagram-box" style="padding:12px 15px">
          <div class="graph-h" style="justify-content:flex-start;gap:5px">
            <span class="pill pill--accent">color</span><span class="dim">.</span>
            <span class="pill">action</span><span class="dim">.</span>
            <span class="pill">primary</span><span class="dim">.</span>
            <span class="pill">hover</span>
          </div>
          <p class="dim" style="font-size:8.5px;margin-top:6px">category · role · variant · state</p>
        </div>

        <div class="grid-3" style="margin-top:10px">
          <div class="card">
            <span class="card-kicker">Primitive</span>
            ${tokenChip("blue-500", "#3b82f6")}
            ${tokenChip("gray-100", "#f3f4f6")}
            ${tokenChip("spacing-4", "16px")}
          </div>
          <div class="card card--accent">
            <span class="card-kicker">Semantic</span>
            ${tokenChip("color-text-primary", "content")}
            ${tokenChip("color-background-default", "surface")}
            ${tokenChip("color-action-primary", "action")}
          </div>
          <div class="card">
            <span class="card-kicker">Component</span>
            ${tokenChip("button-primary-background", "action")}
            ${tokenChip("input-border-focus", "focus")}
            ${tokenChip("card-radius", "radius.md")}
          </div>
        </div>

        ${table(
          ["Instead of", "Use", "Why"],
          [
            ["<code>color-blue</code>", "<code>color-action-primary</code>", "Role survives a rebrand."],
            ["<code>darkText</code>", "<code>color-text-primary</code>", "Theme is not part of the name."],
            ["<code>btnBlue</code>", "<code>button-primary-background</code>", "Component names contain the component."],
          ],
          { cols: "1fr 1.35fr 1.1fr", compact: true, accentCol: 1 },
        )}
        <div class="callout" style="margin-top:8px">
          <span>→</span>
          <p><strong>Stable name, changing value.</strong> If the name must change when the theme changes, it is not semantic yet.</p>
        </div>
      `,
      notes: {
        say: "The name is the API. If a designer says “action primary” and an engineer sees color-blue-600, the system is already leaking implementation.",
        example: "color-text-primary is stable in light and dark. darkText is not; it describes the mode instead of the role.",
        detail: "Choose one separator convention and let the build normalize it. Dot notation in JSON, kebab-case in CSS, and camelCase in JS are all fine if the mapping is automatic.",
        next: "Now let's see the actual DTCG JSON.",
        ar: "اسم التوكن هو واجهته العامة. نسمّي الدور لا اللون، ونسمّي المكوّن عندما يكون القرار خاصاً به. الاسم يجب أن يبقى ثابتاً عند تغيير الثيم.",
      },
    },

    {
      chapter: 4,
      chapterName: "Design Tokens",
      title: "The token <em>JSON</em>",
      eyebrow: "DTCG format",
      lead: "One format, three files, explicit references. The stable DTCG spec uses $type and $value.",
      body: `
        <div class="grid-3">
          <div class="stack">
            <div class="row row--between"><span class="tag tag--accent">Primitive</span><span class="mono dim" style="font-size:7.5px">primitives.json</span></div>
            ${code(
              "json",
              `
              {
                "color": {
                  "$type": "color",
                  "blue": {
                    "500": { "$value": "#3b82f6" }
                  }
                }
              }
              `,
              "primitives.json",
            )}
          </div>
          <div class="stack">
            <div class="row row--between"><span class="tag tag--cyan">Semantic</span><span class="mono dim" style="font-size:7.5px">semantic.json</span></div>
            ${code(
              "json",
              `
              {
                "color": {
                  "$type": "color",
                  "action": {
                    "primary": {
                      "$value": "{color.blue.500}"
                    }
                  }
                }
              }
              `,
              "semantic.json",
            )}
          </div>
          <div class="stack">
            <div class="row row--between"><span class="tag tag--green">Component</span><span class="mono dim" style="font-size:7.5px">components.json</span></div>
            ${code(
              "json",
              `
              {
                "button": {
                  "primary": {
                    "background": {
                      "$value": "{color.action.primary}"
                    }
                  }
                }
              }
              `,
              "components.json",
            )}
          </div>
        </div>
        <div class="grid-3" style="margin-top:10px">
          <div class="card"><span class="card-kicker">$type</span><p>Inherited by nested tokens. One color type is enough for a whole group.</p></div>
          <div class="card"><span class="card-kicker">$value</span><p>The value itself. Curly braces create an alias to another token.</p></div>
          <div class="card"><span class="card-kicker">$description</span><p>Optional intent. Useful when the name is not enough for a new teammate.</p></div>
        </div>
        <div class="callout callout--green" style="margin-top:8px">
          <span>✓</span>
          <p><strong>DTCG 2025.10 is stable.</strong> Tokens Studio, Style Dictionary, Figma, and other tools support the format.</p>
        </div>
      `,
      notes: {
        say: "This is the DTCG format: $type, $value, and references in curly braces. It is a stable spec, not a proprietary Style Dictionary format.",
        example: "The semantic action.primary token references color.blue.500. The component token references action.primary. Change the primitive and everything downstream follows.",
        detail: "You can use legacy value/type with Style Dictionary, but pick one format per instance. Do not mix DTCG and legacy keys in the same tree.",
        next: "Here is the full architecture those references create.",
        ar: "صيغة DTCG تستخدم $type و $value والمراجع بين الأقواس. الملفات الثلاثة تفصل البدائي عن الدلالي عن المكوّن، والمرجع يربط بينها.",
      },
    },

    {
      chapter: 4,
      chapterName: "Design Tokens",
      title: "The token <em>architecture</em>",
      eyebrow: "One direction",
      lead: "Primitive feeds semantic. Semantic feeds components. Components feed the UI.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">Reference direction</span>
            <div class="graph-v" style="align-items:stretch">
              <div class="node node--accent" style="text-align:center"><strong>Primitive tokens</strong><small>blue.500 · gray.100 · space.4</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="node node--cyan" style="text-align:center"><strong>Semantic tokens</strong><small>color.action.primary · color.text.primary</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="node" style="text-align:center"><strong>Component tokens</strong><small>button.primary.background · input.border.focus</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="node" style="text-align:center"><strong>UI components</strong><small>Button · Input · Dialog</small></div>
            </div>
          </div>

          <div class="stack">
            ${checks([
              "<strong>One direction.</strong> Never primitive → component.",
              "<strong>Theme lives in semantic.</strong> Light and dark resolve the same names.",
              "<strong>Component tokens are optional.</strong> Use them for local precision.",
              "<strong>No raw values in components.</strong> If it is missing, add a token.",
              "<strong>Preview both themes.</strong> Every change must be checked in light and dark.",
            ], "checks--tight")}
            <div class="grid-2" style="margin-top:4px">
              <div class="card">
                <span class="card-kicker">Light</span>
                <code style="font-size:9px;color:var(--accent-2)">action.primary → blue.600</code>
              </div>
              <div class="card">
                <span class="card-kicker">Dark</span>
                <code style="font-size:9px;color:var(--accent-2)">action.primary → blue.400</code>
              </div>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>If you can skip a tier,</strong> the middle tier is not doing its job. Add the semantic meaning first.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The architecture is a dependency chain. Primitives are raw material; semantics give them meaning; component tokens make a local contract; components consume the contract.",
        example: "A Button never imports blue.500. It imports button.primary.background, which points to action.primary, which resolves differently in light and dark.",
        detail: "This is also the test for a new token: if it has no semantic role, it probably belongs in the primitive layer or should not be a token at all.",
        next: "Chapter 5 connects this architecture to Figma and the build.",
        ar: "الاتجاه واحد: البدائي يغذي الدلالي، والدلالي يغذي المكوّن، والمكوّن يغذي الواجهة. لا نقفز من البدائي إلى المكوّن مباشرة.",
      },
    },
  ]);
})();
