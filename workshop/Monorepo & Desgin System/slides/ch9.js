/* Chapter 9 — Final Architecture (slides 64–68) */

(() => {
  const { code, table, bullets, checks, card, pill, metric } = window.D;

  window.D.register([
    {
      chapter: 9,
      chapterName: "Final Architecture",
      layout: "chapter",
      title: "One repository. <em>A complete system.</em>",
      lead: "The final tree is small. The value is in the contracts between the folders.",
      body: `
        <div class="split">
          ${code(
            "bash",
            `
            acme/
            ├── apps/
            │   ├── web/
            │   ├── admin/
            │   └── storybook/
            ├── packages/
            │   ├── tokens/
            │   ├── ui/
            │   ├── utils/
            │   ├── eslint-config/
            │   └── typescript-config/
            ├── .changeset/
            ├── .github/workflows/
            ├── pnpm-workspace.yaml
            ├── turbo.json
            └── package.json
            `,
            "final structure",
          )}
          <div class="stack">
            ${card({
              kicker: "Deployables",
              title: "apps/",
              text: "web, admin, and Storybook. They consume packages and never import each other.",
            })}
            ${card({
              kicker: "Shared capabilities",
              title: "packages/",
              text: "tokens, ui, utils, and configuration. Each has a public API and one owner.",
              className: "card--accent",
            })}
            ${card({
              kicker: "Delivery",
              title: "root + workflows",
              text: "Workspace discovery, task graph, changesets, CI, and release.",
            })}
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>The tree is not the architecture.</strong> The dependency rules and public APIs are.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This is the final tree. It is intentionally small. The architecture is not the number of folders; it is the direction of dependencies and the clarity of each package's API.",
        example: "apps/web and apps/admin consume @acme/ui. @acme/ui consumes tokens, Radix, and utils. Storybook consumes UI. Nothing points back.",
        detail: "Every package in this tree can be built in isolation. That is the test of a healthy monorepo.",
        next: "Here is the entire Figma-to-production pipeline in one diagram.",
        ar: "الشجرة النهائية صغيرة، والقيمة في العقود بين المجلدات: اتجاه الاعتماديات، والواجهة العامة لكل حزمة، وقابلية البناء في عزلة.",
      },
    },

    {
      chapter: 9,
      chapterName: "Final Architecture",
      title: "The complete <em>pipeline</em>",
      eyebrow: "Figma to production",
      lead: "One source of truth, two automated gates, and human approval where intent matters.",
      dense: true,
      body: `
        <div class="split split--wide">
          <div class="pipeline-list">
            <div class="pl-row"><span class="pl-num">01</span><span class="pl-name">Figma</span><span class="pl-meta">design decisions + token sets</span><span class="tag tag--accent">human</span></div>
            <div class="pl-row"><span class="pl-num">02</span><span class="pl-name">Tokens Studio</span><span class="pl-meta">push one JSON file per set</span><span class="tag">sync</span></div>
            <div class="pl-row"><span class="pl-num">03</span><span class="pl-name">GitHub PR</span><span class="pl-meta">review the token diff</span><span class="tag tag--accent">human</span></div>
            <div class="pl-row"><span class="pl-num">04</span><span class="pl-name">CI validation</span><span class="pl-meta">schema · naming · deterministic build</span><span class="tag tag--green">auto</span></div>
            <div class="pl-row"><span class="pl-num">05</span><span class="pl-name">Style Dictionary</span><span class="pl-meta">compile CSS · JS · types</span><span class="tag tag--green">auto</span></div>
            <div class="pl-row"><span class="pl-num">06</span><span class="pl-name">Tokens package</span><span class="pl-meta">variables.css · tailwind.css</span><span class="tag tag--green">artifact</span></div>
            <div class="pl-row"><span class="pl-num">07</span><span class="pl-name">Radix + UI</span><span class="pl-meta">behavior + tokens + component API</span><span class="tag tag--green">auto</span></div>
            <div class="pl-row"><span class="pl-num">08</span><span class="pl-name">Storybook</span><span class="pl-meta">stories · controls · MDX · a11y</span><span class="tag tag--green">auto</span></div>
            <div class="pl-row"><span class="pl-num">09</span><span class="pl-name">Chromatic</span><span class="pl-meta">visual diffs · review · baseline</span><span class="tag tag--amber">review</span></div>
            <div class="pl-row"><span class="pl-num">10</span><span class="pl-name">Apps</span><span class="pl-meta">web · admin · production</span><span class="tag tag--green">ship</span></div>
          </div>
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">Artifacts</span>
              <p><code>variables.css</code>, <code>tailwind.css</code>, <code>tokens.js</code>, <code>tokens.d.ts</code>, <code>ui/dist</code>, <code>storybook-static</code>.</p>
            </div>
            <div class="card card--good">
              <span class="card-kicker">Automated gates</span>
              <p>JSON schema, naming lint, deterministic build, TypeScript, unit tests, accessibility, Chromatic snapshots.</p>
            </div>
            <div class="card card--warn">
              <span class="card-kicker">Human gates</span>
              <p>Design intent, semantic naming, PR review, visual change approval, release decision.</p>
            </div>
            <div class="callout">
              <span>→</span>
              <p><strong>The pipeline is the product.</strong> If a step is missing, the source of truth is not really connected.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This is the complete pipeline: design, sync, review, validate, build, consume, test, release. Every stage has an owner and an artifact.",
        example: "A semantic color change starts in Figma, becomes JSON, passes CI, compiles to CSS, updates the UI, appears in Storybook, and is reviewed in Chromatic before release.",
        detail: "Do not optimize the diagram; optimize the gates. A fast pipeline that ships broken tokens is worse than a slow one that blocks them.",
        next: "What did we actually build, in measurable terms?",
        ar: "الخط الكامل من Figma إلى التطبيق. كل مرحلة لها مالك ومخرج. لا تحسّن الرسم، حسّن البوابات التي تمنع الأخطاء.",
      },
    },

    {
      chapter: 9,
      chapterName: "Final Architecture",
      title: "What we have <em>built</em>",
      eyebrow: "Outcome",
      lead: "A system that is small enough to understand and strong enough to extend.",
      body: `
        <div class="metrics metrics--4">
          ${metric("2 + 1", "applications", "web · admin · Storybook")}
          ${metric("4", "shared packages", "tokens · ui · utils · config")}
          ${metric("3", "token tiers", "primitive · semantic · component")}
          ${metric("1", "pipeline", "Figma → CI → production")}
        </div>
        <div class="grid-3" style="margin-top:12px">
          ${card({
            kicker: "Architecture",
            title: "Clear boundaries",
            text: "Apps deploy. Packages share. Dependencies point one way.",
            className: "card--accent",
          })}
          ${card({
            kicker: "Design",
            title: "One source of truth",
            text: "Figma tokens, semantic roles, and component contracts.",
          })}
          ${card({
            kicker: "Quality",
            title: "Evidence at every gate",
            text: "Types, tests, accessibility, visual snapshots, and review.",
          })}
          ${card({
            kicker: "Velocity",
            title: "Fast feedback",
            text: "Task graph, cache, filters, and a single install.",
          })}
          ${card({
            kicker: "Adoption",
            title: "Docs where people work",
            text: "Storybook stories, MDX guidance, and copy-ready examples.",
          })}
          ${card({
            kicker: "Sustainability",
            title: "A release process",
            text: "Changesets, versioning, CI, and a clear owner.",
          })}
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>The result:</strong> a new app starts from the system, not from a blank folder.</p>
        </div>
      `,
      notes: {
        say: "This is the outcome in six dimensions: architecture, design, quality, velocity, adoption, and sustainability. A design system is healthy when all six are present.",
        example: "A new app can install @acme/ui, import the stylesheet, and get tokens, components, accessibility, and docs on day one.",
        detail: "The numbers are intentionally modest. The value is not the number of packages; it is the reduction in repeated decisions.",
        next: "Before we close, here are the practices that keep it healthy.",
        ar: "الناتج ستة أبعاد: المعمار، التصميم، الجودة، السرعة، التبني، والاستدامة. النظام الصحي يحتاجها كلها، وليس المكونات فقط.",
      },
    },

    {
      chapter: 9,
      chapterName: "Final Architecture",
      title: "Nine practices to <em>keep it healthy</em>",
      eyebrow: "Engineering best practices",
      lead: "The system decays when the rules are implicit. Make them explicit and automated.",
      body: `
        <div class="grid-3">
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">Architecture · 01</span>
              <h3>Clear package boundaries</h3>
              <p>Public exports, no deep imports, no app-to-app dependencies.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Architecture · 02</span>
              <h3>One toolchain baseline</h3>
              <p>Pin Node, pnpm, TypeScript, ESLint, and Prettier.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Architecture · 03</span>
              <h3>Ownership is explicit</h3>
              <p>CODEOWNERS, package owners, and a contribution path.</p>
            </div>
          </div>
          <div class="stack">
            <div class="card">
              <span class="card-kicker">Tokens · 04</span>
              <h3>Semantic naming</h3>
              <p>Name the role, not the value. Keep mode out of names.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Tokens · 05</span>
              <h3>One reference direction</h3>
              <p>Primitive → semantic → component. Never skip a tier.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Tokens · 06</span>
              <h3>Validate in CI</h3>
              <p>Schema, naming, deterministic build, and both themes.</p>
            </div>
          </div>
          <div class="stack">
            <div class="card">
              <span class="card-kicker">Quality · 07</span>
              <h3>Test behavior + accessibility</h3>
              <p>Unit tests, keyboard tests, axe, and real stories.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Quality · 08</span>
              <h3>Review visual change</h3>
              <p>Chromatic diffs are approved by a person, not by default.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Quality · 09</span>
              <h3>Review AI output</h3>
              <p>Context, acceptance criteria, diff review, and ownership.</p>
            </div>
          </div>
        </div>
        <div class="callout callout--amber" style="margin-top:12px">
          <span>!</span>
          <p><strong>Automate the rule, not the intention.</strong> Lint what can be linted; review what requires judgment.</p>
        </div>
      `,
      notes: {
        say: "Nine practices, three groups: architecture, tokens, and quality. They are intentionally concrete enough to become checks.",
        example: "A naming lint catches darkText. A CI build catches broken references. Chromatic catches a 3px shift. CODEOWNERS catches the wrong reviewer.",
        detail: "Do not automate taste. Automate invariants: naming, boundaries, build determinism, accessibility, and visual regressions.",
        next: "Let's close with questions and the reference links.",
        ar: "تسع ممارسات في ثلاث مجموعات: المعمار، التوكنز، والجودة. حوّل ما يمكن التحقق منه آلياً إلى فحوصات، واترك الحكم البشري لما يحتاج ذوقاً وسياقاً.",
      },
    },

    {
      chapter: 9,
      chapterName: "Final Architecture",
      layout: "qa",
      title: "Questions & Discussion",
      body: `
        <div class="qa-layout">
          <div>
            <div class="eyebrow">Thank you</div>
            <h2 class="qa-title">Questions<span>?</span></h2>
            <p class="qa-lead">From design decisions to production-ready components.</p>
            <p class="qa-note">
              Try the pipeline locally: change a token, watch the CSS rebuild, open Storybook,
              and review the visual diff.
            </p>
            <div class="qa-actions">
              <div class="qa-card"><span>Run it</span>pnpm install &amp;&amp; pnpm dev</div>
              <div class="qa-card"><span>Build it</span>pnpm tokens</div>
              <div class="qa-card"><span>Ship it</span>pnpm changeset</div>
            </div>
            <div class="qa-note" style="margin-top:18px">
              <strong style="color:var(--ink)">Presenter:</strong> [Your name] ·
              <span class="mono">[email / GitHub]</span>
            </div>
          </div>

          <div class="refs">
            <div class="refs-head">
              <h3>References &amp; further reading</h3>
              <span>official docs</span>
            </div>
            <div class="refs-list">
              <a href="https://turborepo.dev/docs" target="_blank" rel="noreferrer">Turborepo docs<span>turborepo.dev/docs</span></a>
              <a href="https://turborepo.dev/docs/reference/configuration" target="_blank" rel="noreferrer">turbo.json reference<span>configuration</span></a>
              <a href="https://pnpm.io/workspaces" target="_blank" rel="noreferrer">pnpm workspaces<span>pnpm.io/workspaces</span></a>
              <a href="https://styledictionary.com/" target="_blank" rel="noreferrer">Style Dictionary<span>styledictionary.com</span></a>
              <a href="https://www.designtokens.org/tr/2025.10/" target="_blank" rel="noreferrer">DTCG specification<span>2025.10 stable</span></a>
              <a href="https://docs.tokens.studio/" target="_blank" rel="noreferrer">Tokens Studio docs<span>docs.tokens.studio</span></a>
              <a href="https://tailwindcss.com/docs/theme" target="_blank" rel="noreferrer">Tailwind theme variables<span>v4 @theme</span></a>
              <a href="https://www.radix-ui.com/primitives/docs/components/dialog" target="_blank" rel="noreferrer">Radix Dialog<span>primitives</span></a>
              <a href="https://storybook.js.org/docs/writing-stories" target="_blank" rel="noreferrer">Storybook stories<span>CSF 3</span></a>
              <a href="https://storybook.js.org/docs/writing-docs/mdx" target="_blank" rel="noreferrer">Storybook MDX<span>docs blocks</span></a>
              <a href="https://www.chromatic.com/docs/" target="_blank" rel="noreferrer">Chromatic docs<span>visual tests</span></a>
              <a href="https://www.chromatic.com/docs/github-actions/" target="_blank" rel="noreferrer">Chromatic + GitHub Actions<span>CI workflow</span></a>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Open the floor. If the room is quiet, ask which boundary is hardest to maintain in their current repository, or which token naming decision causes the most debate.",
        example: "A good closing demo is changing one token, watching the CSS rebuild, and reviewing the visual diff in Chromatic.",
        detail: "The references slide uses official documentation only. Verify versions before copying any configuration into a new repository.",
        next: "Thank the audience and share the repository link.",
        ar: "شكراً. اترك النقاش مفتوحاً، واسأل الحضور عن أصعب حد معماري أو قرار تسمية توكن في مؤسستهم. المرجع النهائي هو الوثائق الرسمية.",
      },
    },
  ]);
})();
