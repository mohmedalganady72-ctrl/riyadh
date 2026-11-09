import { defineConfig } from 'astro/config';

// Set the real production origin: used for canonical, hreflang and sitemap.
export default defineConfig({ site: 'https://YOUR-DOMAIN.com', trailingSlash: 'always', build: { format: 'directory' } });
