import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const colors = [
  { name: "surface.canvas", className: "bg-surface-canvas" },
  { name: "surface.subtle", className: "bg-surface-subtle" },
  { name: "surface.raised", className: "bg-surface-raised" },
  { name: "surface.hover", className: "bg-surface-hover" },
  { name: "surface.active", className: "bg-surface-active" },
  { name: "surface.overlay", className: "bg-surface-overlay" },
  { name: "content.primary", className: "bg-content-primary" },
  { name: "content.secondary", className: "bg-content-secondary" },
  { name: "content.disabled", className: "bg-content-disabled" },
  { name: "stroke.subtle", className: "bg-stroke-subtle" },
  { name: "stroke.default", className: "bg-stroke-default" },
  { name: "stroke.strong", className: "bg-stroke-strong" },
  { name: "accent.solid", className: "bg-accent" },
  { name: "accent.hover", className: "bg-accent-hover" },
  { name: "accent.text", className: "bg-accent-text" },
  { name: "accent.subtle", className: "bg-accent-subtle" },
  { name: "danger.solid", className: "bg-danger" },
  { name: "danger.subtle", className: "bg-danger-subtle" },
  { name: "success.solid", className: "bg-success" },
  { name: "success.subtle", className: "bg-success-subtle" },
  { name: "warning.solid", className: "bg-warning" },
  { name: "warning.subtle", className: "bg-warning-subtle" },
  { name: "info.solid", className: "bg-info" },
  { name: "info.subtle", className: "bg-info-subtle" },
  { name: "focus", className: "bg-focus" },
];

const fontSizes = [
  "text-xs",
  "text-sm",
  "text-md",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
];

const fontWeights = [
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
];

const radii = [
  "rounded-none",
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-full",
];

const spacing = [
  "w-1",
  "w-2",
  "w-3",
  "w-4",
  "w-5",
  "w-6",
  "w-8",
  "w-10",
  "w-12",
  "w-16",
  "w-20",
  "w-24",
];

const shadows = [
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
];

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {colors.map((color) => (
        <div className="flex flex-col gap-2" key={color.name}>
          <div
            className={`h-16 w-full rounded-md border border-stroke-subtle ${color.className}`}
          />
          <code className="text-xs text-content-secondary">{color.name}</code>
        </div>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        {fontSizes.map((className) => (
          <p className={`${className} text-content-primary`} key={className}>
            The quick brown fox jumps over the lazy dog.
            <span className="ms-2 text-xs text-content-secondary">
              {className}
            </span>
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {fontWeights.map((className) => (
          <p
            className={`text-md text-content-primary ${className}`}
            key={className}
          >
            Design systems scale with tokens.
            <span className="ms-2 text-xs text-content-secondary">
              {className}
            </span>
          </p>
        ))}
      </div>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {radii.map((className) => (
        <div className="flex flex-col items-center gap-2" key={className}>
          <div
            className={`size-16 border border-stroke-default bg-accent ${className}`}
          />
          <code className="text-xs text-content-secondary">{className}</code>
        </div>
      ))}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {spacing.map((className) => (
        <div className="flex items-center gap-3" key={className}>
          <div className={`h-4 bg-accent ${className}`} />
          <code className="text-xs text-content-secondary">{className}</code>
        </div>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {shadows.map((className) => (
        <div className="flex flex-col items-center gap-2" key={className}>
          <div
            className={`size-24 rounded-lg bg-surface-raised ${className}`}
          />
          <code className="text-xs text-content-secondary">{className}</code>
        </div>
      ))}
    </div>
  ),
};
