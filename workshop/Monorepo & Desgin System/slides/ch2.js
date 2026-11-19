/* Chapter 2 — Turborepo (slides 9–20) */

(() => {
  const { code, table, flow, bullets, checks, card, pill, metric, terminal } = window.D;

  window.D.register([
    {
      chapter: 2,
      chapterName: "Turborepo",
      layout: "chapter",
      title: "The task <em>orchestrator</em>",
      lead: "Turborepo makes a monorepo fast without hiding how it works. It is not a package manager.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "01 · Orchestration",
            title: "Run the right tasks",
            text: "Executes package scripts in dependency order, with concurrency where the graph allows it.",
            className: "card--accent",
          })}
          ${card({
            kicker: "02 · Graph",
            title: "Understand relationships",
            text: "Reads package.json dependencies to build a task graph. No hand-written package list.",
          })}
          ${card({
            kicker: "03 · Cache",
            title: "Skip finished work",
            text: "Hashes inputs and restores declared outputs from a local or remote cache.",
          })}
        </div>
        <div class="grid-2" style="margin-top:12px">
          <div class="callout">
            <span>✓</span>
            <p><strong>Turborepo is maintained by Vercel</strong> and integrates with Vercel Remote Cache, or a self-hosted cache backend.</p>
          </div>
          <div class="callout callout--amber">
            <span>!</span>
            <p><strong>pnpm still does the installing.</strong> Turborepo runs tasks; it does not replace the package manager.</p>
          </div>
        </div>
      `,
      notes: {
        say: "Turborepo has three jobs: orchestrate tasks, understand the package graph, and cache the results. It is not pnpm, and it is not a deployment platform.",
        example: "You install dependencies with pnpm, then run `pnpm turbo run build`. Turborepo reads the graph and executes the build scripts.",
        detail: "The cache is content-addressed. If the task definition, inputs, environment, and upstream hashes match, the task can be restored instead of re-run.",
        next: "Here is the concrete problem it solves in a five-package repository.",
        ar: "Turborepo هو منسّق مهام وليس مدير حزم. pnpm يثبّت الحزم ويربطها، بينما Turborepo يقرأ الرسم البياني وينفّذ المهام بالترتيب ويخزّن النتائج مؤقتاً.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Five packages. <em>Three tasks.</em>",
      eyebrow: "Why Turborepo",
      lead: "Without orchestration, every package repeats work and every CI run starts from zero.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">Package graph</span>
            <div class="graph-h" style="justify-content:flex-start">
              <div class="node node--accent"><strong>@acme/tokens</strong><small>CSS + types</small></div>
              <span class="arrow">→</span>
              <div class="node"><strong>@acme/ui</strong><small>components</small></div>
              <span class="arrow">→</span>
              <div class="graph-branch">
                <div class="node node--wide"><strong>@acme/web</strong><small>app</small></div>
                <div class="node node--wide"><strong>@acme/admin</strong><small>app</small></div>
              </div>
            </div>
            <div class="graph-h" style="justify-content:flex-start;margin-top:9px">
              <div class="node"><strong>@acme/utils</strong><small>shared TS</small></div>
              <span class="arrow">↗</span>
              <span class="dim" style="font-size:8px">used by both apps</span>
            </div>
            <div class="divider" style="margin:12px 0"></div>
            <div class="vflow">
              <div class="vstep"><span class="vstep-num">B</span><div class="vstep-body"><strong>build</strong><span>tokens → utils → ui → apps</span></div><span class="vstep-tag">ordered</span></div>
              <div class="vstep"><span class="vstep-num">T</span><div class="vstep-body"><strong>test</strong><span>needs built packages</span></div><span class="vstep-tag">dependent</span></div>
              <div class="vstep"><span class="vstep-num">L</span><div class="vstep-body"><strong>lint</strong><span>independent per package</span></div><span class="vstep-tag">parallel</span></div>
            </div>
          </div>

          <div class="stack">
            <div class="card card--bad">
              <span class="card-kicker">Without a graph</span>
              <h3>“Run everything, hope for the best”</h3>
              <p>Wrong order, duplicated work, and no shared cache. CI repeats the same build on every push.</p>
            </div>
            <div class="card card--accent">
              <span class="card-kicker">With Turborepo</span>
              <h3>“Run what is needed, in order”</h3>
              <p>Build dependencies first, run independent tasks in parallel, and restore finished work from cache.</p>
            </div>
            <div class="card">
              <span class="card-kicker">The result</span>
              <h3>Less waiting, same output</h3>
              <p>One task definition, one graph, one cache for local development and CI.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This is the problem in one picture. Build must follow the graph. Test depends on build. Lint is independent. Without a task graph, you either run everything serially or guess the order.",
        example: "A change in tokens must rebuild UI, then web and admin. A README change should rebuild nothing.",
        detail: "pnpm can run recursive scripts, but Turborepo adds task-aware hashing, output replay, and a shared cache across machines.",
        next: "Let's create the project and look at what the scaffold gives us.",
        ar: "المهام الثلاث تختلف: build يجب أن يتبع ترتيب الاعتماديات، test يعتمد على build، و lint يمكن أن يعمل بالتوازي. Turborepo يستنتج هذا من الرسم البياني.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Create the workspace",
      eyebrow: "Getting started",
      lead: "Start from the official scaffold, then reshape it around your packages.",
      body: `
        <div class="split">
          <div class="stack">
            ${code(
              "bash",
              `
              pnpm dlx create-turbo@latest acme
              cd acme
              pnpm install
              pnpm dev
              `,
              "terminal",
            )}
            <div class="callout">
              <span>→</span>
              <p><strong>One command gives you a working baseline:</strong> workspace, task graph, two apps, and shared packages.</p>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Do not keep the demo packages.</strong> Rename them, delete what you do not need, and make the structure match your product.</p>
            </div>
          </div>
          <div class="diagram-box">
            <span class="diagram-label">Resulting structure</span>
            ${code(
              "bash",
              `
              acme/
              ├── apps/
              │   ├── web/
              │   └── docs/
              ├── packages/
              │   ├── ui/
              │   ├── eslint-config/
              │   └── typescript-config/
              ├── package.json
              ├── pnpm-workspace.yaml
              └── turbo.json
              `,
              "acme/",
            )}
          </div>
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>Validate the baseline:</strong> <code>pnpm build</code>, <code>pnpm lint</code>, and <code>pnpm test</code> should pass before you add your own packages.</p>
        </div>
      `,
      notes: {
        say: "Use the official create-turbo scaffold. It gives you a working baseline so you can separate tooling problems from your own architecture problems.",
        example: "The scaffold creates apps/web, apps/docs, packages/ui, ESLint config, TypeScript config, pnpm-workspace.yaml, and turbo.json.",
        detail: "create-turbo evolves with Turborepo. Check the generated package versions and the official docs rather than copying an old tutorial.",
        next: "Here is how to read that structure and decide where your code belongs.",
        ar: "ابدأ من القالب الرسمي لتحصل على أساس يعمل. بعد ذلك أعد تسمية الحزم واحذف ما لا تحتاجه، حتى تعكس البنية منتجك الحقيقي.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "A place for <em>every kind of code</em>",
      eyebrow: "Repository structure",
      lead: "Apps are deployables. Packages are shared capabilities. The root owns the task graph.",
      body: `
        <div class="split split--wide">
          ${code(
            "bash",
            `
            acme/
            ├── apps/              # deployables
            │   ├── web/           # customer app
            │   ├── admin/         # internal app
            │   └── storybook/     # component docs
            ├── packages/          # shared units
            │   ├── tokens/        # design tokens
            │   ├── ui/            # React components
            │   ├── utils/         # shared TypeScript
            │   ├── eslint-config/
            │   └── typescript-config/
            ├── pnpm-workspace.yaml
            ├── package.json
            └── turbo.json
            `,
            "acme/",
          )}
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">apps/</span>
              <h3>Deployable units</h3>
              <p>Each app has its own runtime, routing, and deployment. Apps should not import each other.</p>
            </div>
            <div class="card">
              <span class="card-kicker">packages/</span>
              <h3>Shared capabilities</h3>
              <p>UI, tokens, utilities, and configuration. One owner, one public API, one version.</p>
            </div>
            <div class="card">
              <span class="card-kicker">root</span>
              <h3>Workspace contract</h3>
              <p><code>pnpm-workspace.yaml</code> discovers packages; <code>turbo.json</code> defines tasks.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Use the folder structure as architecture. Apps are leaves in the graph; packages are shared nodes; the root is the contract, not a dumping ground.",
        example: "Storybook lives in apps/storybook because it is a consumer of packages/ui, not part of the component package itself.",
        detail: "If an app imports another app, the graph becomes a cycle waiting to happen. Extract the shared code into a package instead.",
        next: "What does an individual package need to be a good citizen?",
        ar: "المجلدات تعكس المعمارية: التطبيقات أوراق في الرسم البياني، والحزم عقد مشتركة، والجذر يحتوي ملفات العقد مثل workspace و turbo.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "What every package <em>needs</em>",
      eyebrow: "Package contract",
      lead: "A package is not a folder. It is a small product with a manifest and a public API.",
      body: `
        <div class="split split--wide">
          ${code(
            "json",
            `
            {
              "name": "@acme/ui",
              "version": "0.0.0",
              "type": "module",
              "exports": {
                ".": {
                  "types": "./dist/index.d.ts",
                  "import": "./dist/index.js"
                },
                "./styles.css": "./dist/styles.css"
              },
              "files": ["dist"],
              "scripts": {
                "build": "tsup",
                "lint": "eslint .",
                "test": "vitest run"
              },
              "peerDependencies": {
                "react": "^18 || ^19"
              }
            }
            `,
            "packages/ui/package.json",
          )}
          <div class="stack">
            ${checks([
              "<strong>package.json</strong> — identity and scripts.",
              "<strong>Dependencies</strong> — runtime packages.",
              "<strong>DevDependencies</strong> — build and test tools.",
              "<strong>Source</strong> — typed code in <code>src/</code>.",
              "<strong>Output</strong> — generated <code>dist/</code>, never edited.",
              "<strong>TypeScript config</strong> — extends the shared baseline.",
              "<strong>Public exports</strong> — the only supported entry points.",
            ], "checks--tight")}
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>If it is not in <code>exports</code>, it is private.</strong> Deep imports break consumers and caching.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Every package needs a manifest, dependencies, scripts, source, build output, a TypeScript config, and a public API. The package.json is the contract.",
        example: "The UI package exports the root API and the compiled stylesheet. Consumers never reach into src/components/button/button.tsx.",
        detail: "Use the exports map for every supported entry point. Add types first so TypeScript resolves the right declaration file.",
        next: "Instead of copying ESLint and TypeScript settings into every package, we share them.",
        ar: "كل حزمة تحتاج ملف package.json وواجهة عامة واضحة. أي ملف غير مذكور في exports يعتبر داخلياً، ويجب ألا يعتمد عليه المستهلكون.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Shared configuration, <em>not copy-paste</em>",
      eyebrow: "Shared configs",
      lead: "Three small packages remove an entire category of drift.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "packages/eslint-config",
            title: "Lint rules",
            text: "Base, React, and Storybook presets. One upgrade reaches every package.",
            className: "card--accent",
          })}
          ${card({
            kicker: "packages/typescript-config",
            title: "TypeScript baselines",
            text: "Base, React app, and React library presets. Consistent strictness.",
          })}
          ${card({
            kicker: "packages/prettier-config",
            title: "Formatting",
            text: "One formatting contract for editors, CI, and generated files.",
          })}
        </div>
        <div class="split" style="margin-top:14px">
          <div class="stack">
            <span class="mini-label">ESLint · package.json</span>
            ${code(
              "json",
              `
              {
                "extends": "@acme/eslint-config/react.js"
              }
              `,
              "packages/ui/.eslintrc.json",
            )}
          </div>
          <div class="stack">
            <span class="mini-label">TypeScript · tsconfig.json</span>
            ${code(
              "json",
              `
              {
                "extends": "@acme/typescript-config/react-library.json",
                "compilerOptions": {
                  "outDir": "dist"
                }
              }
              `,
              "packages/ui/tsconfig.json",
            )}
          </div>
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>The rule is simple:</strong> configuration is code, so it lives in a package and is reviewed like code.</p>
        </div>
      `,
      notes: {
        say: "Shared config packages are one of the highest-leverage parts of a monorepo. They remove copy-paste without forcing every package to use the same runtime.",
        example: "apps/web extends the React app TypeScript config; packages/ui extends the React library config; both extend the same base.",
        detail: "Keep config packages private unless external consumers need them. Use workspace:* inside the repo.",
        next: "Now the central file: turbo.json.",
        ar: "بدل نسخ إعدادات ESLint و TypeScript في كل حزمة، نضعها في حزم مشتركة. تحديث واحد يصل إلى كل المستهلكين ويقلل الانحراف.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Reading <em>turbo.json</em>",
      eyebrow: "Task configuration",
      lead: "This is where the graph, the cache, and the long-running tasks are defined.",
      body: `
        <div class="split split--wide">
          ${code(
            "json",
            `
            {
              "$schema": "https://turborepo.dev/schema.json",
              "tasks": {
                "build": {
                  "dependsOn": ["^build"],
                  "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
                },
                "lint": {
                  "dependsOn": ["^lint"]
                },
                "test": {
                  "dependsOn": ["build"],
                  "outputs": ["coverage/**"]
                },
                "dev": {
                  "cache": false,
                  "persistent": true
                }
              }
            }
            `,
            "turbo.json",
          )}
          <div class="stack stack--sm">
            <div class="row"><span class="tag tag--accent">tasks</span><p class="dim" style="font-size:9.5px">Named scripts that Turborepo may run.</p></div>
            <div class="row"><span class="tag tag--accent">^build</span><p class="dim" style="font-size:9.5px">Run dependency builds first. The caret means “upstream”.</p></div>
            <div class="row"><span class="tag tag--accent">outputs</span><p class="dim" style="font-size:9.5px">Files to cache and restore. Exclude framework caches.</p></div>
            <div class="row"><span class="tag tag--accent">inputs</span><p class="dim" style="font-size:9.5px">Files that affect the hash. Defaults to package files.</p></div>
            <div class="row"><span class="tag tag--accent">cache</span><p class="dim" style="font-size:9.5px">Set to <code>false</code> for dev, deploy, and side effects.</p></div>
            <div class="row"><span class="tag tag--accent">persistent</span><p class="dim" style="font-size:9.5px">Long-running tasks that never exit.</p></div>
            <div class="row"><span class="tag tag--accent">env</span><p class="dim" style="font-size:9.5px">Environment variables included in the hash.</p></div>
            <div class="callout callout--amber" style="margin-top:4px">
              <span>!</span>
              <p><strong><code>test</code> depends on <code>build</code> here, not <code>^build</code>.</strong> That means “build this package first”, not “build all dependencies”.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Read turbo.json as a contract: which tasks exist, what must finish first, what should be cached, and what should never be skipped.",
        example: "The build task depends on the build of its dependencies. Test depends on the build of the same package. Lint is independent.",
        detail: "Exclude framework caches such as .next/cache from outputs. Caching them makes restores larger and can create stale local state.",
        next: "The graph is easier to understand when you see it as layers.",
        ar: "ملف turbo.json يحدد المهام وترتيبها وما يجب تخزينه. علامة ^ تعني اعتماديات الحزمة، وبدونها تعني مهمة أخرى داخل نفس الحزمة.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "The graph is the <em>build order</em>",
      eyebrow: "Dependency graph",
      lead: "Change a token, and the graph tells Turborepo exactly what must be rebuilt.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">Build graph</span>
            <div class="graph-v" style="align-items:stretch">
              <div class="node node--accent" style="text-align:center"><strong>@acme/tokens</strong><small>base: CSS variables + types</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="node" style="text-align:center"><strong>@acme/ui</strong><small>depends on tokens</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="graph-h" style="align-items:stretch">
                <div class="node" style="flex:1;text-align:center"><strong>@acme/web</strong><small>depends on ui + utils</small></div>
                <div class="node" style="flex:1;text-align:center"><strong>@acme/admin</strong><small>depends on ui + utils</small></div>
              </div>
            </div>
          </div>
          <div class="stack">
            ${card({
              kicker: "Layer 01",
              title: "Base packages",
              text: "tokens and utils have no internal consumers. They build first and can run in parallel.",
              className: "card--accent",
            })}
            ${card({
              kicker: "Layer 02",
              title: "Shared components",
              text: "ui needs tokens. Its build waits for the token output, then produces JS, CSS, and declarations.",
            })}
            ${card({
              kicker: "Layer 03",
              title: "Applications",
              text: "web and admin need ui. They build in parallel once the shared layer is ready.",
            })}
          </div>
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>Why order matters:</strong> missing types, stale CSS, and runtime imports all fail differently — and all come from a broken graph.</p>
        </div>
      `,
      notes: {
        say: "The graph is not a diagram for the slide; it is the actual execution plan. Base packages first, shared UI next, applications last.",
        example: "If tokens change, Turborepo rebuilds tokens, then UI, then web and admin. If only a README changes, none of them need to rebuild.",
        detail: "The graph comes from package.json dependencies. That is why dependency hygiene is architecture, not paperwork.",
        next: "The graph decides order. The cache decides what we can skip.",
        ar: "الرسم البياني يحدد ترتيب البناء: الحزم الأساسية أولاً، ثم المكونات المشتركة، ثم التطبيقات. أي خطأ في الاعتماديات يظهر كخطأ في البناء.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Caching is <em>memoization for tasks</em>",
      eyebrow: "Caching",
      lead: "Same inputs, same hash, same result. Restore instead of re-run.",
      body: `
        <div class="split">
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">Cache key</span>
              <h3 style="font-family:var(--font-mono);font-size:12px;line-height:1.7">hash(task + inputs + env + dependency hashes)</h3>
              <p style="margin-top:8px">A task is identified by content, not by time or branch name.</p>
            </div>
            <div class="grid-2">
              <div class="card">
                <span class="card-kicker">Local cache</span>
                <h3>.turbo/cache</h3>
                <p>Free, immediate, per machine. Good for solo development.</p>
              </div>
              <div class="card">
                <span class="card-kicker">Remote cache</span>
                <h3>Team + CI</h3>
                <p>Shared artifacts across machines. The CI win that compounds.</p>
              </div>
            </div>
            <div class="callout">
              <span>→</span>
              <p><strong>Invalidation is automatic:</strong> edit a token, the hash changes, downstream tasks rebuild. Edit a README, nothing rebuilds.</p>
            </div>
          </div>

          <div class="stack">
            <div class="metrics metrics--3">
              ${metric("48s", "cold build", "cache miss")}
              ${metric("0.4s", "warm build", "cache hit")}
              ${metric("N", "machines", "one remote cache")}
            </div>
            <div class="card">
              <span class="card-kicker">What is in the hash?</span>
              ${bullets([
                "The task command and definition.",
                "The files matched by <code>inputs</code>.",
                "The environment variables declared in <code>env</code>.",
                "The hashes of upstream task outputs.",
                "The lockfile and root configuration.",
              ], "bullets--tight")}
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Timing is illustrative.</strong> The shape matters: cold work is seconds, cache restores are milliseconds.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The cache is not a guess. Turborepo hashes the task definition, inputs, environment, and upstream outputs. If the hash matches, it restores the output.",
        example: "Change packages/tokens/tokens/semantic/color-light.json and the token hash changes. UI and apps rebuild. Change README.md and they do not.",
        detail: "A wrong input or output declaration makes the cache untrustworthy. A stale cache is worse than a slow build because it hides the problem.",
        next: "Let's look at a real first run and second run.",
        ar: "الكاش يعتمد على البصمة الرقمية للمدخلات. إذا تغيّر ملف توكنز، تتغير البصمة وتُعاد المهام التابعة. وإذا تغيّر ملف توثيق فقط، لا يُعاد البناء.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "First run. <em>Second run.</em>",
      eyebrow: "Live caching demo",
      lead: "The only difference between the two runs is the cache.",
      body: `
        <div class="grid-2">
          <div class="stack">
            <span class="tag tag--rose">Run 01 · cache miss</span>
            ${terminal("pnpm turbo run build", [
              { type: "cmd", text: "pnpm turbo run build" },
              { type: "muted", text: "• Packages in scope: @acme/web, @acme/ui, @acme/tokens" },
              { type: "muted", text: "• Running build in 3 packages" },
              { type: "warn", text: "@acme/tokens:build: cache miss, executing..." },
              { type: "warn", text: "@acme/ui:build: cache miss, executing..." },
              { type: "warn", text: "@acme/web:build: cache miss, executing..." },
              { type: "ok", text: "Tasks: 3 successful, 3 total" },
              { type: "accent", text: "Time: 48.2s" },
            ])}
          </div>
          <div class="stack">
            <span class="tag tag--green">Run 02 · cache hit</span>
            ${terminal("pnpm turbo run build", [
              { type: "cmd", text: "pnpm turbo run build" },
              { type: "muted", text: "• Packages in scope: @acme/web, @acme/ui, @acme/tokens" },
              { type: "muted", text: "• Running build in 3 packages" },
              { type: "ok", text: "@acme/tokens:build: cache hit, replaying logs..." },
              { type: "ok", text: "@acme/ui:build: cache hit, replaying logs..." },
              { type: "ok", text: "@acme/web:build: cache hit, replaying logs..." },
              { type: "ok", text: "Tasks: 3 successful, 3 total" },
              { type: "accent", text: "Time: 312ms >>> FULL TURBO" },
            ])}
          </div>
        </div>
        <div class="grid-3" style="margin-top:12px">
          <div class="card"><span class="card-kicker">What happened?</span><p>Run 01 built and stored outputs. Run 02 matched the same hashes.</p></div>
          <div class="card"><span class="card-kicker">What is restored?</span><p>The declared <code>outputs</code>: dist files, logs, and framework build output.</p></div>
          <div class="card"><span class="card-kicker">What is not restored?</span><p>Side effects such as deploy, publish, or a dev server. Those are not cacheable.</p></div>
        </div>
      `,
      notes: {
        say: "This is the moment the cache becomes real. The second run does not rebuild; it replays the cached logs and restores the declared outputs.",
        example: "The reference repository has a .turbo/cache directory with tar archives and manifests. The second build is the same task graph, not a shortcut.",
        detail: "Exact timing and log formatting vary by version. Focus on cache miss vs cache hit and what was declared in outputs.",
        next: "Caching makes repeated work cheap. Filtering makes the work smaller in the first place.",
        ar: "في التشغيل الثاني لا يعيد Turborepo البناء، بل يستعيد المخرجات من الكاش. هذا لا يعني تجاهل المهمة، بل إثبات أن المدخلات لم تتغير.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Run less. <em>Ship more.</em>",
      eyebrow: "Filtering",
      lead: "Filters answer one question: which packages should participate in this run?",
      body: `
        <div class="split split--wide">
          <div class="stack">
            ${code(
              "bash",
              `
              # One package
              pnpm turbo run build --filter=@acme/ui

              # A package and its dependencies
              pnpm turbo run build --filter=web...

              # Everything
              pnpm turbo run lint

              # Changed since main + dependents
              pnpm turbo run build --filter=...[origin/main]
              `,
              "package selection",
            )}
          </div>
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">--filter=@acme/ui</span>
              <p>Run only UI and whatever its task dependencies require.</p>
            </div>
            <div class="card">
              <span class="card-kicker">--filter=web...</span>
              <p>The trailing ellipsis selects the package plus its dependencies.</p>
            </div>
            <div class="card">
              <span class="card-kicker">--filter=...[origin/main]</span>
              <p>Changed packages plus their dependents. Perfect for pull requests.</p>
            </div>
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>Also useful:</strong> <code>turbo run build --affected</code> for branch-based CI. Full git history is required.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Filters are how a monorepo stays fast in CI. You rarely need to run all tasks for all packages on every pull request.",
        example: "If a PR changes packages/ui, `--filter=...[origin/main]` selects UI and the apps that depend on it, but not the unrelated docs app.",
        detail: "The direction of the ellipsis matters: `web...` includes dependencies, `...web` includes dependents. Verify with `--dry=json` before trusting a CI filter.",
        next: "These are the practices that keep the graph and cache correct.",
        ar: "الفلترة تحدد الحزم المشاركة في التشغيل. اتجاه النقاط مهم: web... تعني الحزمة واعتمادياتها، و ...web تعني الحزمة والمستهلكين التابعين لها.",
      },
    },

    {
      chapter: 2,
      chapterName: "Turborepo",
      title: "Six rules for a <em>healthy pipeline</em>",
      eyebrow: "Best practices",
      lead: "If the graph is wrong, the cache is wrong. If the cache is wrong, trust disappears.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "01 · Dependencies",
            title: "Use the right caret",
            text: "^build means dependencies. build means the same package. Most mistakes start here.",
          })}
          ${card({
            kicker: "02 · Outputs",
            title: "Declare what to restore",
            text: "dist/**, build/**, coverage/**. Exclude framework caches and temporary files.",
          })}
          ${card({
            kicker: "03 · Cache",
            title: "Do not disable it casually",
            text: "cache: false is for dev, deploy, and side effects, not for a build that fails to hit.",
          })}
          ${card({
            kicker: "04 · Environment",
            title: "Declare env vars",
            text: "Use env and globalEnv. An undeclared variable is an invisible input.",
          })}
          ${card({
            kicker: "05 · Configuration",
            title: "Share, do not copy",
            text: "One ESLint config, one TypeScript baseline, one formatting contract.",
          })}
          ${card({
            kicker: "06 · CI",
            title: "Use remote cache",
            text: "The cache is most valuable when CI and developers share it.",
          })}
        </div>
        <div class="callout callout--rose" style="margin-top:12px">
          <span>!</span>
          <p><strong>Debug with data:</strong> <code>turbo run build --dry=json</code> shows the hash, inputs, outputs, and dependencies before anything runs.</p>
        </div>
      `,
      notes: {
        say: "These six rules cover most production failures. The graph and the cache are only as good as the declarations you give them.",
        example: "If an environment variable changes the build but is not declared, the cache may restore the wrong output. Add it to env.",
        detail: "Use --dry=json when a cache hit looks suspicious. It prints the exact task hash and the inputs that contributed to it.",
        next: "Chapter 3 moves from the repository to the product: why a design system exists.",
        ar: "أغلب مشاكل Turborepo تعود إلى اعتماديات أو مخرجات غير معلنة. استخدم dry=json لفحص البصمة والمدخلات قبل الاعتماد على الكاش.",
      },
    },
  ]);
})();
