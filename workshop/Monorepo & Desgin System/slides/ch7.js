/* Chapter 7 — Storybook & Chromatic (slides 49–55) */

(() => {
  const { code, table, flow, bullets, checks, card, pill } = window.D;

  window.D.register([
    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      layout: "chapter",
      title: "Components deserve a <em>workshop</em>",
      lead: "Storybook is the development, documentation, and testing surface for the design system.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "01 · Isolation",
            title: "Build one state at a time",
            text: "Develop components without the whole application running.",
            className: "card--accent",
          })}
          ${card({
            kicker: "02 · Stories",
            title: "Every variant is a story",
            text: "Primary, secondary, loading, disabled, dark mode, RTL.",
          })}
          ${card({
            kicker: "03 · Controls",
            title: "Change props live",
            text: "Test edge cases from the controls panel, not by editing code.",
          })}
          ${card({
            kicker: "04 · Docs",
            title: "Usage and props",
            text: "Autodocs and MDX pages next to the component.",
          })}
          ${card({
            kicker: "05 · Accessibility",
            title: "A11y addon",
            text: "Catch contrast, labels, and semantic issues while developing.",
          })}
          ${card({
            kicker: "06 · Visual tests",
            title: "Chromatic snapshots",
            text: "Turn every story into a visual regression test.",
          })}
        </div>
      `,
      notes: {
        say: "Storybook is the workshop where components are built, documented, and tested in isolation. It is not just a demo site.",
        example: "A Button story can show every variant, size, loading state, dark theme, and RTL layout without booting the main app.",
        detail: "Stories should cover realistic states, not only the happy path. The a11y addon and Chromatic turn those states into checks.",
        next: "How does Storybook fit inside the monorepo?",
        ar: "Storybook هو ورشة المكونات: تطوير وعرض وتوثيق واختبار في عزلة عن التطبيق. كل حالة يجب أن تكون قصة قابلة للاختبار.",
      },
    },

    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      title: "Storybook is an <em>app</em>, not a package",
      eyebrow: "Monorepo placement",
      lead: "The docs app consumes the UI package. The UI package does not depend on Storybook.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">Dependency direction</span>
            <div class="graph-v" style="align-items:stretch">
              <div class="node" style="text-align:center"><strong>apps/storybook</strong><small>stories · MDX · addons · preview</small></div>
              <div class="arrow" style="text-align:center">↓ imports</div>
              <div class="node node--accent" style="text-align:center"><strong>@acme/ui</strong><small>components + styles.css</small></div>
              <div class="arrow" style="text-align:center">↓ uses</div>
              <div class="graph-h" style="align-items:stretch">
                <div class="node" style="flex:1;text-align:center"><strong>@acme/tokens</strong><small>CSS variables</small></div>
                <div class="node" style="flex:1;text-align:center"><strong>Radix</strong><small>behavior</small></div>
              </div>
            </div>
          </div>
          <div class="stack">
            ${code(
              "ts",
              `
              import type { StorybookConfig } from "@storybook/react-vite";

              const config: StorybookConfig = {
                stories: ["../stories/**/*.stories.@(ts|tsx)"],
                addons: [
                  "@storybook/addon-essentials",
                  "@storybook/addon-a11y"
                ],
                framework: {
                  name: "@storybook/react-vite",
                  options: {}
                }
              };

              export default config;
              `,
              "apps/storybook/.storybook/main.ts",
            )}
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>Keep stories out of the package.</strong> The package stays portable; the docs app owns the Storybook setup.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Storybook is an application because it consumes the UI package. That keeps the UI package independent of documentation tooling.",
        example: "apps/storybook imports @acme/ui and the compiled styles. The package itself has no Storybook dependency.",
        detail: "Some teams colocate stories with components. That is fine, but keep Storybook as a dev dependency and make sure the package still builds without it.",
        next: "Here is a complete Button story in CSF 3.",
        ar: "Storybook تطبيق يستهلك حزمة UI، وليس جزءاً من الحزمة. هذا يحافظ على قابلية نشر الحزمة دون أدوات التوثيق.",
      },
    },

    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      title: "A story is a <em>state</em>",
      eyebrow: "CSF 3",
      lead: "Meta defines the component. Named exports define the states you care about.",
      dense: true,
      body: `
        <div class="split split--wide">
          ${code(
            "tsx",
            `
            import type { Meta, StoryObj } from "@storybook/react-vite";
            import { Button } from "@acme/ui";

            const meta = {
              title: "Components/Button",
              component: Button,
              args: { children: "Button", variant: "primary", size: "md" },
              argTypes: {
                variant: {
                  control: "select",
                  options: ["primary", "secondary", "ghost"]
                },
                size: { control: "inline-radio", options: ["sm", "md", "lg"] },
                isLoading: { control: "boolean" }
              }
            } satisfies Meta<typeof Button>;

            export default meta;
            type Story = StoryObj<typeof meta>;

            export const Primary: Story = {};
            export const Secondary: Story = { args: { variant: "secondary" } };
            export const Loading: Story = { args: { isLoading: true } };
            `,
            "Button.stories.tsx",
          )}
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">Meta</span>
              <h3>Component contract</h3>
              <p>Title, component, default args, and the controls you want to expose.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Story</span>
              <h3>One meaningful state</h3>
              <p>Primary, secondary, loading, disabled, dark, RTL. Each story is a test case.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Controls</span>
              <h3>Safe exploration</h3>
              <p>Change props without editing code. Great for edge cases and review.</p>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Do not test implementation details.</strong> Stories should look like real usage, with realistic labels and content.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "A story is a state, not a screenshot. The meta defines the component and default args; each named export is one state you want to review and test.",
        example: "Primary, Secondary, and Loading are three stories. Add Disabled and RTL when those states matter for the component.",
        detail: "Use CSF 3 with satisfies Meta<typeof Button> for type safety. ArgTypes drive the controls panel and documentation.",
        next: "Stories handle examples. MDX handles the guidance.",
        ar: "القصة هي حالة محددة من المكون، وليست صورة ثابتة. Meta تعرّف المكون، وكل export يمثل حالة مثل Primary أو Loading.",
      },
    },

    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      title: "Documentation with <em>MDX</em>",
      eyebrow: "Guidance",
      lead: "Props are not enough. Teams need usage rules, accessibility notes, and do/don't examples.",
      body: `
        <div class="split split--wide">
          ${code(
            "mdx",
            `
            import { Meta, Canvas, Controls } from "@storybook/addon-docs/blocks";
            import * as ButtonStories from "./Button.stories";

            <Meta of={ButtonStories} />

            # Button

            Use Button for actions. Use Link for navigation.

            <Canvas of={ButtonStories.Primary} />
            <Controls of={ButtonStories.Primary} />

            ## Accessibility
            - Always provide a visible label.
            - Keep the focus ring visible.
            - Do not use a button for navigation.
            `,
            "Button.mdx",
          )}
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">What to document</span>
              ${bullets([
                "When to use the component, and when not to.",
                "Props, variants, and states.",
                "Keyboard and screen reader behavior.",
                "Do and don't examples.",
                "Related patterns and migration notes.",
              ], "bullets--tight")}
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Storybook 8 uses <code>@storybook/blocks</code>.</strong> Storybook 9/10 uses <code>@storybook/addon-docs/blocks</code>.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "MDX is where the design system teaches. Stories show the state; MDX explains when to use it, when not to, and what accessibility rules apply.",
        example: "A Button page should say: use Button for actions, Link for navigation, one primary action per view, and always keep a visible label.",
        detail: "The Doc Blocks import changed between Storybook versions. Match the import to the installed version instead of copying an old snippet.",
        next: "Now we turn those stories into visual regression tests.",
        ar: "MDX يشرح متى نستخدم المكوّن ومتى لا نستخدمه، مع قواعد الوصول والأمثلة. القصص تعرض الحالة، والتوثيق يشرح القرار.",
      },
    },

    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      title: "Chromatic: <em>see every change</em>",
      eyebrow: "Visual regression",
      lead: "Every story becomes a snapshot. Every snapshot becomes a reviewable change.",
      body: `
        <div class="split">
          <div class="stack">
            <div class="grid-2">
              ${card({ kicker: "01", title: "Publish Storybook", text: "A hosted preview for every build." })}
              ${card({ kicker: "02", title: "Capture snapshots", text: "Real browsers, every story, every viewport." })}
              ${card({ kicker: "03", title: "Diff the pixels", text: "Catch layout, color, font, and spacing changes." })}
              ${card({ kicker: "04", title: "Review + approve", text: "Accept intentional changes; block regressions." })}
            </div>
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>TurboSnap</strong> analyzes the dependency graph and tests only the stories affected by a change.</p>
            </div>
          </div>
          <div class="vr-grid">
            <div class="vr-panel">
              <div class="vr-head"><span>Baseline</span><span class="tag tag--green">approved</span></div>
              <div class="vr-canvas"><span class="vr-button">Save changes</span></div>
            </div>
            <div class="vr-panel vr-panel--current">
              <div class="vr-head"><span>Current</span><span class="tag tag--amber">changed</span></div>
              <div class="vr-canvas"><span class="vr-button">Save changes</span><div class="vr-diff"></div></div>
            </div>
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>Chromatic is not a screenshot service.</strong> It is a review workflow for visual decisions.</p>
        </div>
      `,
      notes: {
        say: "Chromatic turns every story into a visual test. The value is not the screenshot; it is the review workflow around the change.",
        example: "A button radius change from 8px to 12px shows up as a visual diff. The team approves it as intentional or rejects it as a regression.",
        detail: "Chromatic also supports interaction and accessibility tests. Start with visual snapshots, then add play functions and axe checks.",
        next: "Here is how Chromatic fits into GitHub Actions.",
        ar: "Chromatic يحوّل كل قصة إلى اختبار بصري. القيمة الحقيقية هي مراجعة الفرق: هل التغيير مقصود أم خطأ بصري؟",
      },
    },

    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      title: "Chromatic in <em>CI</em>",
      eyebrow: "GitHub Actions",
      lead: "Build Storybook, publish to Chromatic, and make visual changes reviewable.",
      dense: true,
      body: `
        <div class="split split--wide">
          ${code(
            "yaml",
            `
            name: Chromatic

            on:
              push:
              workflow_dispatch:

            jobs:
              chromatic:
                runs-on: ubuntu-latest
                steps:
                  - uses: actions/checkout@v4
                    with:
                      fetch-depth: 0
                  - uses: pnpm/action-setup@v4
                  - uses: actions/setup-node@v4
                    with:
                      node-version: 22
                      cache: pnpm
                  - run: pnpm install --frozen-lockfile
                  - run: pnpm build
                  - uses: chromaui/action@latest
                    with:
                      projectToken: \${{ secrets.CHROMATIC_PROJECT_TOKEN }}
                      onlyChanged: true
            `,
            ".github/workflows/chromatic.yml",
          )}
          <div class="stack">
            <div class="vflow">
              <div class="vstep"><span class="vstep-num">01</span><div class="vstep-body"><strong>Install</strong><span>frozen lockfile</span></div><span class="vstep-tag">auto</span></div>
              <div class="vstep"><span class="vstep-num">02</span><div class="vstep-body"><strong>Build</strong><span>tokens + UI + Storybook</span></div><span class="vstep-tag">auto</span></div>
              <div class="vstep"><span class="vstep-num">03</span><div class="vstep-body"><strong>Upload</strong><span>publish to Chromatic</span></div><span class="vstep-tag">auto</span></div>
              <div class="vstep"><span class="vstep-num">04</span><div class="vstep-body"><strong>Review</strong><span>accept or reject visual changes</span></div><span class="vstep-tag">human</span></div>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Chromatic recommends push builds</strong> for stable baselines. The GitHub app attaches the build and review to the pull request.</p>
            </div>
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>fetch-depth: 0</strong> is required for TurboSnap to compare against the correct baseline.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The workflow installs, builds, and uploads to Chromatic. The review happens in Chromatic's UI, linked to the commit and pull request.",
        example: "A token change rebuilds Storybook, Chromatic captures the affected stories, and the reviewer approves or rejects the visual diff.",
        detail: "Use onlyChanged: true to enable TurboSnap. Keep fetch-depth: 0 so Chromatic can compare the changed files against the baseline. The token is a repository secret.",
        next: "Let's look at what a visual diff actually tells the reviewer.",
        ar: "خط CI يبني Storybook ويرفعه إلى Chromatic. المراجعة بشرية، لكن المقارنة البصرية آلية. TurboSnap يحتاج تاريخ Git كاملاً.",
      },
    },

    {
      chapter: 7,
      chapterName: "Storybook & Chromatic",
      title: "What a <em>visual diff</em> catches",
      eyebrow: "Review workflow",
      lead: "The change is not always a bug. The point is that someone decides.",
      body: `
        <div class="vr-grid">
          <div class="vr-panel">
            <div class="vr-head"><span>Baseline · approved</span><span class="tag tag--green">main</span></div>
            <div class="vr-canvas"><span class="vr-button">Save changes</span></div>
          </div>
          <div class="vr-panel vr-panel--current">
            <div class="vr-head"><span>Current · PR</span><span class="tag tag--amber">3 px diff</span></div>
            <div class="vr-canvas"><span class="vr-button">Save changes</span><div class="vr-diff"></div></div>
          </div>
        </div>
        <div class="grid-3" style="margin-top:14px">
          <div class="card card--good">
            <span class="card-kicker">Approve</span>
            <h3>Intentional change</h3>
            <p>The new radius matches the design decision. Update the baseline.</p>
          </div>
          <div class="card card--bad">
            <span class="card-kicker">Reject</span>
            <h3>Regression</h3>
            <p>The change was accidental. Fix the component or the token, not the snapshot.</p>
          </div>
          <div class="card card--accent">
            <span class="card-kicker">Investigate</span>
            <h3>Unexplained diff</h3>
            <p>Check fonts, viewport, theme, and browser differences before approving.</p>
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>Never approve blindly.</strong> A visual diff is a design review, not a formality.</p>
        </div>
      `,
      notes: {
        say: "A visual diff is a question, not a verdict. It asks: did we mean to change this? Approve intentional changes; reject regressions.",
        example: "A button radius change is intentional. A random 3px shift caused by a font fallback is a regression.",
        detail: "Chromatic uses real browsers. Fonts, viewport, theme, and animation timing can all create noise. Stabilize the environment before blaming the component.",
        next: "Chapter 8 adds AI to the workflow, with a human review gate.",
        ar: "الفرق البصري سؤال وليس حكماً. وافق على التغيير المقصود، وارفض الانحدار غير المقصود. لا توافق على لقطة دون فهم سبب الاختلاف.",
      },
    },
  ]);
})();
