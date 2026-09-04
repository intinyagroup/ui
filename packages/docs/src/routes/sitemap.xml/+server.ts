import type { RequestHandler } from './$types';
import { base } from '$app/paths';

const SITE = 'https://ui.intinya.id';

const staticPages = [
  '/',
  '/docs',
  '/docs/getting-started',
  '/docs/tokens',
  '/docs/themes',
  '/docs/components',
  '/examples',
];

// Component docs (124 pages — generated from filesystem)
function componentPages(): string[] {
  const fs = require('node:fs');
  const path = require('node:path');
  const dir = path.join(process.cwd(), 'src/routes/docs/components');
  return fs.readdirSync(dir)
    .filter((f: string) => fs.existsSync(path.join(dir, f, '+page.md')))
    .map((f: string) => `/docs/components/${f.replace('.md', '')}`);
}

function themePages(): string[] {
  const fs = require('node:fs');
  const path = require('node:path');
  const dir = path.join(process.cwd(), 'src/routes/docs/themes');
  return fs.readdirSync(dir)
    .filter((f: string) => fs.existsSync(path.join(dir, f, '+page.md')))
    .map((f: string) => `/docs/themes/${f}`);
}

export const prerender = true;

export const GET: RequestHandler = async () => {
  const pages = [...staticPages, ...componentPages(), ...themePages()];
  const urls = pages
    .map((p) => `  <url>
    <loc>${SITE}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : p.startsWith('/docs') ? '0.8' : '0.6'}</priority>
  </url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  });
};