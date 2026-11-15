import * as React from "react";
import type { Preview } from "@storybook/react";
import "../styles.css";

interface ThemeDecoratorProps {
  children: React.ReactNode;
  direction: string;
  theme: string;
}

function ThemeDecorator({
  children,
  direction,
  theme,
}: ThemeDecoratorProps): React.JSX.Element {
  React.useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = theme;
    root.dir = direction;
    root.lang = direction === "rtl" ? "ar" : "en";

    return () => {
      delete root.dataset.theme;
      root.dir = "ltr";
      root.lang = "en";
    };
  }, [theme, direction]);

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-content-primary">
      {children}
    </div>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string | undefined) ?? "light";
      const direction =
        (context.globals.direction as string | undefined) ?? "ltr";

      return (
        <ThemeDecorator direction={direction} theme={theme}>
          <Story />
        </ThemeDecorator>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: "Color theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Text direction",
      defaultValue: "ltr",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    controls: { expanded: true },
    a11y: { test: "error" },
    options: {
      storySort: { order: ["Foundations", "Components"] },
    },
  },
};

export default preview;
