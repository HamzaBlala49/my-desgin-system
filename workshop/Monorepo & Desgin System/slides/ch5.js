/* Chapter 5 — Figma to Code Pipeline (slides 34–41) */

(() => {
  const { code, flow, bullets, checks, card, pill } = window.D;

  window.D.register([
    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      layout: "chapter",
      title: "Figma is the source. <em>Git is the record.</em>",
      lead: "Tokens Studio turns design decisions into reviewable JSON, not screenshots and Slack messages.",
      body: `
        <div class="grid-2">
          ${card({
            kicker: "01 · Capture",
            title: "Token sets in Figma",
            text: "Primitives, semantic roles, and component decisions live as named token sets.",
            className: "card--accent",
          })}
          ${card({
            kicker: "02 · Organize",
            title: "Themes and references",
            text: "Light, dark, and brand themes resolve the same semantic names.",
          })}
          ${card({
            kicker: "03 · Sync",
            title: "Git as the record",
            text: "Push one JSON file per set. Pull only to bootstrap or switch branches.",
          })}
          ${card({
            kicker: "04 · Standardize",
            title: "DTCG or legacy",
            text: "Use $type/$value for the stable spec, or the legacy value/type format consistently.",
          })}
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>The direction is Figma → Git → code.</strong> In the normal flow, nobody edits generated CSS by hand.</p>
        </div>
      `,
      notes: {
        say: "Tokens Studio is the bridge between Figma and Git. Designers work in Figma; the plugin writes structured JSON; the repository records and reviews it.",
        example: "The reference repository stores one JSON file per set under packages/tokens/tokens, with $metadata.json defining the set order.",
        detail: "Folder sync is a Tokens Studio Pro feature. On the free plan, you can import the set files manually, but the build still consumes the same JSON.",
        next: "Here is the full workflow from a design edit to a merged pull request.",
        ar: "Figma هو مصدر القرار، وGit هو السجل القابل للمراجعة. Tokens Studio يكتب ملفات JSON منظمة، والبناء يقرأها ولا يعتمد على لقطة شاشة.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "From a design edit to a <em>merged PR</em>",
      eyebrow: "Workflow",
      lead: "Five steps, three owners, two automated gates.",
      body: `
        ${flow([
          { num: "01", title: "Edit in Figma", text: "Change a token value or add a semantic role.", foot: "designer" },
          { num: "02", title: "Push JSON", text: "Tokens Studio writes one file per set.", foot: "sync" },
          { num: "03", title: "Open a PR", text: "Review the JSON diff like code.", foot: "designer + engineer" },
          { num: "04", title: "Validate", text: "Schema, naming, and build checks.", foot: "CI" },
          { num: "05", title: "Build + merge", text: "CSS, JS, types, and Storybook preview.", foot: "automation" },
        ])}
        <div class="grid-2" style="margin-top:14px">
          <div class="card card--good">
            <span class="card-kicker">Push · normal direction</span>
            <h3>Figma → Git</h3>
            <p>Design changes become a reviewable pull request. This is the daily workflow.</p>
          </div>
          <div class="card card--warn">
            <span class="card-kicker">Pull · bootstrap direction</span>
            <h3>Git → Figma</h3>
            <p>Load existing token files into Figma, or switch to a branch. Not the production path.</p>
          </div>
        </div>
        <div class="callout" style="margin-top:10px">
          <span>→</span>
          <p><strong>Human approval happens at the PR.</strong> Automation validates the contract; a person approves the design decision.</p>
        </div>
      `,
      notes: {
        say: "This is the workflow to teach the team. Designers push; everyone reviews the JSON diff; CI validates; merge triggers the build.",
        example: "A button radius change is four lines in component/button.json. The PR shows the diff, the build regenerates variables.css, and Storybook previews the result.",
        detail: "Do not let Tokens Studio push directly to main. Use a branch and a PR so the token contract is reviewed.",
        next: "Let's look at the package that receives these files.",
        ar: "المسار اليومي هو Push من Figma إلى Git، ثم Pull Request ومراجعة، ثم CI، ثم دمج وبناء. Pull يُستخدم فقط لتحميل الملفات أو تبديل فرع.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "The <em>tokens package</em>",
      eyebrow: "Package structure",
      lead: "A small package with one responsibility: turn source JSON into consumable artifacts.",
      body: `
        <div class="split split--wide">
          ${code(
            "bash",
            `
            packages/tokens/
            ├── tokens/
            │   ├── primitives.json
            │   ├── semantic.json
            │   └── components.json
            ├── src/
            │   └── index.ts
            ├── dist/
            ├── style-dictionary.config.mjs
            ├── package.json
            └── tsconfig.json
            `,
            "packages/tokens/",
          )}
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">tokens/</span>
              <h3>Source of truth</h3>
              <p>Written by Tokens Studio or imported manually. Reviewed like code.</p>
            </div>
            <div class="card">
              <span class="card-kicker">src/</span>
              <h3>Optional utilities</h3>
              <p>Typed helpers for reading tokens in JavaScript. Keep it small.</p>
            </div>
            <div class="card">
              <span class="card-kicker">dist/</span>
              <h3>Generated output</h3>
              <p>CSS variables, Tailwind theme, JS, and declarations. Never edit by hand.</p>
            </div>
            <div class="card">
              <span class="card-kicker">config</span>
              <h3>The build contract</h3>
              <p>Style Dictionary reads the source and writes each platform output.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The tokens package has one job: compile source JSON into artifacts. Keep the source, the build config, and the generated output clearly separated.",
        example: "The reference repository has tokens/primitives, tokens/semantic, and tokens/component directories, plus a build.mjs and a dist folder with variables.css and tailwind.css.",
        detail: "Add dist/ to .gitignore if you build in CI, or commit it if consumers install the package without a build step. Pick one policy and document it.",
        next: "The compiler in the middle is Style Dictionary.",
        ar: "حزمة التوكنز مسؤوليتها واحدة: تحويل JSON إلى مخرجات قابلة للاستهلاك. المصدر في tokens، والبناء في config، والمخرجات في dist.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "Style Dictionary is a <em>compiler</em>",
      eyebrow: "The build engine",
      lead: "It transforms one token source into CSS, JavaScript, SCSS, iOS, Android, and more.",
      body: `
        <div class="split">
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">Definition</span>
              <h3 style="font-size:22px;line-height:1.1">Tokens in. Platform artifacts out.</h3>
              <p>Style Dictionary applies transforms and formats to the same token tree for each platform.</p>
            </div>
            ${checks([
              "<strong>Transforms</strong> — color, dimension, name, and custom values.",
              "<strong>Platforms</strong> — web, iOS, Android, or anything you define.",
              "<strong>Formats</strong> — CSS variables, SCSS, JS, JSON, XML.",
              "<strong>References</strong> — aliases can stay aliases in the output.",
            ], "checks--tight")}
          </div>
          <div class="grid-2" style="gap:9px">
            ${card({ kicker: "Output 01", title: "CSS variables", text: "The runtime theme layer for web." })}
            ${card({ kicker: "Output 02", title: "JavaScript", text: "Tokens for JS-driven styles and charts." })}
            ${card({ kicker: "Output 03", title: "SCSS", text: "For teams still compiling Sass." })}
            ${card({ kicker: "Output 04", title: "Native", text: "iOS and Android resources when needed." })}
          </div>
        </div>
        <div class="callout callout--amber" style="margin-top:12px">
          <span>!</span>
          <p><strong>Style Dictionary does not design tokens.</strong> It compiles the decisions you already made.</p>
        </div>
      `,
      notes: {
        say: "Style Dictionary is the compiler. It does not decide what a token means; it applies the configured transforms and formats for each platform.",
        example: "The same color token can become a CSS custom property, a JS export, and an Android color resource.",
        detail: "The reference repository uses Style Dictionary v5 with @tokens-studio/sd-transforms. The configuration shape is close to v4; use the migration guide when upgrading custom transforms.",
        next: "Here is the pipeline shape: parse, merge, transform, format.",
        ar: "Style Dictionary هو المترجم: يأخذ شجرة التوكنز ويحوّلها إلى CSS وJavaScript وSCSS وصيغ المنصات الأخرى. لا يقرر المعنى، بل ينفّذ البناء.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "The build <em>pipeline</em>",
      eyebrow: "Style Dictionary",
      lead: "One source tree. Many outputs. Every output is generated.",
      body: `
        ${flow([
          { num: "01", title: "Read tokens", text: "JSON, JSONC, or ESM files." },
          { num: "02", title: "Parse + merge", text: "Deep merge all source files." },
          { num: "03", title: "Transform", text: "Colors, sizes, names, references." },
          { num: "04", title: "Format", text: "CSS, JS, SCSS, native." },
          { num: "05", title: "Write", text: "Artifacts into dist/." },
        ])}
        <div class="grid-4" style="margin-top:14px">
          ${card({ kicker: "Web", title: "variables.css", text: ":root and [data-theme=\"dark\"] custom properties." })}
          ${card({ kicker: "Tailwind", title: "theme.css", text: "@theme inline mappings to the generated variables." })}
          ${card({ kicker: "JavaScript", title: "tokens.js", text: "Named exports for JS consumers and charts." })}
          ${card({ kicker: "Types", title: "tokens.d.ts", text: "Typed token paths for autocomplete." })}
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>One source, many targets.</strong> Add a platform without changing the design source.</p>
        </div>
      `,
      notes: {
        say: "The pipeline is boring on purpose: read, merge, transform, format, write. Boring builds are reproducible builds.",
        example: "The reference build emits variables.css, tailwind.css, tokens.json, tokens.mjs, tokens.cjs, and tokens.d.ts from the same source.",
        detail: "Transform order matters. Name transforms run before formats; references must resolve before output.",
        next: "Let's write the actual Style Dictionary configuration.",
        ar: "خط البناء بسيط ومتكرر: قراءة، دمج، تحويل، تنسيق، كتابة. البساطة هنا ميزة لأنها تجعل الناتج قابلاً للتكرار.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "A working <em>Style Dictionary</em> config",
      eyebrow: "Build tokens",
      lead: "One CSS platform and one JS platform are enough to start.",
      body: `
        <div class="split split--wide">
          ${code(
            "js",
            `
            import StyleDictionary from "style-dictionary";

            export default {
              source: ["tokens/**/*.json"],
              platforms: {
                css: {
                  transformGroup: "css",
                  buildPath: "dist/",
                  files: [{
                    destination: "variables.css",
                    format: "css/variables",
                    options: {
                      selector: ":root",
                      outputReferences: true
                    }
                  }]
                },
                js: {
                  transformGroup: "js",
                  buildPath: "dist/",
                  files: [{
                    destination: "tokens.js",
                    format: "javascript/es6"
                  }]
                }
              }
            };
            `,
            "style-dictionary.config.mjs",
          )}
          <div class="stack">
            <span class="mini-label">Generated · dist/variables.css</span>
            ${code(
              "css",
              `
              :root {
                --color-blue-500: #3b82f6;
                --color-action-primary: var(--color-blue-500);
                --button-primary-background: var(--color-action-primary);
              }
              `,
              "dist/variables.css",
            )}
            <div class="card">
              <span class="card-kicker">Command</span>
              <code style="font-size:9px;color:var(--accent-2)">pnpm --filter @acme/tokens build</code>
              <p>Use <code>outputReferences: true</code> so aliases stay aliases in CSS.</p>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Version note:</strong> this is valid v4/v5 ESM shape. If you customize transforms, follow the version’s migration guide.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This is a minimal but real configuration. The CSS platform writes :root variables, and outputReferences preserves aliases instead of flattening every value.",
        example: "The semantic token color.action.primary becomes var(--color-blue-500) in CSS, so changing the primitive updates the semantic output automatically.",
        detail: "Style Dictionary v4 and v5 share the ESM configuration shape. The reference repo uses v5 with Tokens Studio transforms; check the migration notes before copying custom transforms.",
        next: "Now let's connect those variables to Tailwind.",
        ar: "الإعداد يحدد المصدر والمنصات. outputReferences يحافظ على المراجع بين المتغيرات، بدل تحويل كل قيمة إلى لون ثابت.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "Tailwind: <em>v3 vs. v4</em>",
      eyebrow: "Integration",
      lead: "The token output is the same. The way you register it changed.",
      body: `
        <div class="grid-2">
          <div class="stack">
            <div class="row row--between"><span class="tag tag--accent">Tailwind v4</span><span class="mono dim" style="font-size:8px">CSS-first</span></div>
            ${code(
              "css",
              `
              @import "tailwindcss";
              @import "@acme/tokens/variables.css";

              @theme inline {
                --color-action-primary: var(--ds-color-action-primary);
                --color-surface-raised: var(--ds-color-surface-raised);
                --radius-md: var(--ds-radius-md);
              }
              `,
              "app.css",
            )}
            <div class="callout callout--green">
              <span>✓</span>
              <p>Use <code>@theme inline</code> when the theme value references another CSS variable.</p>
            </div>
          </div>
          <div class="stack">
            <div class="row row--between"><span class="tag tag--cyan">Tailwind v3</span><span class="mono dim" style="font-size:8px">JS config</span></div>
            ${code(
              "js",
              `
              export default {
                theme: {
                  extend: {
                    colors: {
                      action: {
                        primary: "var(--ds-color-action-primary)"
                      }
                    },
                    borderRadius: {
                      md: "var(--ds-radius-md)"
                    }
                  }
                }
              };
              `,
              "tailwind.config.js",
            )}
            <div class="callout callout--amber">
              <span>!</span>
              <p>Do not mix the two syntaxes in one project. Pick the version and stay consistent.</p>
            </div>
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>Usage is the same:</strong> <code>bg-action-primary</code>, <code>text-action-primary-foreground</code>, <code>rounded-md</code>.</p>
        </div>
      `,
      notes: {
        say: "Tailwind v4 is CSS-first: @theme variables create utilities. Tailwind v3 uses the JavaScript config. The token pipeline does not change.",
        example: "In v4, --color-action-primary creates bg-action-primary. In v3, theme.extend.colors.action.primary creates the same utility name.",
        detail: "@theme inline is important when the value is var(--ds-color-action-primary); without inline, the utility may resolve the variable in the wrong scope.",
        next: "Here is the complete pipeline, including where humans and automation act.",
        ar: "Tailwind v4 يستخدم @theme داخل CSS، بينما v3 يستخدم ملف إعداد JavaScript. لا تخلط الصيغتين، لكن مصدر التوكنز واحد.",
      },
    },

    {
      chapter: 5,
      chapterName: "Figma to Code Pipeline",
      title: "The complete <em>token pipeline</em>",
      eyebrow: "End to end",
      lead: "From a Figma edit to a production artifact, with clear ownership at every gate.",
      body: `
        <div class="split split--wide">
          <div class="vflow">
            <div class="vstep"><span class="vstep-num">01</span><div class="vstep-body"><strong>Edit in Figma</strong><span>Token sets, themes, variants</span></div><span class="vstep-tag">human</span></div>
            <div class="vstep"><span class="vstep-num">02</span><div class="vstep-body"><strong>Push with Tokens Studio</strong><span>One JSON file per set</span></div><span class="vstep-tag">sync</span></div>
            <div class="vstep"><span class="vstep-num">03</span><div class="vstep-body"><strong>Review the pull request</strong><span>Diff, naming, intent</span></div><span class="vstep-tag">human</span></div>
            <div class="vstep"><span class="vstep-num">04</span><div class="vstep-body"><strong>Validate in CI</strong><span>Schema, naming, deterministic build</span></div><span class="vstep-tag">auto</span></div>
            <div class="vstep"><span class="vstep-num">05</span><div class="vstep-body"><strong>Build with Style Dictionary</strong><span>CSS, JS, types</span></div><span class="vstep-tag">auto</span></div>
            <div class="vstep"><span class="vstep-num">06</span><div class="vstep-body"><strong>Consume in UI + apps</strong><span>Tailwind utilities, components, Storybook</span></div><span class="vstep-tag">auto</span></div>
            <div class="vstep"><span class="vstep-num">07</span><div class="vstep-body"><strong>Visual review + release</strong><span>Chromatic, changeset, publish</span></div><span class="vstep-tag">human</span></div>
          </div>
          <div class="stack">
            <div class="card card--good">
              <span class="card-kicker">Automated</span>
              <p>Validation, build, artifact generation, Storybook preview, visual snapshots.</p>
            </div>
            <div class="card card--warn">
              <span class="card-kicker">Human</span>
              <p>Design intent, token naming, PR review, and approval of visual changes.</p>
            </div>
            <div class="card card--accent">
              <span class="card-kicker">Blocking gates</span>
              <p>Invalid JSON, broken references, naming violations, failed build, or unreviewed visual changes.</p>
            </div>
            <div class="callout">
              <span>→</span>
              <p><strong>The pipeline is the product.</strong> A token is only real when it reaches a component and a test.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This is the full loop. Automation handles validation and artifact generation; humans own intent, naming, and visual approval.",
        example: "A semantic token change is reviewed in a PR, validated in CI, built into CSS, consumed by UI, and snapshotted in Chromatic before release.",
        detail: "Make the gates explicit. If a step can fail silently, it will. A token pipeline without validation is just a file copy.",
        next: "Chapter 6 builds the UI package that consumes these artifacts.",
        ar: "خط الإنتاج كامل من Figma إلى التطبيق. الإنسان يملك القرار والمراجعة، والآلة تنفّذ التحقق والبناء والاختبارات البصرية.",
      },
    },
  ]);
})();
