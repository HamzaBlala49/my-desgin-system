/* Chapter 8 — AI-Assisted Development (slides 56–63) */

(() => {
  const { code, flow, bullets, checks, card, pill } = window.D;

  window.D.register([
    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      layout: "chapter",
      title: "AI as an <em>engineering assistant</em>",
      lead: "Use it to explore, draft, and review — not to skip architecture, testing, or ownership.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "01 · Architecture",
            title: "Explore options",
            text: "Generate folder structures and dependency graphs, then review the trade-offs.",
            className: "card--accent",
          })}
          ${card({
            kicker: "02 · Code",
            title: "Draft components",
            text: "Scaffold typed, accessible components with tests and stories.",
          })}
          ${card({
            kicker: "03 · Refactor",
            title: "Find patterns",
            text: "Spot duplication, inconsistent naming, and missing boundaries.",
          })}
          ${card({
            kicker: "04 · Configuration",
            title: "Review the pipeline",
            text: "Audit turbo.json, inputs, outputs, and CI filters.",
          })}
          ${card({
            kicker: "05 · Documentation",
            title: "Write the guide",
            text: "Draft usage notes, migration steps, and architecture decisions.",
          })}
          ${card({
            kicker: "06 · Testing",
            title: "Generate evidence",
            text: "Propose tests, edge cases, and accessibility checks.",
          })}
        </div>
        <div class="callout callout--amber" style="margin-top:12px">
          <span>!</span>
          <p><strong>AI output is a draft, not a decision.</strong> A human reviews the architecture, the diff, the tests, and the evidence.</p>
        </div>
      `,
      notes: {
        say: "AI is useful at every layer, but the value depends on the quality of the context and the review. It can draft a repo; it cannot own the trade-offs.",
        example: "Use AI to compare two folder structures, audit a turbo.json, generate a token migration map, or draft a Button test suite.",
        detail: "Never paste secrets, customer data, or proprietary tokens into a prompt. Use redacted examples and a private model when needed.",
        next: "Let's make this practical with copy-ready prompts, starting with the monorepo architecture.",
        ar: "الذكاء الاصطناعي مفيد في التخطيط والكود والمراجعة، لكنه لا يملك القرار. المخرجات مسودة تحتاج مراجعة بشرية واختبارات وأدلة.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "Prompt 01: <em>design the monorepo</em>",
      eyebrow: "AI prompt · architecture",
      lead: "Ask for a structure, the manifests, the task graph, and the risks — not just a folder tree.",
      dense: true,
      body: `
        <div class="prompt-layout">
          <div class="prompt-left">
            <div class="prompt-problem">
              <span class="label">Problem</span>
              <p>You need a pnpm + Turborepo workspace for web, admin, a shared design system, and shared utilities. You want clear boundaries and no tool sprawl.</p>
            </div>
            <div class="prompt-code">
              ${code(
                "text",
                `
You are a senior monorepo architect. Design a pnpm + Turborepo
workspace for a company with:
- a customer web app and an internal admin app
- a shared design system (tokens + React components)
- shared TypeScript utilities
- shared ESLint and TypeScript configs

Return:
1. A folder tree with apps/, packages/, and shared configs.
2. A package.json for each package: name, scripts, exports.
3. pnpm-workspace.yaml and the root package.json.
4. Dependency directions and forbidden imports.
5. A build/test/lint task graph for turbo.json.
6. Three risks, each with a mitigation.

Constraints: TypeScript, Node 22, pnpm 9, no Nx.
Explain every decision in one short sentence.
                `,
                "prompt.txt",
              )}
            </div>
          </div>
          <div class="prompt-right">
            <div class="card card--good">
              <h3>Expected output</h3>
              ${bullets([
                "A tree with a reason for each folder.",
                "Manifests with explicit exports.",
                "A task graph with correct carets.",
                "Boundary rules and risks.",
              ])}
            </div>
            <div class="card">
              <h3>Validate</h3>
              ${bullets([
                "Build each package in isolation.",
                "Run <code>turbo run build --dry=json</code>.",
                "Check for dependency cycles.",
                "Confirm no app imports another app.",
              ])}
            </div>
            <div class="card card--bad">
              <h3>Common mistakes</h3>
              ${bullets([
                "Adding packages with no consumer.",
                "Using <code>latest</code> for core tools.",
                "Forgetting ownership and CODEOWNERS.",
                "A task graph without declared outputs.",
              ])}
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "A good architecture prompt asks for evidence: manifests, dependency directions, a task graph, and risks. A folder tree alone is not an architecture.",
        example: "The prompt forces the model to justify apps versus packages and to produce the actual turbo.json graph.",
        detail: "Ask for forbidden imports explicitly. Models tend to create a plausible tree but forget boundary rules and ownership.",
        next: "Once the repo exists, use AI to audit the task pipeline.",
        ar: "اطلب من الذكاء الاصطناعي البنية والملفات والرسم البياني والمخاطر، وليس مجرد شجرة مجلدات. وجود الملفات وقواعد المنع يجعل الإجابة قابلة للتحقق.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "Prompt 02: <em>audit turbo.json</em>",
      eyebrow: "AI prompt · caching",
      lead: "Ask for a table of issues, impact, exact fix, and a verification command.",
      dense: true,
      body: `
        <div class="prompt-layout">
          <div class="prompt-left">
            <div class="prompt-problem">
              <span class="label">Problem</span>
              <p>CI is slow and cache hits are unreliable. Paste your <code>turbo.json</code> and package graph after the prompt.</p>
            </div>
            <div class="prompt-code">
              ${code(
                "text",
                `
Review the attached turbo.json and package graph. Explain why
builds are slow or cache hits are low.

Check:
- dependsOn: ^build vs build
- outputs: missing, too broad, or framework caches
- inputs: undeclared files, env, or config
- cache: false on cacheable tasks
- persistent / interactive tasks
- env and globalEnv declarations
- filter strategy for pull requests
- remote cache setup

Return a table with:
issue | impact | exact fix | verification command.
Do not rewrite unrelated configuration.
Use the official Turborepo docs as the reference.
                `,
                "prompt.txt",
              )}
            </div>
          </div>
          <div class="prompt-right">
            <div class="card card--good">
              <h3>Expected output</h3>
              ${bullets([
                "A ranked issue table.",
                "Minimal diffs, not a rewrite.",
                "A command to verify each fix.",
                "Explicit assumptions.",
              ])}
            </div>
            <div class="card">
              <h3>Validate</h3>
              ${bullets([
                "Run <code>--dry=json</code> before and after.",
                "Compare hashes for the same task.",
                "Check CI cold and warm runs.",
                "Confirm <code>dev</code> is not cached.",
              ])}
            </div>
            <div class="card card--bad">
              <h3>Common mistakes</h3>
              ${bullets([
                "Disabling cache to hide a miss.",
                "Declaring every file as an input.",
                "Caching deploy or publish tasks.",
                "Forgetting environment variables.",
              ])}
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This prompt is a code review, not a generation task. The most important column in the answer is the verification command.",
        example: "If the model says a missing output is the problem, ask for `turbo run build --dry=json` and compare the outputs field before and after.",
        detail: "Never accept a wholesale turbo.json rewrite. Ask for a minimal diff and a reason for each change.",
        next: "The same review discipline applies to token organization.",
        ar: "هذا برومبت مراجعة وليس توليداً. اطلب جدولاً بالمشكلة والأثر والإصلاح وأمر التحقق، وارفض إعادة كتابة الملف بالكامل دون سبب.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "Prompt 03: <em>organize tokens</em>",
      eyebrow: "AI prompt · design tokens",
      lead: "Turn a flat JSON file into three tiers with references, a rename map, and a migration checklist.",
      dense: true,
      body: `
        <div class="prompt-layout">
          <div class="prompt-left">
            <div class="prompt-problem">
              <span class="label">Problem</span>
              <p>A flat token file has raw values, mode names, duplicates, and inconsistent casing. It needs a reviewable migration.</p>
            </div>
            <div class="prompt-code">
              ${code(
                "text",
                `
You are a design system engineer. Reorganize the attached token
JSON into primitive, semantic, and component tiers using DTCG
($type / $value / $description).

Rules:
- Raw values live in primitives only.
- Semantic tokens reference primitives.
- Component tokens reference semantic tokens.
- Names use category.role.variant.state.
- No mode names in semantic tokens.
- Remove duplicates and meaningless aliases.
- Flag tokens that should not exist.

Return:
1. primitives.json, semantic.json, components.json
2. A rename map: old name -> new name -> reason
3. A migration checklist for code and Figma
                `,
                "prompt.txt",
              )}
            </div>
          </div>
          <div class="prompt-right">
            <div class="card card--good">
              <h3>Expected output</h3>
              ${bullets([
                "Three valid DTCG files.",
                "A complete rename map.",
                "A migration checklist.",
                "A list of flagged tokens.",
              ])}
            </div>
            <div class="card">
              <h3>Validate</h3>
              ${bullets([
                "No raw hex outside primitives.",
                "Every reference resolves.",
                "Both themes still build.",
                "Names match the naming lint.",
              ])}
            </div>
            <div class="card card--bad">
              <h3>Common mistakes</h3>
              ${bullets([
                "Renaming without a migration map.",
                "Mode names such as <code>darkText</code>.",
                "Component tokens pointing to primitives.",
                "Over-tokenizing every padding value.",
              ])}
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Token migration is a naming and meaning exercise, not a find-and-replace. Ask for the rename map and the migration checklist, not just the JSON.",
        example: "color-blue-600 might become color-action-primary, and button-blue might become button-primary-background.",
        detail: "The model cannot know your product semantics. Review every semantic name with a designer before merging.",
        next: "Once the tokens are organized, compile them.",
        ar: "إعادة تنظيم التوكنز ليست بحثاً واستبدالاً. تحتاج خريطة إعادة تسمية وقائمة ترحيل ومراجعة بشرية للمعنى قبل الدمج.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "Prompt 04: <em>Style Dictionary</em>",
      eyebrow: "AI prompt · build",
      lead: "Generate the config, the outputs, and the verification — not only a code snippet.",
      dense: true,
      body: `
        <div class="prompt-layout">
          <div class="prompt-left">
            <div class="prompt-problem">
              <span class="label">Problem</span>
              <p>You need CSS variables, a Tailwind v4 theme, JS exports, and types from one DTCG token source.</p>
            </div>
            <div class="prompt-code">
              ${code(
                "text",
                `
Write a Style Dictionary v4/v5 ESM configuration for a tokens
package. Source: tokens/**/*.json in DTCG format.

Outputs:
1. dist/variables.css with :root and [data-theme="dark"].
2. dist/tailwind.css using @theme inline.
3. dist/tokens.js and dist/tokens.d.ts.
4. Keep aliases with outputReferences: true.

Also include:
- package.json scripts
- a CI job that builds and verifies the output
- the expected CSS for one primitive, one semantic, and one component token
- five failure modes and how to detect them

Explain the transform and format choices briefly.
                `,
                "prompt.txt",
              )}
            </div>
          </div>
          <div class="prompt-right">
            <div class="card card--good">
              <h3>Expected output</h3>
              ${bullets([
                "A complete config file.",
                "Scripts and a CI check.",
                "Expected CSS with references.",
                "Failure modes with detection.",
              ])}
            </div>
            <div class="card">
              <h3>Validate</h3>
              ${bullets([
                "Build twice; <code>git diff</code> is empty.",
                "Aliases remain <code>var()</code>.",
                "Tailwind utilities resolve.",
                "Dark theme overrides apply.",
              ])}
            </div>
            <div class="card card--bad">
              <h3>Common mistakes</h3>
              ${bullets([
                "Mixing Tailwind v3 and v4 syntax.",
                "Flattening every reference.",
                "Editing <code>dist</code> by hand.",
                "No deterministic build check.",
              ])}
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This prompt asks for the build and the evidence: expected CSS, a CI check, and failure modes. That is much more useful than a config snippet alone.",
        example: "The generated CSS should show --color-blue-500, --color-action-primary: var(--color-blue-500), and the component alias on top.",
        detail: "Style Dictionary v4 and v5 share the ESM shape. If the model produces v3 syntax, reject it and ask for a version-specific config.",
        next: "Now the UI component that consumes these tokens.",
        ar: "اطلب الإعداد والمخرجات وفحص CI والأخطاء المحتملة. هذا يمنحك حلاً قابلاً للتحقق بدلاً من مقتطف كود فقط.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "Prompt 05: <em>build the Button</em>",
      eyebrow: "AI prompt · React component",
      lead: "Specify behavior, accessibility, API, styles, and tests. Reject anything less.",
      dense: true,
      body: `
        <div class="prompt-layout">
          <div class="prompt-left">
            <div class="prompt-problem">
              <span class="label">Problem</span>
              <p>You need a typed, accessible Button that uses the design system tokens — not a generic tutorial component.</p>
            </div>
            <div class="prompt-code">
              ${code(
                "text",
                `
Create a production-ready React Button for @acme/ui.

Requirements:
- TypeScript, React 18/19, forwardRef.
- CVA variants: primary, secondary, ghost.
- Sizes: sm, md, lg.
- States: hover, focus-visible, disabled, loading.
- Loading uses aria-busy and disables the button.
- Use only token classes; no hex values.
- Use a native <button>, never a div.
- Include a Testing Library test and a jest-axe check.
- Explain the API and edge cases.

Return only: component, test, short usage example.
Do not invent token names. Use the attached token list.
                `,
                "prompt.txt",
              )}
            </div>
          </div>
          <div class="prompt-right">
            <div class="card card--good">
              <h3>Expected output</h3>
              ${bullets([
                "Typed component with refs.",
                "Variant and size maps.",
                "Accessible loading state.",
                "Behavior + axe tests.",
              ])}
            </div>
            <div class="card">
              <h3>Validate</h3>
              ${bullets([
                "Typecheck and lint pass.",
                "Keyboard focus is visible.",
                "Screen reader announces loading.",
                "No raw colors in the diff.",
              ])}
            </div>
            <div class="card card--bad">
              <h3>Common mistakes</h3>
              ${bullets([
                "A div with a click handler.",
                "Missing focus-visible styles.",
                "<code>disabled</code> without a loading reason.",
                "Dynamic Tailwind class strings.",
              ])}
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The prompt is an acceptance test. It names the API, the states, the accessibility behavior, the token constraint, and the tests.",
        example: "A good answer uses forwardRef, CVA, aria-busy, and a native button. A bad answer returns a div with a blue background.",
        detail: "Review the generated test, not just the component. Models often skip the loading announcement and the focus ring.",
        next: "Finally, turn the component into a documented, testable story.",
        ar: "البرومبت هنا هو معيار قبول: واجهة واضحة، حالات، إتاحة، قيود التوكنز، واختبارات. راجع الاختبار نفسه وليس المكون فقط.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "Prompt 06: <em>document with Storybook</em>",
      eyebrow: "AI prompt · stories",
      lead: "Generate stories, controls, a play function, and MDX guidance — in one pass.",
      dense: true,
      body: `
        <div class="prompt-layout">
          <div class="prompt-left">
            <div class="prompt-problem">
              <span class="label">Problem</span>
              <p>The Button has variants but no documented states, no interaction test, and no visual coverage.</p>
            </div>
            <div class="prompt-code">
              ${code(
                "text",
                `
Generate a CSF 3 story file for Button using @storybook/react-vite.

Include:
- Meta: title, component, default args.
- Stories: Primary, Secondary, Ghost, Loading, Disabled, Dark, RTL.
- ArgTypes: variant, size, isLoading, disabled.
- A play function that asserts keyboard focus and loading state.
- An MDX outline with usage, accessibility, do/don't.

Use realistic labels. Do not test class names or implementation details.
Explain how the stories map to Chromatic snapshots.
                `,
                "prompt.txt",
              )}
            </div>
          </div>
          <div class="prompt-right">
            <div class="card card--good">
              <h3>Expected output</h3>
              ${bullets([
                "A typed CSF 3 file.",
                "Seven meaningful states.",
                "A real interaction test.",
                "An MDX documentation outline.",
              ])}
            </div>
            <div class="card">
              <h3>Validate</h3>
              ${bullets([
                "Storybook builds cleanly.",
                "Controls change the story.",
                "A11y addon has no violations.",
                "Chromatic captures the states.",
              ])}
            </div>
            <div class="card card--bad">
              <h3>Common mistakes</h3>
              ${bullets([
                "One story for every variant.",
                "No dark mode or RTL.",
                "Testing class names.",
                "Unrealistic button labels.",
              ])}
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "A story file is documentation, test data, and visual coverage at the same time. Ask for the states that matter, not one generic story.",
        example: "Dark and RTL stories are especially important for a design system; they catch theme and logical-property mistakes early.",
        detail: "The play function should assert behavior a user can observe, not internal classes. Use accessible roles and labels.",
        next: "Here is the human workflow that surrounds all of these prompts.",
        ar: "ملف القصص هو توثيق واختبار وتغطية بصرية. اطلب الحالات المهمة مثل Dark وRTL، وليس قصة واحدة عامة.",
      },
    },

    {
      chapter: 8,
      chapterName: "AI-Assisted Development",
      title: "The AI <em>engineering loop</em>",
      eyebrow: "Workflow",
      lead: "AI accelerates the middle. Humans own the beginning and the end.",
      body: `
        <div class="split">
          <div class="vflow">
            <div class="vstep"><span class="vstep-num">01</span><div class="vstep-body"><strong>Understand the problem</strong><span>users, constraints, existing system</span></div><span class="vstep-tag">human</span></div>
            <div class="vstep"><span class="vstep-num">02</span><div class="vstep-body"><strong>Plan the approach</strong><span>options, trade-offs, acceptance criteria</span></div><span class="vstep-tag">AI + human</span></div>
            <div class="vstep"><span class="vstep-num">03</span><div class="vstep-body"><strong>Review the architecture</strong><span>boundaries, graph, tokens, dependencies</span></div><span class="vstep-tag">human</span></div>
            <div class="vstep"><span class="vstep-num">04</span><div class="vstep-body"><strong>Implement</strong><span>small diffs, typed code, tests</span></div><span class="vstep-tag">AI + human</span></div>
            <div class="vstep"><span class="vstep-num">05</span><div class="vstep-body"><strong>Test and validate</strong><span>unit, a11y, visual, build</span></div><span class="vstep-tag">automation</span></div>
            <div class="vstep"><span class="vstep-num">06</span><div class="vstep-body"><strong>Human review</strong><span>intent, security, maintainability</span></div><span class="vstep-tag">human</span></div>
            <div class="vstep"><span class="vstep-num">07</span><div class="vstep-body"><strong>Own it</strong><span>document, release, monitor</span></div><span class="vstep-tag">human</span></div>
          </div>
          <div class="stack">
            ${checks([
              "<strong>Give context.</strong> The repo structure, tokens, and constraints.",
              "<strong>Define acceptance criteria.</strong> Behavior, tests, and boundaries.",
              "<strong>Ask for evidence.</strong> Commands, diffs, and failure modes.",
              "<strong>Review the diff.</strong> Do not merge a generated wall of code.",
              "<strong>Protect secrets.</strong> No keys, customer data, or private tokens.",
            ], "checks--tight")}
            <div class="callout callout--rose">
              <span>!</span>
              <p><strong>AI is a force multiplier, not the architect.</strong> You still own the system, the review, and the consequences.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The loop has seven steps. AI is most useful in planning, drafting, and validation. Humans own the problem, the architecture, and the final review.",
        example: "A generated Button is not done until the tests pass, the a11y check is clean, the visual diff is reviewed, and a human understands the code.",
        detail: "Ask the model to show its assumptions and failure modes. The most dangerous output is confident code with hidden assumptions.",
        next: "Chapter 9 puts the whole system together.",
        ar: "الذكاء الاصطناعي يسرّع المنتصف، لكن الإنسان يملك الفهم والمعمار والمراجعة النهائية. لا تدمج كوداً لم تفهمه.",
      },
    },
  ]);
})();
