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

register(StyleDictionary);

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

async function readTokenPaths(files) {
  const contents = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(file, "utf8"))),
  );
  const paths = contents.flatMap((json) => collectPaths(json));
  const seen = new Set();

  return paths.filter((path) => {
    const key = path.join(".");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function resolveLightSources() {
  if (await exists(studioFile)) {
    return { mode: "studio-file", sources: [studioFile] };
  }

  const studioFiles = await listJsonFiles(studioFolder);
  const lightFiles = studioFiles.filter((file) => !isDarkFile(file));

  if (lightFiles.length > 0) {
    return { mode: "studio-folder", sources: lightFiles };
  }

  return {
    mode: "manual",
    sources: [
      resolve(tokensRoot, "core/color.json"),
      resolve(tokensRoot, "core/space.json"),
      resolve(tokensRoot, "core/radius.json"),
      resolve(tokensRoot, "core/typography.json"),
      resolve(tokensRoot, "core/shadow.json"),
      resolve(tokensRoot, "semantic/color.json"),
    ],
  };
}

async function resolveDarkSources() {
  const studioFiles = await listJsonFiles(studioFolder);
  const darkFiles = studioFiles.filter(isDarkFile);

  if (darkFiles.length > 0) {
    return { mode: "studio-folder", sources: darkFiles };
  }

  return {
    mode: "manual",
    sources: [
      resolve(tokensRoot, "themes/dark/color.json"),
      resolve(tokensRoot, "themes/dark/semantic.json"),
    ],
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

    lines.push(`  --radius-${name}: var(--ds-core-radius-${name});`);
  }

  lines.push("");
  lines.push("  /* Typography */");
  lines.push("  --spacing: var(--ds-core-space-1);");

  for (const path of typography) {
    const [group, name] = path;

    if (group === "fontFamily") {
      lines.push(`  --font-${name}: var(--ds-core-typography-font-family-${name});`);
    }

    if (group === "fontSize") {
      lines.push(`  --text-${name}: var(--ds-core-typography-font-size-${name});`);
    }

    if (group === "fontWeight") {
      lines.push(
        `  --font-weight-${name}: var(--ds-core-typography-font-weight-${name});`,
      );
    }

    if (group === "lineHeight") {
      lines.push(
        `  --leading-${name}: var(--ds-core-typography-line-height-${name});`,
      );
    }

    if (group === "letterSpacing") {
      lines.push(
        `  --tracking-${name}: var(--ds-core-typography-letter-spacing-${name});`,
      );
    }
  }

  lines.push("");
  lines.push("  /* Shadow */");

  for (const [name] of shadow) {
    lines.push(`  --shadow-${name}: var(--ds-core-shadow-${name});`);
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

  const light = new StyleDictionary({
    source: lightSources.sources,
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        prefix: "ds",
        transformGroup: "tokens-studio",
        transforms: ["name/kebab"],
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
    source: darkSources.sources,
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        prefix: "ds",
        transformGroup: "tokens-studio",
        transforms: ["name/kebab"],
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

  const lightPaths = await readTokenPaths(lightSources.sources);

  const semanticColors = lightPaths
    .filter((path) => path[0] === "semantic" && path[1] === "color")
    .map((path) => path.slice(2));
  const radius = lightPaths
    .filter((path) => path[0] === "core" && path[1] === "radius")
    .map((path) => path.slice(2));
  const typography = lightPaths
    .filter((path) => path[0] === "core" && path[1] === "typography")
    .map((path) => path.slice(2));
  const shadow = lightPaths
    .filter((path) => path[0] === "core" && path[1] === "shadow")
    .map((path) => path.slice(2));

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
