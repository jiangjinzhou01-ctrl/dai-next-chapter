import { readFileSync, writeFileSync, existsSync } from 'node:fs';

let html = readFileSync('dist/index.html', 'utf8');
const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
if (siteUrl) {
  html = html.replace(/(<meta property="og:image" content=")[^"]+("\s*\/?>)/, `$1${siteUrl}/social-cover.png$2`);
  html = html.replace('</head>', `  <meta property="og:url" content="${siteUrl}/" />\n    <link rel="canonical" href="${siteUrl}/" />\n  </head>`);
  writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc></url></urlset>`);
  writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}
writeFileSync('dist/index.html', html);
writeFileSync('dist/.nojekyll', '');
// 独立 404 不用 SPA 路由补偿，返回站点入口；从构建后的脚本路径推导正确 base。
const base = html.match(/src="([^\"]+)assets\//)?.[1] || '/';
const errorPage = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#242723"><title>这一页还没写下 | 戴老师的下一站</title><style>body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#eeeae2;color:#292b26;font-family:system-ui,sans-serif}main{padding:30px;max-width:520px}p{line-height:2;color:#6b6b61}h1{font-size:2rem;font-weight:400;line-height:1.6}a{display:inline-block;color:inherit;text-decoration:none;border-bottom:1px solid #a14f35;padding:14px 0;margin-top:24px}a:focus-visible{outline:2px solid #a14f35;outline-offset:5px}small{letter-spacing:.15em}</style></head><body><main><small>2603 CLASS / 404</small><h1>这一页，还没有写下。</h1><p>回到故事的开头，继续读戴老师的下一站。</p><a href="${base}">回到故事</a></main></body></html>`;
writeFileSync('dist/404.html', errorPage);
for (const file of ['dist/media/afternoon-light.webp', 'dist/social-cover.png', 'dist/favicon.svg']) {
  if (!existsSync(file)) throw new Error(`Missing deliverable: ${file}`);
}
console.log('Static metadata, subpath-aware 404 and .nojekyll ready.');
