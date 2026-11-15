import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { watch } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const tokensRoot = resolve(root, "tokens");
const studioFile = resolve(tokensRoot, "studio.tokens.json");
const studioFolder = resolve(tokensRoot, "studio");
const fallbackLightFiles = [
  resolve(tokensRoot, "fallbacks/typography.json"),
  resolve(tokensRoot, "fallbacks/shadow.json"),
];
const fallbackDarkFiles = [];

register(StyleDictionary);

function shadowUnit(value) {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return /^-?\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : value;
}

StyleDictionary.registerTransform({
  name: "ds/box-shadow",
  type: "value",
  transitive: true,
  filter: (token) => {
    const type = token.type ?? token.$type;
    return type === "boxShadow" || type === "shadow";
  },
  transform: (token) => {
    const value = token.value ?? token.$value;

    if (typeof value === "string") {
      return value;
    }

    const shadows = Array.isArray(value) ? value : [value];

    return shadows
      .map((shadow) => {
        const inset =
          shadow.type === "innerShadow" || shadow.type === "inset"
            ? "inset "
            : "";

        return `${inset}${shadowUnit(shadow.x)} ${shadowUnit(shadow.y)} ${shadowUnit(
          shadow.blur,
        )} ${shadowUnit(shadow.spread)} ${shadow.color}`;
      })
      .join(", ");
  },
});

function flatTokens(dictionary) {
  return Object.fromEntries(
    dictionary.allTokens.map((token) => [
      token.path.join("."),
      token.$value ?? token.value,
    ]),
  );
}

StyleDictionary.registerFormat({
  name: "ds/json",
  format: ({ dictionary }) =>
    `${JSON.stringify(flatTokens(dictionary), null, 2)}\n`,
});

StyleDictionary.registerFormat({
  name: "ds/esm",
  format: ({ dictionary }) =>
    `export const tokens = ${JSON.stringify(
      flatTokens(dictionary),
      null,
      2,
    )};\n\nexport default tokens;\n`,
});

StyleDictionary.registerFormat({
  name: "ds/cjs",
  format: ({ dictionary }) =>
    `module.exports = ${JSON.stringify(flatTokens(dictionary), null, 2)};\n`,
});

StyleDictionary.registerFormat({
  name: "ds/types",
  format: () =>
    "export declare const tokens: Record<string, string>;\nexport default tokens;\n",
});

function hasTokens(node) {
  if (!node || typeof node !== "object") {
    return false;
  }

  if ("value" in node || "$value" in node) {
    return true;
  }

  return Object.values(node).some(hasTokens);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function collectPaths(node, path = [], out = []) {
  for (const [key, value] of Object.entries(node)) {
    const next = [...path, key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      if ("value" in value || "$value" in value) {
        out.push(next);
      } else {
        collectPaths(value, next, out);
      }
    }
  }

  return out;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listJsonFiles(directory) {
  if (!(await exists(directory))) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const next = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listJsonFiles(next);
      }

      const name = basename(next);

      if (
        !name.endsWith(".json") ||
        name.startsWith("$") ||
        name === "themes.json"
      ) {
        return [];
      }

      return [next];
    }),
  );

  return nested.flat();
}

function isDarkFile(filePath) {
  return basename(filePath).toLowerCase().includes("dark");
}

function isDarkSetName(name) {
  return name.toLowerCase().includes("dark") || name.startsWith("themes/");
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    const isToken =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      ("value" in value || "$value" in value);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !isToken
    ) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }

      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

function mergeTokenTrees(trees) {
  return trees.reduce((result, tree) => deepMerge(result, tree), {});
}

function getTokenValue(token) {
  if (!token || typeof token !== "object") {
    return undefined;
  }

  return token.$value ?? token.value;
}

function setTokenValue(token, value) {
  if ("$value" in token) {
    return { ...token, $value: value };
  }

  return { ...token, value };
}

const FONT_SIZE_NAMES = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

const FONT_WEIGHT_NAMES = {
  regular: "normal",
  normal: "normal",
  medium: "medium",
  "semi bold": "semibold",
  semibold: "semibold",
  bold: "bold",
};

const FONT_WEIGHT_KEY_NAMES = {
  regular: "normal",
  normal: "normal",
  medium: "medium",
  "semi-bold": "semibold",
  semibold: "semibold",
  bold: "bold",
};

const SHADOW_NAMES = {
  "shadow-sm": "sm",
  shadow: "base",
  "shadow-md": "md",
  "shadow-lg": "lg",
  "shadow-xl": "xl",
  "shadow-2xl": "2xl",
  "shadow-inner": "inner",
};

const RADIUS_NAMES = {
  "rounded-none": "none",
  "rounded-sm": "xs",
  rounded: "sm",
  "rounded-md": "md",
  "rounded-lg": "lg",
  "rounded-xl": "xl",
  "rounded-2xl": "2xl",
  "rounded-3xl": "3xl",
  "rounded-full": "full",
};

const COLOR_FAMILIES = new Set([
  "blue",
  "purple",
  "gray",
  "red",
  "green",
  "yellow",
  "slate",
  "zinc",
  "neutral",
  "stone",
  "orange",
  "amber",
  "lime",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "indigo",
  "violet",
  "fuchsia",
  "pink",
  "rose",
  "white",
  "black",
]);

const BRAND_GROUPS = [
  "primary",
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
  "base",
];

function toPx(value) {
  return typeof value === "number" ? `${value}px` : value;
}

function getByPath(node, path) {
  return path
    .split(".")
    .reduce((current, key) => (current ? current[key] : undefined), node);
}

function tokenRef(color, path) {
  return getByPath(color, path)
    ? { value: `{color.${path}}`, type: "color" }
    : undefined;
}

function compactObject(value) {
  if (!value || typeof value !== "object" || "value" in value) {
    return value;
  }

  const entries = Object.entries(value)
    .map(([key, child]) => [key, compactObject(child)])
    .filter(([, child]) => {
      if (child === undefined) {
        return false;
      }

      if (
        child &&
        typeof child === "object" &&
        !("value" in child) &&
        Object.keys(child).length === 0
      ) {
        return false;
      }

      return true;
    });

  return Object.fromEntries(entries);
}

function mapPlusUiSemanticColors(color, isDark = false) {
  if (!color?.background || !color?.text || !color?.border) {
    return {};
  }

  const status = (role) => ({
    solid: tokenRef(color, `background.${role}.default`),
    "solid-hover": tokenRef(color, `background.${role}.hovered`),
    text: tokenRef(color, `text.${role}`),
    emphasis: tokenRef(color, `background.${role}.pressed`),
    subtle: tokenRef(color, `background.${role}.invert.default`),
    "subtle-hover": tokenRef(color, `background.${role}.invert.hovered`),
    contrast: tokenRef(color, "text.base"),
  });

  return compactObject({
    surface: {
      canvas: tokenRef(color, "background.default.default"),
      subtle: tokenRef(color, "background.default.hovered"),
      raised: tokenRef(color, "background.surface"),
      hover: tokenRef(color, "background.default.hovered"),
      active: tokenRef(color, "background.default.pressed"),
      overlay: {
        value: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)",
        type: "color",
      },
    },
    content: {
      primary: tokenRef(color, "text.default"),
      secondary: tokenRef(color, "text.caption"),
      disabled: tokenRef(color, "text.disabled"),
      inverse: tokenRef(color, "text.invert.default"),
    },
    stroke: {
      subtle: tokenRef(color, "border.disabled"),
      default: tokenRef(color, "border.default"),
      strong: tokenRef(color, "border.default"),
    },
    accent: {
      solid: tokenRef(color, "background.primary.default"),
      "solid-hover": tokenRef(color, "background.primary.hovered"),
      text: tokenRef(color, "text.primary"),
      emphasis: tokenRef(color, "background.primary.pressed"),
      subtle: tokenRef(color, "background.primary.invert.default"),
      "subtle-hover": tokenRef(color, "background.primary.invert.hovered"),
      contrast: tokenRef(color, "text.base"),
    },
    danger: status("danger"),
    success: status("success"),
    warning: status("warning"),
    info: status("info"),
    focus: tokenRef(color, "border.ring"),
  });
}

function normalizeFigmaTokens(raw, setName = "") {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const out = {};

  for (const key of ["color", "semantic", "border", "zIndex", "component"]) {
    if (raw[key]) {
      out[key] = raw[key];
    }
  }

  for (const family of COLOR_FAMILIES) {
    if (raw[family]) {
      out[family] = raw[family];
    }
  }

  for (const group of BRAND_GROUPS) {
    if (raw[group]) {
      out[group] = raw[group];
    }
  }

  if (raw["font-family"]) {
    out["font-family"] = raw["font-family"];
  }

  const fontFamily =
    raw["font-family"] ??
    raw.typography?.["font-family"] ??
    raw.typography?.fontFamily;

  if (fontFamily) {
    out.typography = out.typography ?? {};
    out.typography.fontFamily = { ...fontFamily };
  }

  const fontWeight =
    raw["font-weight"] ?? raw.fontWeights ?? raw.typography?.fontWeight;

  if (fontWeight) {
    out.typography = out.typography ?? {};
    out.typography.fontWeight = {};

    for (const [key, token] of Object.entries(fontWeight)) {
      const value = String(getTokenValue(token) ?? "")
        .toLowerCase()
        .trim();
      const name =
        FONT_WEIGHT_NAMES[value] ?? FONT_WEIGHT_KEY_NAMES[key] ?? key;

      out.typography.fontWeight[name] = token;
    }
  }

  const fontSize = raw["font-size"] ?? raw.fontSize ?? raw.typography?.fontSize;

  if (fontSize) {
    out.typography = out.typography ?? {};
    out.typography.fontSize = {};

    const entries = Object.entries(fontSize);
    const numericKeys = entries.every(([key]) => /^\d+$/.test(key));
    const sorted = numericKeys
      ? entries.sort(([a], [b]) => Number(a) - Number(b))
      : entries;

    sorted.forEach(([key, token], index) => {
      const name = numericKeys ? (FONT_SIZE_NAMES[index] ?? key) : key;
      const value = getTokenValue(token);

      out.typography.fontSize[name] = setTokenValue(token, toPx(value));
    });
  }

  const lineHeight = raw["line-height"] ?? raw.typography?.lineHeight;

  if (lineHeight) {
    out.typography = out.typography ?? {};
    out.typography.lineHeight = {};

    for (const [name, token] of Object.entries(lineHeight)) {
      const value = getTokenValue(token);
      const nextValue =
        typeof value === "number" && value > 4 ? `${value}px` : value;

      out.typography.lineHeight[name] = setTokenValue(token, nextValue);
    }
  }

  const letterSpacing =
    raw.letterSpacing ?? raw["letter-spacing"] ?? raw.typography?.letterSpacing;

  if (letterSpacing) {
    out.typography = out.typography ?? {};
    out.typography.letterSpacing = {};

    for (const [name, token] of Object.entries(letterSpacing)) {
      out.typography.letterSpacing[name === "0" ? "normal" : name] = token;
    }
  }

  const shadows = raw["Box Shadow"] ?? raw.shadow;

  if (shadows) {
    out.shadow = {};

    for (const [key, token] of Object.entries(shadows)) {
      out.shadow[SHADOW_NAMES[key] ?? key] = token;
    }
  }

  if (raw.radius) {
    out.radius = {};

    for (const [name, token] of Object.entries(raw.radius)) {
      out.radius[name] = setTokenValue(token, toPx(getTokenValue(token)));
    }

    for (const [source, target] of Object.entries(RADIUS_NAMES)) {
      if (raw.radius[source]) {
        out.radius[target] = {
          value: `{radius.${source}}`,
          type: "number",
        };
      }
    }
  }

  if (raw.width) {
    out.width = {};

    for (const [name, token] of Object.entries(raw.width)) {
      out.width[name] = setTokenValue(token, toPx(getTokenValue(token)));
    }
  }

  const spacingEntries = Object.entries(raw).filter(([key]) =>
    key.startsWith("space-"),
  );

  if (spacingEntries.length > 0) {
    out.space = out.space ?? {};

    for (const [key, token] of spacingEntries) {
      const name = key.replace(/^space-/, "");

      out.space[name] = setTokenValue(token, toPx(getTokenValue(token)));
    }
  }

  const opacityEntries = Object.entries(raw).filter(([key]) =>
    key.startsWith("opacity-"),
  );

  if (opacityEntries.length > 0) {
    out.opacity = out.opacity ?? {};

    for (const [key, token] of opacityEntries) {
      const name = key.replace(/^opacity-/, "");
      const value = Number(getTokenValue(token)) / 100;

      out.opacity[name] = setTokenValue(token, value);
    }
  }

  const sizingEntries = Object.entries(raw).filter(([key]) =>
    key.startsWith("size-"),
  );

  if (sizingEntries.length > 0) {
    out.size = out.size ?? {};

    for (const [key, token] of sizingEntries) {
      const name = key.replace(/^size-/, "");

      out.size[name] = setTokenValue(token, toPx(getTokenValue(token)));
    }
  }

  if (setName.toLowerCase().includes("breakpoints")) {
    out.breakpoint = {};

    for (const [name, token] of Object.entries(raw)) {
      if (token && typeof token === "object") {
        out.breakpoint[name] = setTokenValue(token, toPx(getTokenValue(token)));
      }
    }
  }

  if (raw.color?.background && raw.color?.text) {
    out.semantic = out.semantic ?? {};
    out.semantic.color = mapPlusUiSemanticColors(
      raw.color,
      setName.toLowerCase().includes("dark"),
    );
  }

  return out;
}

function loadStructuredStudioFile(sets, $themes) {
  const sharedNames = [
    "primitives/typography-en",
    "primitives/typography-ar",
    "primitives/space",
    "primitives/radius",
    "primitives/border-width",
    "primitives/shadow",
    "primitives/opacity",
    "primitives/sizing",
    "primitives/breakpoints",
  ];
  const shared = mergeTokenTrees(
    sharedNames
      .filter((name) => sets[name] && hasTokens(sets[name]))
      .map((name) => normalizeFigmaTokens(sets[name], name)),
  );

  const lightColor = sets["primitives/color-light"] ?? {};
  const darkColor = sets["primitives/color-dark"] ?? lightColor;

  const lightSemantic = mergeTokenTrees(
    Object.entries(sets)
      .filter(
        ([name]) =>
          name.startsWith("semantic/") &&
          name.toLowerCase().includes("light"),
      )
      .map(([name, set]) => normalizeFigmaTokens(set, name)),
  );
  const darkSemantic = mergeTokenTrees(
    Object.entries(sets)
      .filter(
        ([name]) =>
          name.startsWith("semantic/") &&
          name.toLowerCase().includes("dark"),
      )
      .map(([name, set]) => normalizeFigmaTokens(set, name)),
  );

  return {
    light: mergeTokenTrees([
      normalizeFigmaTokens(lightColor, "primitives/color-light"),
      shared,
      lightSemantic,
    ]),
    dark: mergeTokenTrees([
      normalizeFigmaTokens(darkColor, "primitives/color-dark"),
      shared,
      darkSemantic,
    ]),
    themes: $themes ?? [],
  };
}

async function loadStudioFile() {
  const json = await readJson(studioFile);
  const { $themes, ...sets } = json;
  const names = Object.keys(sets);
  const isStructured = names.some(
    (name) =>
      name.startsWith("primitives/") || name.startsWith("semantic/"),
  );

  if (isStructured) {
    return loadStructuredStudioFile(sets, $themes);
  }

  const shared = [];
  const lightThemes = [];
  const darkThemes = [];

  for (const [name, set] of Object.entries(sets)) {
    if (!hasTokens(set)) {
      continue;
    }

    const normalized = normalizeFigmaTokens(set, name);

    if (isDarkSetName(name)) {
      darkThemes.push(normalized);
    } else if (name.toLowerCase().includes("light")) {
      lightThemes.push(normalized);
    } else {
      shared.push(normalized);
    }
  }

  return {
    light: mergeTokenTrees([...shared, ...lightThemes]),
    dark: mergeTokenTrees([...shared, ...darkThemes]),
    themes: $themes ?? [],
  };
}

async function loadTokenTree(files) {
  const contents = await Promise.all(files.map((file) => readJson(file)));

  return mergeTokenTrees(contents);
}

function hasColorFamilies(tokens) {
  return Object.keys(tokens ?? {}).some((key) => COLOR_FAMILIES.has(key));
}

function hasSemanticColors(tokens) {
  return Boolean(tokens?.semantic?.color) && hasTokens(tokens.semantic.color);
}

function prepareFallback(fallback, figmaTokens) {
  const base = structuredClone(fallback);

  if (hasColorFamilies(figmaTokens) && hasSemanticColors(figmaTokens)) {
    delete base.color;

    const overlay = base.semantic?.color?.surface?.overlay;

    base.semantic = base.semantic ?? {};
    base.semantic.color = overlay ? { surface: { overlay } } : {};
  }

  return base;
}

async function resolveLightSources() {
  if (await exists(studioFile)) {
    const { light } = await loadStudioFile();

    if (hasTokens(light)) {
      return { mode: "studio-file", tokens: light };
    }

    console.warn(
      "studio.tokens.json contains no tokens. Falling back to manual tokens. Push tokens from Tokens Studio, then rebuild.",
    );
  }

  const studioFiles = await listJsonFiles(studioFolder);
  const inspected = await Promise.all(
    studioFiles.map(async (file) => ({ file, json: await readJson(file) })),
  );
  const lightFiles = inspected
    .filter(({ file, json }) => !isDarkFile(file) && hasTokens(json))
    .map(({ file }) => file);

  if (lightFiles.length > 0) {
    return { mode: "studio-folder", sources: lightFiles };
  }

  if (studioFiles.length > 0) {
    console.warn(
      "The tokens/studio folder contains no tokens. Falling back to manual tokens.",
    );
  }

  return {
    mode: "manual",
    sources: fallbackLightFiles,
  };
}

async function resolveDarkSources() {
  if (await exists(studioFile)) {
    const { dark } = await loadStudioFile();

    if (hasTokens(dark)) {
      return { mode: "studio-file", tokens: dark };
    }
  }

  const studioFiles = await listJsonFiles(studioFolder);
  const inspected = await Promise.all(
    studioFiles.map(async (file) => ({ file, json: await readJson(file) })),
  );
  const darkFiles = inspected
    .filter(({ file, json }) => isDarkFile(file) && hasTokens(json))
    .map(({ file }) => file);

  if (darkFiles.length > 0) {
    return { mode: "studio-folder", sources: darkFiles };
  }

  return {
    mode: "manual",
    sources: fallbackDarkFiles,
  };
}

function tailwindColorName(path) {
  const [group, ...rest] = path;

  if (rest.length === 1 && rest[0] === "solid") {
    return group;
  }

  if (rest.length === 1 && rest[0] === "solid-hover") {
    return `${group}-hover`;
  }

  return path.join("-");
}

function buildTailwindTheme({ semanticColors, radius, typography, shadow }) {
  const lines = [];

  lines.push("  /* Colors */");

  for (const path of semanticColors) {
    lines.push(
      `  --color-${tailwindColorName(path)}: var(--ds-semantic-color-${path.join("-")});`,
    );
  }

  lines.push("");
  lines.push("  /* Radius */");

  for (const path of radius) {
    const [name] = path;

    if (name === "none") {
      continue;
    }

    lines.push(`  --radius-${name}: var(--ds-radius-${name});`);
  }

  lines.push("");
  lines.push("  /* Typography */");
  lines.push("  --spacing: var(--ds-space-1);");

  for (const path of typography) {
    const [group, name] = path;

    if (group === "fontFamily") {
      lines.push(`  --font-${name}: var(--ds-typography-font-family-${name});`);
    }

    if (group === "fontSize") {
      lines.push(`  --text-${name}: var(--ds-typography-font-size-${name});`);
    }

    if (group === "fontWeight") {
      lines.push(
        `  --font-weight-${name}: var(--ds-typography-font-weight-${name});`,
      );
    }

    if (group === "lineHeight") {
      lines.push(
        `  --leading-${name}: var(--ds-typography-line-height-${name});`,
      );
    }

    if (group === "letterSpacing") {
      lines.push(
        `  --tracking-${name}: var(--ds-typography-letter-spacing-${name});`,
      );
    }
  }

  lines.push("");
  lines.push("  /* Shadow */");

  for (const [name] of shadow) {
    lines.push(`  --shadow-${name}: var(--ds-shadow-${name});`);
  }

  return `/**\n * Auto-generated by @repo/tokens. Do not edit directly.\n */\n@import "./variables.css";\n\n@theme {\n  --color-*: initial;\n}\n\n@theme inline {\n${lines.join(
    "\n",
  )}\n}\n`;
}

async function build() {
  await mkdir(resolve(root, "dist"), { recursive: true });
  const tempDir = await mkdtemp(join(root, "dist/.tmp-"));
  const lightSources = await resolveLightSources();
  const darkSources = await resolveDarkSources();
  const fallbackLight = await loadTokenTree(fallbackLightFiles);
  const fallbackDark = await loadTokenTree(fallbackDarkFiles);
  const figmaLight =
    lightSources.tokens ?? (await loadTokenTree(lightSources.sources));
  const figmaDark =
    darkSources.tokens ?? (await loadTokenTree(darkSources.sources));
  const lightTokens = deepMerge(
    prepareFallback(fallbackLight, figmaLight),
    figmaLight,
  );
  const darkTokens = deepMerge(
    prepareFallback(fallbackDark, figmaDark),
    figmaDark,
  );

  const light = new StyleDictionary({
    tokens: lightTokens,
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        prefix: "ds",
        transformGroup: "tokens-studio",
        transforms: ["name/kebab", "ds/box-shadow"],
        buildPath: `${tempDir}/`,
        files: [
          {
            destination: "light.css",
            format: "css/variables",
            options: {
              selector: ":root",
              outputReferences: true,
            },
          },
        ],
      },
      js: {
        transformGroup: "tokens-studio",
        transforms: ["ds/box-shadow"],
        buildPath: resolve(root, "dist/"),
        files: [
          { destination: "tokens.json", format: "ds/json" },
          { destination: "tokens.mjs", format: "ds/esm" },
          { destination: "tokens.cjs", format: "ds/cjs" },
          { destination: "tokens.d.ts", format: "ds/types" },
        ],
      },
    },
  });

  const dark = new StyleDictionary({
    tokens: darkTokens,
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        prefix: "ds",
        transformGroup: "tokens-studio",
        transforms: ["name/kebab", "ds/box-shadow"],
        buildPath: `${tempDir}/`,
        files: [
          {
            destination: "dark.css",
            format: "css/variables",
            options: {
              selector: '[data-theme="dark"],\n.dark',
              outputReferences: true,
            },
          },
        ],
      },
    },
  });

  await light.buildAllPlatforms();
  await dark.buildAllPlatforms();

  const lightCss = await readFile(join(tempDir, "light.css"), "utf8");
  const darkCss = await readFile(join(tempDir, "dark.css"), "utf8");

  const variablesCss = `${lightCss.trimEnd()}\n\n${darkCss.trimEnd()}\n\n:root {\n  color-scheme: light;\n}\n\n[data-theme="dark"],\n.dark {\n  color-scheme: dark;\n}\n`;

  await writeFile(resolve(root, "dist/variables.css"), variablesCss, "utf8");

  const lightPaths = collectPaths(lightTokens);

  const semanticColors = lightPaths
    .filter((path) => path[0] === "semantic" && path[1] === "color")
    .map((path) => path.slice(2));
  const radius = lightPaths
    .filter((path) => path[0] === "radius")
    .map((path) => path.slice(1));
  const typography = lightPaths
    .filter((path) => path[0] === "typography")
    .map((path) => path.slice(1));
  const shadow = lightPaths
    .filter((path) => path[0] === "shadow")
    .map((path) => path.slice(1));

  if (semanticColors.length === 0) {
    console.warn(
      "No semantic.color.* tokens found. Components rely on semantic.color.* paths.",
    );
  }

  if (radius.length === 0 || typography.length === 0 || shadow.length === 0) {
    console.warn(
      "Some core tokens are missing. Expected radius.*, typography.* and shadow.*.",
    );
  }

  const tailwindCss = buildTailwindTheme({
    semanticColors,
    radius,
    typography,
    shadow,
  });

  await writeFile(resolve(root, "dist/tailwind.css"), tailwindCss, "utf8");
  await rm(tempDir, { recursive: true, force: true });

  console.log(
    `Built @repo/tokens (light: ${lightSources.mode}, dark: ${darkSources.mode}) → ${semanticColors.length} semantic colors, ${radius.length} radii, ${typography.length} typography tokens, ${shadow.length} shadows.`,
  );
}

async function main() {
  const watchMode = process.argv.includes("--watch");

  await build();

  if (!watchMode) {
    return;
  }

  let timer;

  watch(resolve(root, "tokens"), { recursive: true }, () => {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      try {
        await build();
      } catch (error) {
        console.error(error);
      }
    }, 150);
  });

  console.log("Watching packages/tokens/tokens for changes...");
}

await main();
