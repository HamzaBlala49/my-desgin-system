import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const source = resolve(root, "tokens/studio.tokens.json");
const outputDir = resolve(root, "figma-check");
const output = resolve(outputDir, "figma-check.tokens.json");

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
      target[key] = target[key] ?? {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

function merge(...trees) {
  return trees.reduce((result, tree) => deepMerge(result, tree ?? {}), {});
}

function countTokens(node) {
  if (!node || typeof node !== "object") {
    return 0;
  }

  if ("value" in node || "$value" in node) {
    return 1;
  }

  return Object.values(node).reduce(
    (total, child) => total + countTokens(child),
    0,
  );
}

async function writeJson(filePath, data) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function getSet(sets, name) {
  return sets[name] ?? {};
}

async function main() {
  const json = JSON.parse(await readFile(source, "utf8"));
  const { $themes, ...sets } = json;

  const colorPrimitives = merge(
    getSet(sets, "Color/Mode 1"),
    getSet(sets, "+Brand/Mode 1"),
  );
  const typography = getSet(sets, "Typography/Mode 1");
  const global = getSet(sets, "global");
  const border = getSet(sets, "Border/Mode 1");
  const lightTheme = getSet(sets, "+Theme/Light");
  const darkTheme = getSet(sets, "+Theme/Dark");

  const typographyEn = merge(typography, {
    typography: {
      letterSpacing: {
        normal: { value: "0%", type: "letterSpacing" },
      },
    },
  });

  const typographyAr = {
    typography: {
      fontFamily: {
        arabic: {
          value: "IBM Plex Sans Arabic",
          type: "fontFamilies",
        },
      },
    },
  };

  const shadow = global["Box Shadow"]
    ? { "Box Shadow": global["Box Shadow"] }
    : {};

  const setsOut = {
    "primitives/color-light": colorPrimitives,
    "primitives/color-dark": colorPrimitives,
    "primitives/typography-en": typographyEn,
    "primitives/typography-ar": typographyAr,
    "primitives/space": getSet(sets, "Spacing/Value"),
    "primitives/radius": { radius: border.radius },
    "primitives/border-width": { width: border.width },
    "primitives/shadow": shadow,
    "primitives/opacity": getSet(sets, "Opacity/Mode 1"),
    "primitives/sizing": getSet(sets, "Sizing/Mode 1"),
    "primitives/breakpoints": getSet(sets, "Breakpoints/min-width"),
    "semantic/color-light": { color: lightTheme.color },
    "semantic/color-dark": { color: darkTheme.color },
    "semantic/border-light": { border: lightTheme.border },
    "semantic/border-dark": { border: darkTheme.border },
    "semantic/typography-light": { typography: lightTheme.typography },
    "semantic/typography-dark": { typography: darkTheme.typography },
  };

  const order = Object.keys(setsOut);
  const result = {
    ...setsOut,
    $themes: $themes ?? [],
    $metadata: { tokenSetOrder: order },
  };

  await rm(outputDir, { recursive: true, force: true });

  await Promise.all(
    Object.entries(setsOut).map(([name, data]) => {
      const [group, file] = name.split("/");

      return writeJson(resolve(outputDir, group, `${file}.json`), data);
    }),
  );

  await writeJson(output, result);

  console.log(`Wrote ${output}`);
  for (const name of order) {
    console.log(`  ${name.padEnd(28)} ${countTokens(setsOut[name])} tokens`);
  }
  console.log("");
  console.log(
    "Import figma-check.tokens.json into a NEW sandbox Figma file via",
  );
  console.log(
    "Tokens Studio → Import. Use the production file only for the one-time overwrite.",
  );
}

await main();
