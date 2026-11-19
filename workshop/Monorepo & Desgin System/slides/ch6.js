/* Chapter 6 — Building the Design System Package (slides 42–48) */

(() => {
  const { code, table, bullets, checks, card, pill } = window.D;

  window.D.register([
    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      layout: "chapter",
      title: "The UI package is <em>the product</em>",
      lead: "A small, typed, accessible API with tokens as the styling source.",
      body: `
        <div class="split split--wide">
          ${code(
            "bash",
            `
            packages/ui/
            ├── src/
            │   ├── components/
            │   │   ├── button/
            │   │   ├── dialog/
            │   │   └── input/
            │   ├── hooks/
            │   ├── utils/
            │   └── index.ts
            ├── package.json
            ├── tsconfig.json
            └── tsup.config.ts
            `,
            "packages/ui/",
          )}
          <div class="stack">
            ${card({
              kicker: "01 · Public API",
              title: "Small and stable",
              text: "Export components and types through one entry point. Keep internals private.",
              className: "card--accent",
            })}
            ${card({
              kicker: "02 · Behavior",
              title: "Accessible by construction",
              text: "Radix primitives for keyboard, focus, and ARIA. Tests for the contract.",
            })}
            ${card({
              kicker: "03 · Styling",
              title: "Tokens, not values",
              text: "Component classes map to semantic and component tokens. No raw hex.",
            })}
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>The package is the product.</strong> Apps consume it; they do not copy code out of it.</p>
        </div>
      `,
      notes: {
        say: "The UI package is a product with a public API. The folder structure is less important than the contract: what is exported, what is private, and what is tested.",
        example: "The reference UI package exports Button, Input, Label, Checkbox, Badge, Card, Dialog, Select, and Tabs, plus the compiled stylesheet.",
        detail: "Keep hooks and utilities internal unless there is a real consumer. Every additional export is a compatibility promise.",
        next: "Here is how the package fits into the overall architecture.",
        ar: "حزمة الواجهة هي المنتج: لها واجهة عامة صغيرة، وسلوك يمكن اختباره، وتصميم مبني على التوكنز. التطبيقات تستهلكها ولا تنسخ كودها.",
      },
    },

    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      title: "One-way <em>dependency flow</em>",
      eyebrow: "Architecture",
      lead: "Apps depend on UI. UI depends on Radix and tokens. Dependencies never point back.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">Dependency direction</span>
            <div class="graph-v" style="align-items:stretch">
              <div class="node" style="text-align:center"><strong>Applications</strong><small>web · admin · storybook</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="node node--accent" style="text-align:center"><strong>@acme/ui</strong><small>Button · Dialog · Input</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="graph-h" style="align-items:stretch">
                <div class="node node--cyan" style="flex:1;text-align:center"><strong>Radix primitives</strong><small>behavior + a11y</small></div>
                <div class="node" style="flex:1;text-align:center"><strong>@acme/tokens</strong><small>CSS variables + theme</small></div>
                <div class="node" style="flex:1;text-align:center"><strong>@acme/utils</strong><small>cn() · shared TS</small></div>
              </div>
            </div>
          </div>
          <div class="stack">
            ${checks([
              "<strong>Apps never import apps.</strong> Deployables are leaves.",
              "<strong>UI never imports an app.</strong> Packages do not know who consumes them.",
              "<strong>UI can depend on tokens and primitives.</strong> That is the shared layer.",
              "<strong>Tokens never import UI.</strong> The source of truth is independent.",
            ], "checks--tight")}
            <div class="callout callout--rose">
              <span>!</span>
              <p><strong>A cycle is an architecture bug.</strong> If UI imports an app, extract the shared piece into a package.</p>
            </div>
            <div class="card card--accent">
              <span class="card-kicker">The test</span>
              <p>Can you build UI without building an app? If not, the dependency direction is wrong.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "The dependency flow is one-way. Apps consume UI; UI consumes primitives, tokens, and utilities. Nothing points back to an app.",
        example: "Storybook is an app because it consumes UI. UI does not import Storybook. That keeps the package portable.",
        detail: "A package should be buildable in isolation. If it needs an app to compile, the boundary is leaking.",
        next: "Let's build the most important component: Button.",
        ar: "اتجاه الاعتماديات واحد: التطبيقات تعتمد على UI، وUI يعتمد على Radix والتوكنز. لا تعتمد الحزمة على تطبيق، وإلا فقدت قابليتها للنقل.",
      },
    },

    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      title: "A Button with a <em>real API</em>",
      eyebrow: "Component",
      lead: "Variants, sizes, states, and accessibility — with tokens doing the styling.",
      dense: true,
      body: `
        <div class="split split--wide">
          ${code(
            "tsx",
            `
            const button = cva("inline-flex items-center justify-center rounded-md", {
              variants: {
                variant: {
                  primary: "bg-action-primary text-action-primary-foreground",
                  secondary: "bg-surface-raised text-text-primary border",
                  ghost: "bg-transparent hover:bg-surface-muted",
                },
                size: { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6" },
              },
              defaultVariants: { variant: "primary", size: "md" },
            });

            export interface ButtonProps
              extends React.ButtonHTMLAttributes<HTMLButtonElement>,
                VariantProps<typeof button> {
              isLoading?: boolean;
            }

            export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
              ({ variant, size, isLoading, ...props }, ref) => (
                <button
                  ref={ref}
                  className={button({ variant, size })}
                  aria-busy={isLoading || undefined}
                  disabled={isLoading}
                  {...props}
                />
              ),
            );
            `,
            "button.tsx",
          )}
          <div class="stack">
            <div class="card card--accent">
              <span class="card-kicker">API</span>
              <h3>Small, typed, obvious</h3>
              <p><code>variant</code>, <code>size</code>, <code>isLoading</code>, plus every native button prop.</p>
            </div>
            <div class="card">
              <span class="card-kicker">States</span>
              <p>Default, hover, focus-visible, disabled, and loading. Each state has a token-backed style.</p>
            </div>
            <div class="card">
              <span class="card-kicker">Accessibility</span>
              <p>Native <code>&lt;button&gt;</code>, <code>aria-busy</code>, a visible focus ring, and no clickable divs.</p>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Do not hide the native element.</strong> A Button should still be a button to the browser and the screen reader.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "This Button has a small API: variant, size, loading, and all native button props. The styling is a map from variants to token classes.",
        example: "Primary uses action-primary and its foreground; secondary uses surface-raised and text-primary; ghost uses transparent with a hover surface.",
        detail: "CVA produces static class strings, which Tailwind can see at build time. Never build class names dynamically.",
        next: "Let's make the token connection explicit.",
        ar: "الزر له واجهة صغيرة وواضحة: variant وsize وisLoading مع خصائص الزر الأصلية. التصميم يأتي من أصناف مبنية على التوكنز.",
      },
    },

    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      title: "From raw values to <em>token classes</em>",
      eyebrow: "Token usage",
      lead: "The component API stays the same. The values become decisions.",
      body: `
        <div class="grid-2">
          <div class="stack">
            <div class="row row--between"><span class="tag tag--rose">Avoid</span><span class="mono dim" style="font-size:8px">raw palette + raw value</span></div>
            ${code(
              "tsx",
              `
              <button className="
                bg-blue-600
                text-white
                rounded-lg
                px-4 py-2
              ">
                Save
              </button>
              `,
              "button-usage.tsx",
            )}
          </div>
          <div class="stack">
            <div class="row row--between"><span class="tag tag--green">Prefer</span><span class="mono dim" style="font-size:8px">semantic + component tokens</span></div>
            ${code(
              "tsx",
              `
              <button className="
                bg-action-primary
                text-action-primary-foreground
                rounded-md
                px-4 py-2
              ">
                Save
              </button>
              `,
              "button-usage.tsx",
            )}
          </div>
        </div>
        ${table(
          ["Raw utility", "Token utility", "Decision"],
          [
            ["<code>bg-blue-600</code>", "<code>bg-action-primary</code>", "Primary action color"],
            ["<code>text-white</code>", "<code>text-action-primary-foreground</code>", "Contrast on primary"],
            ["<code>rounded-lg</code>", "<code>rounded-md</code>", "Component radius"],
            ["<code>px-4 py-2</code>", "<code>px-4 py-2</code>", "Layout, not a decision"],
          ],
          { cols: "1fr 1.5fr 1.15fr", compact: true, accentCol: 1 },
        )}
        <div class="callout" style="margin-top:10px">
          <span>→</span>
          <p><strong>Not every utility needs a token.</strong> Tokenize decisions; keep layout utilities in the component.</p>
        </div>
      `,
      notes: {
        say: "This is the practical test for a component: can you explain every color and radius without naming a raw value? Layout utilities can stay as utilities.",
        example: "bg-blue-600 is a palette step. bg-action-primary is a role. The second one survives a rebrand and a dark theme.",
        detail: "If a token is missing, add it to the right tier. Do not bypass the system with a one-off arbitrary value.",
        next: "The same principle applies to complex behavior, such as Dialog.",
        ar: "نستبدل قيم اللوحة الخام بأسماء دلالية. المسافات والتخطيط يمكن أن تبقى utility عادية، لكن القرارات اللونية والحدود يجب أن تكون توكنز.",
      },
    },

    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      title: "Dialog: <em>compose the primitive</em>",
      eyebrow: "Radix composition",
      lead: "Radix owns the hard behavior. The design system owns the API, styling, and docs.",
      dense: true,
      body: `
        <div class="split split--wide">
          ${code(
            "tsx",
            `
            import * as DialogPrimitive from "@radix-ui/react-dialog";
            import { cn } from "@acme/ui/utils";

            export const Dialog = DialogPrimitive.Root;
            export const DialogTrigger = DialogPrimitive.Trigger;

            export const DialogContent = React.forwardRef<
              React.ElementRef<typeof DialogPrimitive.Content>,
              React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
            >(({ className, children, ...props }, ref) => (
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-overlay" />
                <DialogPrimitive.Content
                  ref={ref}
                  className={cn("fixed left-1/2 top-1/2 w-full max-w-lg bg-surface-raised", className)}
                  {...props}
                >
                  {children}
                  <DialogPrimitive.Close aria-label="Close">×</DialogPrimitive.Close>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            ));
            `,
            "dialog.tsx",
          )}
          <div class="stack">
            ${table(
              ["Radix owns", "DS owns"],
              [
                ["Focus trap", "Surface + overlay tokens"],
                ["Escape to close", "Animation + radius"],
                ["ARIA announcements", "Close button"],
                ["Portal + scroll lock", "Public API + docs"],
              ],
              { cols: "1fr 1fr", compact: true, accentCol: 1 },
            )}
            <div class="card card--accent">
              <span class="card-kicker">Parts</span>
              <p><code>Root</code>, <code>Trigger</code>, <code>Portal</code>, <code>Overlay</code>, <code>Content</code>, <code>Title</code>, <code>Description</code>, <code>Close</code>.</p>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Always include Title and Description.</strong> If the visual title is hidden, use a visually hidden primitive.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Dialog is the perfect example of composition. Radix handles focus, Escape, ARIA, portal, and scroll lock. We handle tokens, animation, and the close button.",
        example: "DialogContent portals into the body, renders an overlay with bg-overlay, and a content surface with bg-surface-raised.",
        detail: "Title and Description are not optional for accessibility. If the design has no visible title, keep it visually hidden rather than removing it.",
        next: "How do we declare these dependencies in the package manifest?",
        ar: "Dialog يوضح الفصل بين المسؤوليات: Radix يدير التركيز وEscape وARIA، ونظام التصميم يدير التوكنز والحركة والواجهة العامة.",
      },
    },

    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      title: "Dependencies that <em>make sense</em>",
      eyebrow: "Package dependencies",
      lead: "Runtime dependencies, peer dependencies, and build-time dependencies are different contracts.",
      body: `
        ${table(
          ["Field", "What belongs there", "Example"],
          [
            ["dependencies", "Runtime packages the UI imports", "Radix, clsx, tailwind-merge"],
            ["peerDependencies", "Provided by the consumer", "react, react-dom"],
            ["devDependencies", "Build, test, and token build inputs", "@acme/tokens, tsup, vitest"],
            ["workspace:*", "Local package, never a registry version", "@acme/tokens"],
            ["exports", "Public entry points only", ". and ./styles.css"],
          ],
          { cols: "0.85fr 1.4fr 1.2fr", compact: true, accentCol: 2 },
        )}
        <div class="split" style="margin-top:12px">
          ${code(
            "json",
            `
            {
              "dependencies": {
                "@radix-ui/react-dialog": "^1.1.0",
                "clsx": "^2.1.1"
              },
              "peerDependencies": {
                "react": "^18 || ^19",
                "react-dom": "^18 || ^19"
              },
              "devDependencies": {
                "@acme/tokens": "workspace:*",
                "tsup": "^8.0.0"
              }
            }
            `,
            "packages/ui/package.json",
          )}
          <div class="stack">
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>React is a peer dependency.</strong> The app owns the React version; the UI package does not ship a second copy.</p>
            </div>
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>@acme/tokens can be a devDependency</strong> when it is only consumed at build time. Make it a dependency if runtime JS imports it.</p>
            </div>
            <div class="card card--accent">
              <span class="card-kicker">The rule</span>
              <p>If the consumer must provide it, use a peer dependency. If the package imports it at runtime, use a dependency.</p>
            </div>
          </div>
        </div>
      `,
      notes: {
        say: "Dependency type is a contract. React is a peer because the app owns it. Radix is a runtime dependency. Tokens can be a build-time dependency if the CSS is precompiled.",
        example: "A UI package that ships its own React copy creates duplicate context and broken hooks. A peer dependency avoids that.",
        detail: "Use workspace:* for internal packages. It guarantees the local source is used and prevents accidental registry versions.",
        next: "A package is only useful if it is safe to publish and consume.",
        ar: "نوع الاعتمادية عقد: React يجب أن يكون peer لأن التطبيق يملكه، وRadix اعتمادية وقت تشغيل، والتوكنز قد تكون وقت بناء فقط.",
      },
    },

    {
      chapter: 6,
      chapterName: "Building the Design System Package",
      title: "Production-ready <em>package</em>",
      eyebrow: "Distribution",
      lead: "TypeScript, ESM, exports, CSS, peer dependencies, and a clean build output.",
      body: `
        <div class="grid-2">
          <div class="stack">
            ${checks([
              "<strong>Type declarations</strong> — dist/*.d.ts.",
              "<strong>ESM output</strong> — modern bundlers and tree shaking.",
              "<strong>exports map</strong> — one public entry per capability.",
              "<strong>CSS side effects</strong> — sideEffects includes **/*.css.",
              "<strong>Peer dependencies</strong> — no duplicate React.",
              "<strong>CSS distribution</strong> — a compiled styles.css.",
            ], "checks--tight")}
            <div class="callout callout--amber">
              <span>!</span>
              <p><strong>Do not publish src/.</strong> Publish the build output, types, and the documented CSS entry.</p>
            </div>
          </div>
          ${code(
            "json",
            `
            {
              "type": "module",
              "sideEffects": ["**/*.css"],
              "files": ["dist"],
              "exports": {
                ".": {
                  "types": "./dist/index.d.ts",
                  "import": "./dist/index.js"
                },
                "./styles.css": "./dist/styles.css"
              },
              "peerDependencies": {
                "react": "^18 || ^19",
                "react-dom": "^18 || ^19"
              }
            }
            `,
            "packages/ui/package.json",
          )}
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>Consumers import two things:</strong> the component API and the compiled stylesheet. Nothing else is public.</p>
        </div>
      `,
      notes: {
        say: "Production-ready means the package is predictable to consume: types resolve, ESM works, CSS is explicit, and React is not duplicated.",
        example: "A consumer writes `import { Button } from '@acme/ui'` and `import '@acme/ui/styles.css'`. No Tailwind config required if the CSS is precompiled.",
        detail: "Keep sideEffects accurate. If CSS is marked side-effect-free, bundlers may drop the stylesheet.",
        next: "Chapter 7 gives the system a workshop: Storybook.",
        ar: "الحزمة الجاهزة للإنتاج تحتاج تعريفات TypeScript وESM وخريطة exports وCSS مجمّع وReact كـ peer dependency. هذه هي واجهة الاستهلاك.",
      },
    },
  ]);
})();
