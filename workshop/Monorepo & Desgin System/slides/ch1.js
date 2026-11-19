/* Chapter 1 — Introduction to Monorepo (slides 1–8) */

(() => {
  const { code, table, flow, bullets, checks, crosses, card, pill, metric } = window.D;

  window.D.register([
    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      layout: "hero",
      title: "Monorepo & Design System",
      body: `
        <div class="hero-orbit" aria-hidden="true"></div>
        <div class="hero-layout">
          <div class="hero-copy">
            <div class="hero-kicker">Technical workshop · React / TypeScript / Turborepo</div>
            <h1 class="hero-title">Monorepo<br /><em>&amp;</em> Design<br />System</h1>
            <div class="hero-sub">From Architecture to Production</div>
            <p class="hero-lead">
              Build one repository, one token pipeline, and one component system that ships with confidence.
            </p>
            <div class="hero-meta">
              <span class="pill pill--accent">pnpm</span>
              <span class="pill">Turborepo</span>
              <span class="pill">Style Dictionary</span>
              <span class="pill">Radix UI</span>
              <span class="pill">Storybook</span>
              <span class="pill">Chromatic</span>
            </div>
            <div class="hero-presenter">
              <span class="hero-avatar">YN</span>
              <div>
                <strong>Presenter: [Your name]</strong>
                <small>Senior Frontend / Design Systems Engineer</small>
              </div>
            </div>
          </div>

          <div class="hero-stack" aria-label="Workshop architecture overview">
            <div class="hero-node hero-node--accent">
              <span class="hero-node-icon">Fg</span>
              <div class="hero-node-body"><strong>Figma</strong><span>Design decisions and token sets</span></div>
              <span class="hero-node-tag">source</span>
            </div>
            <div class="hero-node">
              <span class="hero-node-icon">TS</span>
              <div class="hero-node-body"><strong>Tokens Studio</strong><span>Push one JSON file per set</span></div>
              <span class="hero-node-tag">sync</span>
            </div>
            <div class="hero-node">
              <span class="hero-node-icon">GH</span>
              <div class="hero-node-body"><strong>GitHub</strong><span>Review, validate, and version</span></div>
              <span class="hero-node-tag">record</span>
            </div>
            <div class="hero-node">
              <span class="hero-node-icon">SD</span>
              <div class="hero-node-body"><strong>Style Dictionary</strong><span>CSS variables, JS, and types</span></div>
              <span class="hero-node-tag">build</span>
            </div>
            <div class="hero-node hero-node--accent">
              <span class="hero-node-icon">UI</span>
              <div class="hero-node-body"><strong>UI + Apps</strong><span>React components, Storybook, production</span></div>
              <span class="hero-node-tag">ship</span>
            </div>
            <div class="hero-terminal">
              <div><span class="term-prompt">$</span> pnpm turbo run build</div>
              <div class="term-ok">✓ 5 tasks · cache hit</div>
              <div><span class="term-fast">FULL TURBO</span> · 312ms</div>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Welcome. This workshop connects two things that are usually taught separately: how to run a monorepo, and how to build a production design system. The thread is simple: the repository is the delivery mechanism, and tokens are the contract.",
        example: "Use the reference repo: apps/docs, apps/playground, packages/tokens, packages/ui, plus shared ESLint and TypeScript configs.",
        detail: "The workshop uses @acme as a generic package scope. Replace it with your organization scope, such as @repo in the reference repository.",
        next: "First, let's agree on what we are building and why the current multi-repo setup hurts.",
        ar: "في هذه الورشة نبني نظاماً كاملاً: مستودعاً واحداً يحتوي عدة تطبيقات وحزم، ثم نظام تصميم مبني على التوكنز. الهدف ليس شرح الأدوات فقط، بل بناء خط إنتاج كامل من Figma إلى التطبيق.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "One workshop. <em>A complete system.</em>",
      eyebrow: "What you will build",
      lead: "We move from an empty repository to a production-ready pipeline — step by step.",
      body: `
        <div style="margin-bottom:12px">
          ${flow([
            { num: "01", title: "Repository", text: "pnpm workspaces + Turborepo" },
            { num: "02", title: "Tokens", text: "Figma → JSON → CSS" },
            { num: "03", title: "Components", text: "React + Radix + tokens" },
            { num: "04", title: "Production", text: "Storybook + Chromatic + CI" },
          ])}
        </div>
        <div class="grid-4">
          ${card({ kicker: "01 · Repository", title: "Monorepo architecture", text: "pnpm workspaces and Turborepo orchestration." })}
          ${card({ kicker: "02 · Shared code", title: "Packages", text: "UI, tokens, utilities, ESLint, and TypeScript configs." })}
          ${card({ kicker: "03 · Tokens", title: "Token pipeline", text: "Figma → Tokens Studio → JSON → CSS variables." })}
          ${card({ kicker: "04 · Components", title: "Design system UI", text: "Typed React components built on Radix primitives." })}
        </div>
        <div class="grid-3" style="margin-top:12px">
          ${card({ kicker: "05 · Documentation", title: "Storybook", text: "Stories, controls, MDX, and accessibility checks." })}
          ${card({ kicker: "06 · Quality", title: "Chromatic", text: "Visual regression tests and pull-request reviews." })}
          ${card({ kicker: "07 · Leverage", title: "AI workflow", text: "Copy-ready prompts with a human validation gate." })}
        </div>
        <div class="callout" style="margin-top:14px">
          <span>◎</span>
          <p><strong>End state:</strong> you can trace one design decision from a Figma variable to a shipped component, with tests and review at every step.</p>
        </div>
      `,
      notes: {
        say: "These are the seven deliverables. Notice that they form a chain, not a checklist: the repo enables the packages, the packages carry the tokens, and the tokens make the components themeable.",
        example: "The reference repository already ends with 26 token set files, 9 components, Storybook, and 27 behavior and accessibility tests.",
        detail: "The AI section is last because it depends on a clear architecture. AI is useful when the contract is explicit; it is dangerous when the contract is vague.",
        next: "Let's start with the pain that makes this architecture necessary.",
        ar: "مخرجات الورشة سبع طبقات مترابطة: المستودع، الحزم، التوكنز، المكونات، التوثيق، الاختبارات البصرية، ثم مساعد الذكاء الاصطناعي. كل طبقة تعتمد على التي قبلها.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "The multi-repo <em>tax</em>",
      eyebrow: "The problem",
      lead: "Every repository adds a coordination cost. The bill arrives when the design changes.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">Today: four repositories, four sources of truth</span>
            <div class="grid-2">
              <div class="card card--bad">
                <span class="card-kicker">company-web</span>
                <h3 style="font-family:var(--font-mono);font-size:12px">ui v0.4</h3>
                <p>Button: blue, 8px radius</p>
              </div>
              <div class="card card--bad">
                <span class="card-kicker">company-admin</span>
                <h3 style="font-family:var(--font-mono);font-size:12px">ui v0.7</h3>
                <p>Button: indigo, 4px radius</p>
              </div>
              <div class="card card--bad">
                <span class="card-kicker">company-ui</span>
                <h3 style="font-family:var(--font-mono);font-size:12px">tokens v0.3</h3>
                <p>Color names differ</p>
              </div>
              <div class="card card--bad">
                <span class="card-kicker">company-utils</span>
                <h3 style="font-family:var(--font-mono);font-size:12px">shared v1.2</h3>
                <p>Copy-pasted helpers</p>
              </div>
            </div>
            <div class="mismatch">v0.4 ≠ v0.7 ≠ v0.3</div>
          </div>

          <div class="stack">
            <div class="card">
              <div class="card-title-row"><span class="num">01</span><h3>Duplicated code</h3></div>
              <p>Every app owns a slightly different Button, Modal, and validation helper.</p>
            </div>
            <div class="card">
              <div class="card-title-row"><span class="num">02</span><h3>Inconsistent UI</h3></div>
              <p>Designers approve one component; users see four versions of it.</p>
            </div>
            <div class="card">
              <div class="card-title-row"><span class="num">03</span><h3>Dependency drift</h3></div>
              <p>React, Radix, and token versions move independently.</p>
            </div>
            <div class="card">
              <div class="card-title-row"><span class="num">04</span><h3>Cross-project changes</h3></div>
              <p>One token change becomes five pull requests and five releases.</p>
            </div>
          </div>
        </div>
        <div class="callout callout--rose" style="margin-top:12px">
          <span>!</span>
          <p><strong>The problem is not code.</strong> It is coordination between code that must change together.</p>
        </div>
      `,
      notes: {
        say: "Ask the room: who has waited for a token change to land in five repositories? That wait is the real cost. The duplication is visible, but the coordination is the expensive part.",
        example: "A focus-ring change touches tokens, UI, docs, tests, and two apps. In a polyrepo that is five PRs; in a monorepo it is one atomic change.",
        detail: "Be precise: a monorepo does not automatically remove duplication. It makes duplication visible and makes the correct change cheaper.",
        next: "So what exactly is a monorepo? And what is it not?",
        ar: "المشكلة الحقيقية ليست تكرار الكود فقط، بل تنسيق التغيير بين عدة مستودعات. تغيير لون أو حدود زر واحد قد يتحول إلى خمسة Pull Requests وخمسة إصدارات.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "One repository. <em>Many applications.</em>",
      eyebrow: "Definition",
      lead: "A monorepo is a repository strategy, not a single build or a single package.",
      body: `
        <div class="split">
          <div class="stack">
            <span class="tag tag--rose">Before · polyrepo</span>
            ${code(
              "bash",
              `
              company-web/
              company-admin/
              company-ui/
              company-utils/
              `,
              "four repositories",
            )}
          </div>
          <div class="stack">
            <span class="tag tag--green">After · monorepo</span>
            ${code(
              "bash",
              `
              company/
              ├── apps/
              │   ├── web/
              │   └── admin/
              ├── packages/
              │   ├── ui/
              │   ├── tokens/
              │   └── utils/
              ├── pnpm-workspace.yaml
              └── turbo.json
              `,
              "one repository",
            )}
          </div>
        </div>

        <div class="grid-3" style="margin-top:14px">
          <div class="card card--accent">
            <span class="card-kicker">Principle 01</span>
            <h3>One git history</h3>
            <p>One commit can contain a token change, a component change, and a story update.</p>
          </div>
          <div class="card">
            <span class="card-kicker">Principle 02</span>
            <h3>Many deployables</h3>
            <p>Each app still builds, tests, and deploys independently.</p>
          </div>
          <div class="card">
            <span class="card-kicker">Principle 03</span>
            <h3>Explicit boundaries</h3>
            <p>Packages have names, owners, public APIs, and dependency rules.</p>
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>One repository does not mean one application.</strong> It means one history with many deployable units.</p>
        </div>
      `,
      notes: {
        say: "A monorepo is one repository with many independently deployable packages and applications. It is not a single package, and it is not a single deployment.",
        example: "The reference repository has apps/docs and apps/playground deploying separately, while packages/tokens and packages/ui are shared.",
        detail: "The repository boundary is git. The deployment boundary is still the app. Confusing those two is the source of many architecture mistakes.",
        next: "Let's compare this with a polyrepo approach honestly.",
        ar: "المستودع الواحد لا يعني تطبيقاً واحداً. يعني تاريخ Git واحداً يحتوي تطبيقات قابلة للنشر بشكل مستقل، وحزماً مشتركة لها حدود وواجهات واضحة.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "Monorepo <em>vs.</em> polyrepo",
      eyebrow: "Decision",
      lead: "Both are valid. The right answer depends on coordination, ownership, and release cadence.",
      body: `
        ${table(
          ["Dimension", "Monorepo", "Polyrepo"],
          [
            ["Repository structure", "One repo, many packages", "Many repos, many packages"],
            ["Code sharing", "Workspace packages", "Publish + install"],
            ["Dependency management", "One lockfile", "One lockfile per repo"],
            ["CI / CD", "Task graph + cache", "Per-repo pipelines"],
            ["Atomic changes", "One pull request", "Coordinated PRs"],
            ["Scalability", "Org + tooling", "Team autonomy"],
            ["Complexity", "Central tooling", "Cross-repo coordination"],
          ],
          { cols: "0.9fr 1.1fr 1.1fr", compact: true, accentCol: 1 },
        )}
        <div class="grid-2" style="margin-top:12px">
          <div class="card card--good">
            <span class="card-kicker">Choose a monorepo when</span>
            <p>You share a design system, many apps, one platform team, and changes must land together.</p>
          </div>
          <div class="card card--warn">
            <span class="card-kicker">Choose a polyrepo when</span>
            <p>Products are independent, release cadences differ, and teams need strong autonomy.</p>
          </div>
        </div>
      `,
      notes: {
        say: "This is not a religion. A monorepo optimizes for coordination; a polyrepo optimizes for independence. Name the constraint before choosing the tool.",
        example: "A company with web, admin, mobile, and a shared design system usually benefits from a monorepo. A company with three unrelated products and separate on-call teams may not.",
        detail: "A polyrepo can still share packages through a registry. The question is whether you want source-linked feedback or versioned contracts between teams.",
        next: "If we choose a monorepo, how should we organize it?",
        ar: "لا يوجد خيار صحيح دائماً. المستودع الواحد يناسب الفرق التي تحتاج تنسيقاً وتغييرات ذرّية، بينما المستودعات المتعددة تناسب المنتجات المستقلة ذات دورات إصدار مختلفة.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "Five ways to <em>organize</em> the repository",
      eyebrow: "Organization strategies",
      lead: "These are organizational approaches, not formal monorepo types. Real repositories often mix them.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "01 · Application-based",
            title: "Group by app",
            text: "Start with the application; extract shared packages when a second consumer appears.",
          })}
          ${card({
            kicker: "02 · Package-based",
            title: "Group by capability",
            text: "UI, tokens, utils, and config are first-class packages from day one.",
          })}
          ${card({
            kicker: "03 · Hybrid",
            title: "Apps + packages",
            text: "Deployables in apps/, shared capabilities in packages/, common baseline at the root.",
            className: "card--accent",
          })}
        </div>
        <div class="grid-2" style="margin-top:12px">
          ${card({
            kicker: "04 · Integrated",
            title: "One toolchain",
            text: "Nx-style generators, plugins, and enforced module boundaries for large organizations.",
          })}
          ${card({
            kicker: "05 · Polyrepo",
            title: "Independent repositories",
            text: "Versioned packages, separate pipelines, and team-owned release cadence.",
          })}
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>Our choice: hybrid package-based.</strong> Apps deploy, packages are shared, and the root owns the task graph.</p>
        </div>
      `,
      notes: {
        say: "Organization is not a formal taxonomy. Most healthy monorepos are hybrids: apps at the top, packages underneath, and a small shared baseline at the root.",
        example: "The reference repo is hybrid: apps/docs and apps/playground, packages/tokens, packages/ui, and two shared config packages.",
        detail: "Application-based is a good migration strategy: start small, extract shared packages when the second consumer appears. Do not over-abstract on day one.",
        next: "The most important distinction inside that structure is workspace versus package.",
        ar: "تنظيم المستودع ليس نوعاً رسمياً واحداً. الأكثر شيوعاً هو النموذج الهجين: تطبيقات في apps، وحزم مشتركة في packages، وإعدادات مشتركة في الجذر.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "Workspace <em>vs.</em> package",
      eyebrow: "The core distinction",
      lead: "The workspace connects. The package defines. Mixing them up creates confusion.",
      body: `
        <div class="split">
          <div class="stack">
            <div class="row row--between">
              <span class="tag tag--accent">Workspace</span>
              <span class="mono dim" style="font-size:8px">pnpm-workspace.yaml</span>
            </div>
            ${code(
              "yaml",
              `
              packages:
                - "apps/*"
                - "packages/*"
              `,
              "pnpm-workspace.yaml",
            )}
            ${bullets([
              "Discovers every package in the repository.",
              "Links local dependencies without publishing.",
              "Owns the single lockfile and install graph.",
            ])}
          </div>

          <div class="stack">
            <div class="row row--between">
              <span class="tag tag--cyan">Package</span>
              <span class="mono dim" style="font-size:8px">packages/ui/package.json</span>
            </div>
            ${code(
              "json",
              `
              {
                "name": "@acme/ui",
                "exports": {
                  ".": "./dist/index.js",
                  "./styles.css": "./dist/styles.css"
                },
                "dependencies": {
                  "@acme/tokens": "workspace:*"
                }
              }
              `,
              "packages/ui/package.json",
            )}
            ${bullets([
              "Owns its name, dependencies, and scripts.",
              "Exposes a public API through exports.",
              "Can build, test, and publish independently.",
            ])}
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>Workspace connects. Package defines.</strong> A package can exist without a workspace; a workspace needs packages to connect.</p>
        </div>
      `,
      notes: {
        say: "The workspace is the map; the package is the destination. pnpm discovers packages and links them, but each package still has its own manifest and public API.",
        example: "The workspace file is three lines. The package.json is where the name @acme/ui and the dependency on @acme/tokens live.",
        detail: "workspace:* means pnpm resolves the local package, not a registry version. It is the fastest feedback loop inside the repository.",
        next: "With the structure clear, let's look at the benefits and the costs.",
        ar: "الـ Workspace هو الخريطة التي تجمع الحزم، والـ Package هي الوحدة التي لها اسم واعتماديات وواجهة عامة. الأول يربط، والثاني يعرّف.",
      },
    },

    {
      chapter: 1,
      chapterName: "Introduction to Monorepo",
      title: "The benefits <em>and the bill</em>",
      eyebrow: "Trade-offs",
      lead: "Every benefit has a maintenance cost. Name it, then design a control.",
      body: `
        <div class="grid-2">
          <div class="card card--good">
            <span class="card-kicker">What you gain</span>
            ${checks([
              "<strong>Code sharing</strong> — one implementation, many consumers.",
              "<strong>Consistency</strong> — one token source, one component API.",
              "<strong>Atomic changes</strong> — token + component + docs in one PR.",
              "<strong>Shared tooling</strong> — one ESLint, TypeScript, build baseline.",
              "<strong>Developer experience</strong> — one clone, one install, one graph.",
            ])}
          </div>
          <div class="card card--warn">
            <span class="card-kicker">What you pay</span>
            <div class="stack stack--sm">
              <div class="row row--between"><span class="dim">Repository complexity</span><span class="tag">conventions</span></div>
              <div class="row row--between"><span class="dim">CI performance</span><span class="tag">graph + cache</span></div>
              <div class="row row--between"><span class="dim">Dependency management</span><span class="tag">one lockfile</span></div>
              <div class="row row--between"><span class="dim">Ownership boundaries</span><span class="tag">CODEOWNERS</span></div>
              <div class="row row--between"><span class="dim">Repo size</span><span class="tag">filters + prune</span></div>
            </div>
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>!</span>
          <p><strong>A monorepo is a trade, not a free win.</strong> The rest of this workshop is how we pay the bill deliberately.</p>
        </div>
      `,
      notes: {
        say: "The benefits are real, but so are the costs. The mistake is adopting the structure without adopting the controls: boundaries, ownership, filters, and cache.",
        example: "A repo with no ownership rules becomes a shared folder. A repo with no cache becomes slower than five separate pipelines.",
        detail: "Measure before and after: install time, CI time, and the number of cross-package changes per sprint. Those three numbers tell you whether the monorepo is working.",
        next: "Chapter 2 is about Turborepo: the task graph and cache that make the monorepo fast.",
        ar: "المستودع الواحد يقدّم مشاركة الكود والتنسيق، لكنه يضيف تعقيداً في CI والملكية. النجاح يعتمد على ضوابط واضحة، وليس على المجلدات فقط.",
      },
    },
  ]);
})();
