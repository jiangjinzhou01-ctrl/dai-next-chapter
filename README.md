# 戴老师的下一站

**THE NEXT CHAPTER — 来自 2603 班的礼物**

一份完整的手机优先互动纪念网站。八个章节，从「戴总预备名片」的轻松玩笑，到「这里，永远是戴老师的港湾」。默认 `uncertain`，没有宣布离任或创业结果。

## 运行

需要 Node.js 22 或更新的 LTS 版本。

```bash
npm ci
npm run dev
```

浏览器打开终端显示的地址。正式构建与预览：

```bash
npm test
npm run build
npm run preview
```

`dist/` 是完整静态网站，不需要服务器程序、数据库或 API Key。浏览器不加载第三方字体、脚本、图片或运行时 CDN。

## 修改内容

| 文件 | 内容 |
| --- | --- |
| `src/data/site.ts` | 老师与班级信息、各章文案、图片路径、结尾状态、整封信 |
| `src/data/quotes.ts` | 真实语录及展示顺序 |
| `src/data/memories.ts` | 时间线、照片、小故事、记忆碎片 |
| `src/data/messages.ts` | 收集、审核后的全班留言 |
| `src/motion/tokens.ts` | 全站缓动、时长、模糊与位移 |

时间线、故事和公共留言默认是空数组。照片档案预留了您提供的 2026 年 10 月 10 日教室照片，`consent: false`，待取得相关人员公开展示同意后再发布。没有虚构日期、活动或同学发言。`order` 越小越靠前；每条数据的 `id` 必须唯一。

### 照片与回忆

把得到授权的图片放进 `public/media/`，例如 `public/media/class-photo.webp`。在 `photos` 中添加：

```ts
{
  id: 'class-photo-01',
  title: '在这里填写真实照片的标题',
  body: '',
  photo: 'media/class-photo.webp',
  alt: '在这里填写照片内容，便于屏幕阅读器理解',
  caption: '在这里填写真实说明',
  order: 0,
  consent: true,
}
```

这是字段填写示意，不是默认展出的回忆。时间线和故事也使用同一数据类型；`date` 可省略。涉及人物、姓名或私人经历的信息应先取得同意，`consent: false` 不会展示。`fragments` 可添加简短文字与照片。图片支持点开、键盘左右切换、Escape 关闭；手机照片与语录可左右滑动。

首屏的 `afternoon-light.webp` 是抽象光影，不代表老师或班级的真实场景。可以把 `site.media.hero` 换成授权的教室照片。最后一屏的照片在 `site.media.finale` 配置，只有 `src` 不为空且 `consent: true` 才展示。没有照片时保留安静的抽象光线。

推荐 WebP 或 JPEG，长边 1600–2000 px，一般控制在 500 KB 以内。无需把图片上传到外部图床。

### 全班留言

预先收集 → 本人同意公开 → 人工确认 → 写入 `messages.ts` → 提交到 GitHub。

```ts
{
  id: 'message-01',
  content: '在这里粘贴真实收集到的留言',
  author: '匿名同学',
  // date 可省略，不能编造日期
  order: 0,
  approved: true,
}
```

只有 `approved: true` 的留言会公开。网站中的「写一句话」是个人草稿工具：只保存到当前浏览器的 localStorage，不会向网络发送，不会同步其他设备。点击「导出留言」可下载 JSON，交给负责整理的同学。导出的文件默认 `approved: false`，审核并得到许可后再收录。保存受浏览器限制时会提示导出，不会假装提交成功。关闭页面前要保留未保存的文字。

公开仓库中的源文件也可被查看，未授权的照片或私人信息请不要提交到仓库。

### 更改结尾

修改 `site.ts` 中的 `state`：

| 状态 | 使用条件 |
| --- | --- |
| `uncertain` | 默认；去向未确定 |
| `farewell` | 得到本人确认，确定即将分别 |
| `reunion` | 用于未来重聚主题，文案表达期待，不自动宣布已经回访 |

对应文字在 `endings`，信件开头随状态变化，信件其余段落在 `letter` 单独修改。最后的港湾核心句保留在 `copy.harbor.core`。创业有新进展时，请按真实情况自行改文案，不要把「预留」改成未经确认的成功认证。

## GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。

1. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 推送到 `main` 后自动安装、验证、构建并发布；也能在 Actions 手动运行工作流。
3. 工作流根据 Pages 返回的路径自动设置 `SITE_BASE`，兼容 `https://用户名.github.io/仓库名/`。

本地模拟仓库子路径：

```bash
SITE_BASE=/dai-next-chapter/ npm run build
npm run preview
```

打开 `/dai-next-chapter/`。所有图片和字体都使用正确的构建路径，页面跳转使用章节锚点，不依赖服务器路由。构建会生成独立 404、`.nojekyll`、分享信息。线上构建还会生成规范链接、sitemap 与 robots.txt。

### 自定义域名

在 Settings → Pages 填写已有域名，并按 GitHub 页面给出的 DNS 提示配置。工作流会自动使用新的 Pages origin 与 base path，一般不需要改代码。更新域名后手动重新运行一次部署工作流。没有自定义域名也能直接使用免费的 GitHub Pages 地址。

本站没有外部运行时依赖；GitHub Pages 在不同大陆网络的连接质量仍可能不同，无法保证每个运营商都稳定。部署不要求购买域名或云服务。

## 动效与可访问性

统一的轻微高斯模糊文字揭示；时间章节与砖块章节用 Motion 的滚动值驱动，连续滚动不反复更新整个 React 组件树。没有 wheel/touch 拦截，没有强制横向滚动。原生 `dialog` 负责弹窗焦点圈定与 Escape，标签支持方向键切换，操作有焦点样式。开场 4 秒，可跳过，也可直接滚动。页脚可重播。

`prefers-reduced-motion`、省流模式、少核/低内存设备会使用静态布局或降低非必要动效，完整内容仍然可读。音频未加入，因此无自动播放。

中文展示字体是本地 Noto Serif SC 的当前文案子集（OFL，许可证在 `public/fonts/OFL.txt`）。新增的字会使用系统宋体或衬线字体回退，不会显示方框。如需要新文案也保持完全相同的字体，可以用 FontTools 重新生成子集；这只是排版优化，正常更新内容无需 Python。

## 目录

```text
src/
  App.tsx
  components/       文字揭示、原生弹窗、档案、留言
  data/             所有可编辑内容
  motion/           动效参数
  styles/           字体与手机优先样式
public/             静态图片、分享封面、图标、字体许可
scripts/            数据验证与静态构建处理
.github/workflows/  GitHub Pages 自动部署
```
