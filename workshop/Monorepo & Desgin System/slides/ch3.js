/* Chapter 3 — Design System Fundamentals (slides 21–27) */

(() => {
  const { code, table, bullets, checks, card, pill } = window.D;

  window.D.register([
    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      layout: "chapter",
      title: "Inconsistent UI is a <em>system problem</em>",
      lead: "Four applications. Four buttons. Four definitions of “primary”. This is not a styling bug.",
      body: `
        <div class="grid-4">
          <div class="card">
            <span class="card-kicker">Web</span>
            <h3>Primary</h3>
            <div style="margin:12px 0 10px"><span class="vr-button" style="background:#2563eb;border-radius:8px">Save changes</span></div>
            <p class="mono" style="font-size:8.5px">#2563eb · 8px</p>
          </div>
          <div class="card">
            <span class="card-kicker">Admin</span>
            <h3>Primary</h3>
            <div style="margin:12px 0 10px"><span class="vr-button" style="background:#4f46e5;border-radius:4px">Save changes</span></div>
            <p class="mono" style="font-size:8.5px">#4f46e5 · 4px</p>
          </div>
          <div class="card">
            <span class="card-kicker">Mobile</span>
            <h3>Primary</h3>
            <div style="margin:12px 0 10px"><span class="vr-button" style="background:#7c3aed;border-radius:999px">Save</span></div>
            <p class="mono" style="font-size:8.5px">#7c3aed · pill</p>
          </div>
          <div class="card">
            <span class="card-kicker">Marketing</span>
            <h3>Primary</h3>
            <div style="margin:12px 0 10px"><span class="vr-button" style="background:#0891b2;border-radius:2px">Save</span></div>
            <p class="mono" style="font-size:8.5px">#0891b2 · 2px</p>
          </div>
        </div>
        <div class="grid-3" style="margin-top:14px">
          <div class="card card--bad">
            <span class="card-kicker">Question 01</span>
            <h3>Which one is correct?</h3>
            <p>Nobody can answer without a shared source of truth.</p>
          </div>
          <div class="card card--warn">
            <span class="card-kicker">Question 02</span>
            <h3>Who decides?</h3>
            <p>Design, frontend, or the team that shipped last?</p>
          </div>
          <div class="card card--accent">
            <span class="card-kicker">Question 03</span>
            <h3>How do we ship the fix?</h3>
            <p>One component change should reach every app.</p>
          </div>
        </div>
        <div class="callout callout--rose" style="margin-top:12px">
          <span>!</span>
          <p><strong>The cost:</strong> rework, accessibility gaps, slow onboarding, and a brand that changes by team.</p>
        </div>
      `,
      notes: {
        say: "Start with the visible symptom: four apps, four primary buttons. The problem is not that someone chose the wrong blue; the problem is that there is no shared system for deciding.",
        example: "Ask the audience which button is correct. The room usually disagrees, which proves the point better than any slide.",
        detail: "This is also an accessibility problem: contrast, focus rings, disabled states, and touch targets drift when each app owns its own implementation.",
        next: "So what exactly is a design system, beyond a component library?",
        ar: "أربعة تطبيقات بأربعة أزرار مختلفة ليست مشكلة ألوان فقط، بل غياب مصدر قرار مشترك. السؤال الحقيقي: من يملك القرار وكيف يصل إلى كل تطبيق؟",
      },
    },

    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      title: "More than a <em>component library</em>",
      eyebrow: "Definition",
      lead: "A design system is a product, a contract, and an operating model.",
      body: `
        <div class="split split--wide">
          <div class="card card--accent" style="min-height:290px;justify-content:center">
            <span class="card-kicker">The system</span>
            <h3 style="font-size:27px;line-height:1.05">One language for design and code.</h3>
            <p style="font-size:11.5px;margin-top:9px">Tokens carry decisions. Components carry behavior. Documentation carries adoption. Governance keeps it alive.</p>
            <div style="margin-top:12px" class="row">
              <span class="pill pill--accent">Figma</span>
              <span class="pill pill--cyan">Code</span>
              <span class="pill pill--green">Docs</span>
            </div>
            <div class="graph-h" style="justify-content:flex-start;gap:5px;margin-top:16px">
              <span class="node" style="padding:5px 8px">Figma</span>
              <span class="arrow">→</span>
              <span class="node node--accent" style="padding:5px 8px">Tokens</span>
              <span class="arrow">→</span>
              <span class="node" style="padding:5px 8px">Components</span>
              <span class="arrow">→</span>
              <span class="node" style="padding:5px 8px">Apps</span>
            </div>
          </div>

          <div class="grid-2" style="gap:9px">
            ${card({ kicker: "01", title: "Design tokens", text: "Color, type, space, radius, shadow, motion." })}
            ${card({ kicker: "02", title: "Components", text: "Accessible React building blocks with variants and states." })}
            ${card({ kicker: "03", title: "Guidelines", text: "When to use a pattern, and when not to." })}
            ${card({ kicker: "04", title: "Accessibility", text: "Keyboard, focus, contrast, semantics, and tests." })}
            ${card({ kicker: "05", title: "Documentation", text: "Storybook, examples, props, and usage notes." })}
            ${card({ kicker: "06", title: "Governance", text: "Ownership, contribution, review, and release process." })}
          </div>
        </div>
        <div class="callout" style="margin-top:12px">
          <span>→</span>
          <p><strong>If it only lives in Figma, it is a style guide. If it only lives in code, it is a UI library.</strong> A design system connects both.</p>
        </div>
      `,
      notes: {
        say: "A design system is more than a component library. It includes tokens, components, guidelines, accessibility, documentation, and governance. The last two are what keep it from decaying.",
        example: "The reference design system has tokens, nine React components, Storybook docs, accessibility tests, and a contribution flow through changesets and CI.",
        detail: "Governance does not mean bureaucracy. It means a clear owner, a review path, and a release process that consumers can trust.",
        next: "Let's separate the output from the operating model.",
        ar: "نظام التصميم ليس مكتبة مكونات فقط. هو توكنز ومكونات وإرشادات وإتاحة وتوثيق وحوكمة. بدون الحوكمة، يتحول النظام إلى مكتبة قديمة بعد أشهر.",
      },
    },

    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      title: "UI library <em>vs.</em> design system",
      eyebrow: "Comparison",
      lead: "A UI library is an output. A design system is the operating model around it.",
      body: `
        ${table(
          ["Scope", "UI library", "Design system"],
          [
            ["Scope", "Components", "Components + tokens + guidelines"],
            ["Tokens", "Rarely", "Required, versioned, themeable"],
            ["Documentation", "Props and examples", "Usage, principles, accessibility, do/don't"],
            ["Accessibility", "Per component", "Standard, tests, and review"],
            ["Governance", "Usually none", "Ownership + contribution process"],
            ["Testing", "Unit tests", "Unit + visual + accessibility"],
            ["Adoption", "Install the package", "Onboarding, support, and migration"],
          ],
          { cols: "0.8fr 1fr 1.25fr", compact: true, accentCol: 2 },
        )}
        <div class="grid-2" style="margin-top:12px">
          <div class="card card--warn">
            <span class="card-kicker">A UI library answers</span>
            <p>“What component can I import?”</p>
          </div>
          <div class="card card--good">
            <span class="card-kicker">A design system answers</span>
            <p>“What is the right decision, how do I use it, and who keeps it healthy?”</p>
          </div>
        </div>
      `,
      notes: {
        say: "A UI library gives you components. A design system gives you decisions, documentation, accessibility, governance, and a way to evolve.",
        example: "You can install Material UI and still build an inconsistent product if you have no token or usage guidance. The library is not the system.",
        detail: "The comparison is not about quality. A UI library can be excellent. The scope is simply smaller.",
        next: "Why is the broader scope worth the investment?",
        ar: "مكتبة الواجهات تعطيك مكونات جاهزة، لكن نظام التصميم يعطيك قرارات وتوثيقاً وحوكمة. يمكن استخدام مكتبة ممتازة وبناء منتج غير متسق إذا غابت القرارات.",
      },
    },

    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      title: "Six reasons the system <em>pays back</em>",
      eyebrow: "Benefits",
      lead: "The return is measured in consistency, speed, and fewer repeated decisions.",
      body: `
        <div class="grid-3">
          ${card({
            kicker: "01 · Consistency",
            title: "One visual language",
            text: "Every app uses the same tokens and component behavior. Brand changes propagate.",
            className: "card--accent",
          })}
          ${card({
            kicker: "02 · Reuse",
            title: "Build once",
            text: "A dialog, select, or focus trap is solved once and reused everywhere.",
          })}
          ${card({
            kicker: "03 · Accessibility",
            title: "Better defaults",
            text: "Keyboard, focus, contrast, and semantics are tested at the system level.",
          })}
          ${card({
            kicker: "04 · Speed",
            title: "Less decision fatigue",
            text: "Teams compose proven patterns instead of inventing a new button.",
          })}
          ${card({
            kicker: "05 · Maintenance",
            title: "One upgrade path",
            text: "A dependency or token change lands in one place, not five repos.",
          })}
          ${card({
            kicker: "06 · Collaboration",
            title: "Shared vocabulary",
            text: "Designers and engineers use the same token and component names.",
          })}
        </div>
        <div class="callout callout--green" style="margin-top:12px">
          <span>✓</span>
          <p><strong>The compounding effect:</strong> every new app starts from the system instead of from zero.</p>
        </div>
      `,
      notes: {
        say: "The benefits compound. The first app costs more because you are building the system; the fifth app costs much less because the decisions already exist.",
        example: "A new admin screen can use the same Card, Input, Select, and Dialog as the customer app, with the same keyboard behavior and tokens.",
        detail: "Track adoption, not just usage: how many apps consume the package, how many raw hex values remain, and how long onboarding takes.",
        next: "Should you build all of this yourself? Sometimes not.",
        ar: "الفائدة تتراكم مع كل تطبيق جديد. التطبيق الأول يدفع تكلفة بناء النظام، والتطبيقات التالية تستفيد من القرارات والمكونات الموجودة.",
      },
    },

    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      title: "Build, buy, or <em>compose</em>",
      eyebrow: "Build vs buy",
      lead: "The real choice is not “custom vs library”. It is how much behavior you want to own.",
      body: `
        ${table(
          ["", "Custom", "Radix", "shadcn/ui", "MUI"],
          [
            ["Control", "Maximum", "High", "High", "Medium"],
            ["Accessibility", "You own it", "Strong primitives", "Strong primitives", "Built in"],
            ["Styling", "Fully custom", "Unstyled", "Tailwind + tokens", "Material theme"],
            ["Speed", "Slowest", "Medium", "Fast", "Fastest"],
            ["Maintenance", "Highest", "Behavior only", "You own the code", "Vendor upgrades"],
            ["Best for", "Unique product", "Custom system", "Tailwind teams", "Material products"],
          ],
          { cols: "0.7fr 1fr 1fr 1fr 1fr", compact: true, accentCol: 2 },
        )}
        <div class="grid-2" style="margin-top:12px">
          <div class="card card--good">
            <span class="card-kicker">Our choice</span>
            <h3>Radix primitives + our tokens</h3>
            <p>Radix owns behavior and accessibility. We own the API, styling, and composition.</p>
          </div>
          <div class="card card--warn">
            <span class="card-kicker">Do not do this</span>
            <h3>Wrap a full design language blindly</h3>
            <p>If the library's visual language fights your brand, every override becomes a new maintenance surface.</p>
          </div>
        </div>
      `,
      notes: {
        say: "Build vs buy is a spectrum. Radix gives us the hard behavior without imposing a visual language. That is the middle path we want.",
        example: "A Dialog needs focus trapping, Escape handling, ARIA announcements, and scroll locking. Radix solves those; we add tokens, animation, and the close button.",
        detail: "shadcn/ui is not a dependency in the traditional sense; it is code you copy into your repo. That gives control but transfers maintenance to you.",
        next: "Why Radix specifically?",
        ar: "الخيار ليس بين بناء كل شيء أو استخدام مكتبة كاملة. Radix يوفّر السلوك وإمكانية الوصول، ونحن نملك التصميم والواجهة العامة.",
      },
    },

    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      title: "Why <em>Radix</em> primitives?",
      eyebrow: "Foundation",
      lead: "Accessibility is the feature you cannot see until it is missing.",
      body: `
        <div class="split">
          <div class="stack">
            ${checks([
              "<strong>Accessible by default</strong> — WAI-ARIA patterns and screen reader announcements.",
              "<strong>Keyboard navigation</strong> — arrows, Escape, Tab, Enter, typeahead.",
              "<strong>Focus management</strong> — trap, restore, and move focus correctly.",
              "<strong>Unstyled</strong> — no visual opinion; your tokens define the look.",
              "<strong>Composable</strong> — Root, Trigger, Portal, Content, Close.",
              "<strong>Controllable</strong> — open state can be controlled or uncontrolled.",
            ], "checks--tight")}
            <div class="callout callout--green">
              <span>✓</span>
              <p><strong>The rule:</strong> Radix owns behavior. We own the design system contract.</p>
            </div>
          </div>
          <div class="stack">
            ${code(
              "tsx",
              `
              import * as Dialog from "@radix-ui/react-dialog";

              export function ConfirmDialog() {
                return (
                  <Dialog.Root>
                    <Dialog.Trigger>Delete</Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay />
                      <Dialog.Content>
                        <Dialog.Title>Delete project?</Dialog.Title>
                        <Dialog.Description>This cannot be undone.</Dialog.Description>
                        <Dialog.Close>Cancel</Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                );
              }
              `,
              "ConfirmDialog.tsx",
            )}
          </div>
        </div>
      `,
      notes: {
        say: "Radix is valuable because accessibility is hard. Focus trapping, screen reader announcements, and keyboard behavior are not things most teams should reimplement for every component.",
        example: "Try a Dialog with only a keyboard: Tab cycles inside, Escape closes, and focus returns to the trigger. Radix handles that for free.",
        detail: "Radix now also publishes a unified radix-ui package. The scoped packages such as @radix-ui/react-dialog remain common and are what we use here.",
        next: "Here is how the layers fit together.",
        ar: "Radix يوفّر السلوك الصعب: إدارة التركيز، لوحة المفاتيح، وسمات ARIA. نحن نضيف التصميم والتوكنز والواجهة العامة، فلا نعيد اختراع الأساسيات.",
      },
    },

    {
      chapter: 3,
      chapterName: "Design System Fundamentals",
      title: "The Radix <em>architecture</em>",
      eyebrow: "Layers",
      lead: "Behavior comes from Radix. Style comes from tokens. The component is the seam.",
      body: `
        <div class="split">
          <div class="diagram-box">
            <span class="diagram-label">One component, three responsibilities</span>
            <div class="graph-v" style="align-items:stretch">
              <div class="node" style="text-align:center"><strong>Application</strong><small>uses the design system API</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="node node--accent" style="text-align:center"><strong>@acme/ui Dialog</strong><small>API + composition + styles</small></div>
              <div class="arrow" style="text-align:center">↓</div>
              <div class="graph-h" style="align-items:stretch">
                <div class="node node--cyan" style="flex:1;text-align:center"><strong>Radix Dialog</strong><small>behavior + accessibility</small></div>
                <div class="node" style="flex:1;text-align:center"><strong>Tokens</strong><small>surface, overlay, radius</small></div>
              </div>
            </div>
            <div class="divider" style="margin:12px 0"></div>
            <div class="row row--between"><span class="dim" style="font-size:8.5px">Radix owns</span><span class="mono accent" style="font-size:8px">focus · Escape · ARIA · portal</span></div>
            <div class="row row--between" style="margin-top:4px"><span class="dim" style="font-size:8.5px">DS owns</span><span class="mono accent" style="font-size:8px">API · tokens · animation · docs</span></div>
          </div>
          <div class="stack">
            ${code(
              "tsx",
              `
              const DialogContent = React.forwardRef<
                React.ElementRef<typeof DialogPrimitive.Content>,
                React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
              >(({ className, children, ...props }, ref) => (
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="fixed inset-0 bg-overlay" />
                  <DialogPrimitive.Content
                    ref={ref}
                    className={cn("fixed left-1/2 top-1/2 bg-surface-raised", className)}
                    {...props}
                  >
                    {children}
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              ));
              `,
              "dialog-content.tsx",
            )}
          </div>
        </div>
        <div class="callout" style="margin-top:10px">
          <span>→</span>
          <p><strong>Never reimplement the behavior.</strong> Compose the primitive, add your contract, and document the difference.</p>
        </div>
      `,
      notes: {
        say: "This is the architecture in one picture. Radix provides behavior and accessibility. Tokens provide style decisions. The design system component is the seam that exposes a stable API.",
        example: "DialogContent portals into the body, renders an overlay, applies token-based classes, and forwards the ref. The app does not need to know how focus trapping works.",
        detail: "Keep the primitive parts available for advanced composition, but make the common path simple and safe.",
        next: "Chapter 4 goes deeper into the foundation: design tokens.",
        ar: "المكوّن الواحد يجمع ثلاث مسؤوليات: السلوك من Radix، التصميم من التوكنز، والواجهة العامة من نظام التصميم. التطبيق يرى واجهة واحدة بسيطة.",
      },
    },
  ]);
})();
