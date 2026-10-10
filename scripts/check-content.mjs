import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';

const readData = file => {
  const source = readFileSync(file, 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const mod = { exports: {} };
  // 数据配置没有外部 I/O；将 Vite 的 base 访问替换为静态常量后加载。
  new Function('exports', 'module', outputText.replace(/import\.meta\.env\.BASE_URL/g, '"/"'))(mod.exports, mod);
  return mod.exports;
};
const { site } = readData('src/data/site.ts');
const { quotes } = readData('src/data/quotes.ts');
const { timeline, photos, stories, fragments } = readData('src/data/memories.ts');
const { messages } = readData('src/data/messages.ts');
assert.equal(site.chapters.length, 8);
assert.ok(['uncertain', 'farewell', 'reunion'].includes(site.state));
assert.equal(new Set(site.chapters.map(c => c.id)).size, 8);
for (const state of ['uncertain', 'farewell', 'reunion']) assert.ok(site.endings[state].letterOpening && site.endings[state].line);
const quoteTexts = quotes.map(q => q.text.replace(/\n/g, ''));
for (const known of ['如果成功了，就叫我戴总。', '你搬砖，我砌灰。']) assert.ok(quoteTexts.includes(known), '保留真实的初始语录');
for (const group of [timeline, photos, stories, fragments, messages]) {
  assert.equal(new Set(group.map(item => item.id)).size, group.length, '重复数据 ID');
  for (const item of group) assert.ok(Number.isFinite(item.order));
}
const media = [...timeline, ...photos, ...stories, ...fragments].filter(item => item.consent && item.photo);
for (const item of media) { assert.ok(!/^(https?:|data:|\/\/)/.test(item.photo), '图片应当放在本地 public 目录'); readFileSync(`public/${item.photo.replace(/^\//, '')}`); }
if (site.media.finale.consent && site.media.finale.src) readFileSync(`public/${site.media.finale.src}`);
assert.ok(site.copy.harbor.core.join('').includes('永远是戴老师的港湾'));
console.log('8 chapters, 3 content states, quotes and local media configuration verified.');
