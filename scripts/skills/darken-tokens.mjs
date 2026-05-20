import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const darkPath = path.join(root, "packages/tokens/src/tokens-dark.json");
const lightPath = path.join(root, "packages/tokens/src/tokens-light.json");

const hueRampRoots = [
  ["Primitives", "Colors", "theme"],
  ["Primitives", "Colors", "theme", "variant", "1"],
  ["Primitives", "Colors", "theme", "variant", "2"],
  ["Primitives", "Colors", "emotional", "success"],
  ["Primitives", "Colors", "emotional", "danger"],
  ["Primitives", "Colors", "emotional", "alert"],
  ["Primitives", "Colors", "emotional", "info"],
];

const semanticDataDarkValues = new Map([
  ["Blue", "#60A5FA"],
  ["Purple", "#C084FC"],
  ["Teal", "#2DD4BF"],
  ["Orange", "#FB923C"],
  ["Red", "#F87171"],
  ["Yellow", "#FBBF24"],
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getPath(value, segments) {
  return segments.reduce((current, segment) => current?.[segment], value);
}

function getTokenValue(token) {
  return token?.$value ?? token?.value;
}

function getTokenType(token) {
  return token?.$type ?? token?.type;
}

function setTokenValue(token, value) {
  if (Object.prototype.hasOwnProperty.call(token, "$value")) {
    token.$value = value;
  } else {
    token.value = value;
  }
}

function isColorToken(token) {
  return (
    token &&
    typeof token === "object" &&
    getTokenType(token) === "color" &&
    typeof getTokenValue(token) === "string" &&
    getTokenValue(token).startsWith("#")
  );
}

function sortedColorStops(ramp) {
  return Object.keys(ramp)
    .filter((key) => isColorToken(ramp[key]))
    .sort((a, b) => Number(a) - Number(b));
}

function walkTokens(darkNode, lightNode, segments, visit) {
  if (!darkNode || typeof darkNode !== "object") return;

  if (isColorToken(darkNode)) {
    visit(darkNode, lightNode, segments);
    return;
  }

  for (const [key, child] of Object.entries(darkNode)) {
    walkTokens(child, lightNode?.[key], [...segments, key], visit);
  }
}

function syncHueRamps(darkJson, lightJson) {
  const lightToDark = new Map();
  let changed = 0;

  for (const rootSegments of hueRampRoots) {
    const lightRamp = getPath(lightJson, rootSegments);
    const darkRamp = getPath(darkJson, rootSegments);
    if (!lightRamp || !darkRamp) continue;

    const stops = sortedColorStops(lightRamp);
    const reversed = [...stops].reverse();

    stops.forEach((stop, index) => {
      const lightToken = lightRamp[stop];
      const darkToken = darkRamp[stop];
      const nextValue = getTokenValue(lightRamp[reversed[index]]);

      lightToDark.set(getTokenValue(lightToken).toLowerCase(), nextValue);

      if (isColorToken(darkToken) && getTokenValue(darkToken) !== nextValue) {
        setTokenValue(darkToken, nextValue);
        changed += 1;
      }
    });
  }

  return { changed, lightToDark };
}

function syncComponentHues(darkJson, lightJson, lightToDark) {
  let changed = 0;

  walkTokens(darkJson.Components, lightJson.Components, ["Components"], (darkToken, lightToken) => {
    const lightValue = getTokenValue(lightToken);
    if (typeof lightValue !== "string") return;

    const nextValue = lightToDark.get(lightValue.toLowerCase());
    if (nextValue && getTokenValue(darkToken) !== nextValue) {
      setTokenValue(darkToken, nextValue);
      changed += 1;
    }
  });

  return changed;
}

function syncSemanticDataColors(darkJson) {
  const data = darkJson.Semantics?.Data;
  if (!data) return 0;

  let changed = 0;
  for (const [name, nextValue] of semanticDataDarkValues) {
    const token = data[name];
    if (isColorToken(token) && getTokenValue(token) !== nextValue) {
      setTokenValue(token, nextValue);
      changed += 1;
    }
  }

  return changed;
}

const darkJson = readJson(darkPath);
const lightJson = readJson(lightPath);

const hueRampResult = syncHueRamps(darkJson, lightJson);
const componentChanges = syncComponentHues(
  darkJson,
  lightJson,
  hueRampResult.lightToDark,
);
const semanticDataChanges = syncSemanticDataColors(darkJson);
const changed =
  hueRampResult.changed + componentChanges + semanticDataChanges;

fs.writeFileSync(darkPath, `${JSON.stringify(darkJson, null, 2)}\n`, "utf8");
console.log(`Hue-preserving dark token sync complete. Updated ${changed} values.`);
