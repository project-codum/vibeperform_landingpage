#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "..", "locales");
const fallbackLocale = "en";
const fallbackFile = path.join(localesDir, fallbackLocale, "common.json");

if (!fs.existsSync(localesDir)) {
  console.error(`Locales directory not found: ${localesDir}`);
  process.exitCode = 1;
  process.exit();
}

if (!fs.existsSync(fallbackFile)) {
  console.error(`Fallback locale file not found: ${fallbackFile}`);
  process.exitCode = 1;
  process.exit();
}

function loadJson(filePath) {
  try {
    const contents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(`Failed to read or parse ${filePath}: ${error.message}`);
  }
}

function formatPath(base, segment) {
  if (base === "") return segment;
  if (segment.startsWith("[")) return `${base}${segment}`;
  return `${base}.${segment}`;
}

function compareStructures(reference, candidate, locale, currentPath, errors) {
  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) {
      errors.push(
        `[${locale}] Expected array at "${currentPath}" but found ${typeof candidate || "undefined"}`
      );
      return;
    }
    if (reference.length !== candidate.length) {
      errors.push(
        `[${locale}] Array length mismatch at "${currentPath}": expected ${reference.length}, found ${candidate.length}`
      );
    }
    const minLength = Math.min(reference.length, candidate.length);
    for (let index = 0; index < minLength; index += 1) {
      const nextPath = formatPath(currentPath, `[${index}]`);
      compareStructures(reference[index], candidate[index], locale, nextPath, errors);
    }
    return;
  }

  if (reference && typeof reference === "object") {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      errors.push(
        `[${locale}] Expected object at "${currentPath}" but found ${Array.isArray(candidate) ? "array" : typeof candidate}`
      );
      return;
    }
    const refKeys = Object.keys(reference);
    refKeys.forEach((key) => {
      const nextPath = formatPath(currentPath, key);
      if (!(key in candidate)) {
        errors.push(`[${locale}] Missing key "${nextPath}"`);
        return;
      }
      compareStructures(reference[key], candidate[key], locale, nextPath, errors);
    });
    Object.keys(candidate).forEach((key) => {
      if (!(key in reference)) {
        const extraPath = formatPath(currentPath, key);
        errors.push(`[${locale}] Extra key "${extraPath}"`);
      }
    });
    return;
  }

  const referenceType = reference === null ? "null" : typeof reference;
  const candidateType = candidate === null ? "null" : typeof candidate;
  if (referenceType !== candidateType) {
    errors.push(
      `[${locale}] Type mismatch at "${currentPath}": expected ${referenceType}, found ${candidateType}`
    );
  }
}

const fallbackData = loadJson(fallbackFile);
const locales = fs
  .readdirSync(localesDir)
  .filter((entry) => fs.statSync(path.join(localesDir, entry)).isDirectory());

const errors = [];

locales.forEach((locale) => {
  if (locale === fallbackLocale) {
    return;
  }
  const filePath = path.join(localesDir, locale, "common.json");
  if (!fs.existsSync(filePath)) {
    errors.push(`[${locale}] Missing locale file: ${filePath}`);
    return;
  }
  const candidateData = loadJson(filePath);
  compareStructures(fallbackData, candidateData, locale, "", errors);
});

if (errors.length > 0) {
  console.error("Locale parity check failed:\n" + errors.map((msg) => ` - ${msg}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Locale parity check passed for all locales.");
}
