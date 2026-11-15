import * as React from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";

type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

const swatches = [
  { name: "surface.canvas", value: "var(--ds-semantic-color-surface-canvas)" },
  { name: "surface.raised", value: "var(--ds-semantic-color-surface-raised)" },
  { name: "accent.solid", value: "var(--ds-semantic-color-accent-solid)" },
  { name: "danger.solid", value: "var(--ds-semantic-color-danger-solid)" },
  { name: "success.solid", value: "var(--ds-semantic-color-success-solid)" },
  { name: "warning.solid", value: "var(--ds-semantic-color-warning-solid)" },
];

export function App(): React.JSX.Element {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [direction, setDirection] = React.useState<Direction>("ltr");

  React.useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = theme;
    root.dir = direction;
    root.lang = direction === "rtl" ? "ar" : "en";
  }, [theme, direction]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">@repo/ui</p>
          <h1 className="app-title">Design system playground</h1>
          <p className="app-subtitle">
            Consumes the precompiled package styles without a Tailwind config.
          </p>
        </div>
        <div className="app-actions">
          <Button
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
            }}
            variant="secondary"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </Button>
          <Button
            onClick={() => {
              setDirection(direction === "ltr" ? "rtl" : "ltr");
            }}
            variant="outline"
          >
            {direction === "ltr" ? "RTL" : "LTR"}
          </Button>
        </div>
      </header>

      <main className="app-grid">
        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Variants, sizes and loading state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="demo-stack">
              <div className="demo-row">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="demo-row">
                <Button variant="destructive">Delete</Button>
                <Button isLoading>Saving</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="demo-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
            <CardDescription>Inputs, labels and checkboxes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="demo-stack">
              <div className="field">
                <Label htmlFor="playground-email" required>
                  Email
                </Label>
                <Input
                  defaultValue="you@example.com"
                  id="playground-email"
                  type="email"
                />
              </div>
              <div className="field">
                <Label htmlFor="playground-invalid">Workspace</Label>
                <Input
                  defaultValue="my-workspace"
                  id="playground-invalid"
                  invalid
                />
              </div>
              <div className="demo-row">
                <Checkbox defaultChecked id="playground-terms" />
                <Label htmlFor="playground-terms">
                  Accept terms and conditions
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>
              Semantic badges for common states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="demo-row">
              <Badge>Neutral</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
            <CardDescription>Accessible modal built on Radix.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete project</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the project.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Select</CardTitle>
            <CardDescription>
              Grouped options and keyboard support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select defaultValue="apple">
              <SelectTrigger aria-label="Fruit" className="select-trigger">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Vegetables</SelectLabel>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Switch between related views.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs className="tabs-root" defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger disabled value="settings">
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <p>Make changes to your account here.</p>
              </TabsContent>
              <TabsContent value="password">
                <p>Change your password here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="demo-card">
          <CardHeader>
            <CardTitle>Tokens</CardTitle>
            <CardDescription>
              Runtime CSS variables from @repo/tokens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="swatches">
              {swatches.map((swatch) => (
                <div className="swatch" key={swatch.name}>
                  <span
                    className="swatch-color"
                    style={{ background: swatch.value }}
                  />
                  <code>{swatch.name}</code>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Badge variant="outline">{theme}</Badge>
            <Badge variant="outline">{direction}</Badge>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
