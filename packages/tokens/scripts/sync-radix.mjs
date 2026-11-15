import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as radix from "@radix-ui/colors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SCALES = [
  "gray",
  "blue",
  "red",
  "green",
  "amber",
  "cyan",
  "violet",
  "pink",
];

function toColorGroup(entries) {
  const group = {};

  for (const { token, source } of entries) {
    const scale = radix[source];

    if (!scale) {
      throw new Error(`Radix Colors scale "${source}" was not found.`);
    }

    const steps = {};

    for (let step = 1; step <= 12; step += 1) {
      const value = scale[`${token}${step}`] ?? scale[`${source}${step}`];

      if (!value) {
        throw new Error(
          `Radix Colors value for "${token}.${step}" was not found in "${source}".`,
        );
      }

      steps[String(step)] = {
        value,
        type: "color",
      };
    }

    group[token] = steps;
  }

  return group;
}

async function writeJson(filePath, data) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  const light = {
    color: toColorGroup(SCALES.map((scale) => ({ token: scale, source: scale }))),
  };

  const dark = {
    color: toColorGroup(
      SCALES.map((scale) => ({ token: scale, source: `${scale}Dark` })),
    ),
  };

  await writeJson(resolve(root, "tokens/core/color.json"), light);
  await writeJson(resolve(root, "tokens/themes/dark/color.json"), dark);

  console.log(
    `Synced ${SCALES.length} Radix Colors scales (light + dark) into token JSON files.`,
  );
}

await main();
