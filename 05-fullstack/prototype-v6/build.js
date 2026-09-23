#!/usr/bin/env node
/**
 * Inlines all local <link> and <script src> tags into a single self-contained HTML file.
 * External URLs (http/https) are left as-is.
 *
 * Usage:
 *   node build.js               → writes dist/index.html
 *   node build.js --out foo.html → writes to a custom path
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = __dirname;
const argOut  = process.argv.indexOf('--out');
const outPath = argOut !== -1
  ? path.resolve(process.argv[argOut + 1])
  : path.join(ROOT, 'dist', 'index.html');

function readLocal(src) {
  return fs.readFileSync(path.join(ROOT, src), 'utf8');
}

function isExternal(src) {
  return /^https?:\/\//.test(src);
}

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Inline <link rel="stylesheet" href="...">
html = html.replace(
  /<link\s[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g,
  (match, href) => {
    if (isExternal(href)) return match;
    const css = readLocal(href);
    return `<style>\n${css}\n</style>`;
  }
);

// Also handle href-before-rel order
html = html.replace(
  /<link\s[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/g,
  (match, href) => {
    if (isExternal(href)) return match;
    const css = readLocal(href);
    return `<style>\n${css}\n</style>`;
  }
);

// Inline <script src="..."></script>
html = html.replace(
  /<script\s[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,
  (match, src) => {
    if (isExternal(src)) return match;
    const js = readLocal(src);
    return `<script>\n${js}\n</script>`;
  }
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');

const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`✓ Built ${path.relative(ROOT, outPath)} (${kb} KB)`);
