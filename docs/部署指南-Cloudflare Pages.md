# 部署指南：GitHub → Cloudflare Pages

## 0. 当前已准备好的状态

我已经把部署前的准备工作做完了，你现在只需要「建仓库 → 推送 → 连线」三步：

| 项目 | 状态 |
|---|---|
| Git 仓库 | ✅ 已初始化，已有一次提交 |
| 纳入仓库的文件 | 151 个（不含未引用的重复素材） |
| 仓库体积 | 约 **46 MB**（GitHub 推送几十秒） |
| 图片优化 | ✅ 526 MB → **30 MB**，压缩到原来的 6% |
| 最大单文件 | 1.0 MB（Cloudflare Pages 上限 25 MB，安全） |
| 引用完整性 | ✅ 122 张图片全部校验通过，无死链 |
| 视频 | 走 Cloudflare R2（r2.dev），不占仓库体积 |

> 原图（未压缩的原始静帧）仍在桌面 `/Users/shuozaiyao/Desktop/薛嘉耀/作品集/个人网站`，没有丢。

---

## 1. 在 GitHub 上创建仓库

1. 打开 https://github.com/new 登录（没账号就注册一个，免费）
2. **Repository name**：`xuejiayao-portfolio`（随便起，英文）
3. 选 **Public**（Pages 免费版对私有仓库也支持，但公开更省事）
4. ⚠️ **不要**勾选 "Add a README file" 或 .gitignore（我们本地已经有了，勾了会冲突）
5. 点 **Create repository**

创建完页面会显示一个地址，形如：
```
https://github.com/你的用户名/xuejiayao-portfolio.git
```

---

## 2. 把本地代码推上去

**方式 A：命令行（推荐，复制粘贴即可）**

```bash
cd /Users/shuozaiyao/WorkBuddy/2026-08-23-00-39-39

git remote add origin https://github.com/你的用户名/xuejiayao-portfolio.git
git branch -M main
git push -u origin main
```

第一次 push 时 GitHub 会弹窗要你登录：
- 用户名填 GitHub 用户名
- **密码那里不能填登录密码**，要填 Personal Access Token：
  GitHub 头像 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → 勾选 `repo` → 生成 → 复制那串字符当密码用

**方式 B：GitHub Desktop（不想碰命令行就用这个）**

1. 下载 https://desktop.github.com ，登录 GitHub 账号
2. File → Add Local Repository → 选 `/Users/shuozaiyao/WorkBuddy/2026-08-23-00-39-39`
3. 左下角填 Summary → Commit to main
4. 顶部 **Publish repository** → 取消勾选 "Keep this code private" → Publish

推完刷新 GitHub 页面，能看到文件列表就成功了。

---

## 3. Cloudflare Pages 连接 GitHub

1. 登录 https://dash.cloudflare.com
2. 左侧菜单 **Compute (Workers)** → 或旧版界面是 **Workers & Pages**
3. **Create application** → 选 **Pages** 标签 → **Connect to Git**
4. 点 **Connect GitHub** → 授权 Cloudflare 访问你的 GitHub
   - 如果仓库没出现在列表里：点 "Only select repositories" 旁边的 **Edit repositories**，把刚才那个仓库加进去
5. 选中 `xuejiayao-portfolio` → **Begin setup**
6. 构建配置**照抄这一页**：

| 字段 | 填什么 |
|---|---|
| Project name | `xuejiayao-portfolio`（会变成网址前缀） |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **留空**（纯静态站点不需要构建） |
| Build output directory | **留空或填 `/`** |
| Root path | 留空 |

7. 点 **Save and Deploy**

第一次部署大概 1–2 分钟。完成后会给一个网址：
```
https://xuejiayao-portfolio.pages.dev
```
这个链接现在就能发给任何人看了，手机上也能直接打开。

---

## 4. 以后怎么更新网站

改完本地文件后，三条命令：

```bash
cd /Users/shuozaiyao/WorkBuddy/2026-08-23-00-39-39
git add -A
git commit -m "更新说明，比如：调整爆款展示排版"
git push
```

Cloudflare 会自动检测到推送并重新部署，约 1 分钟生效。**不用再操作 Cloudflare。**

---

## 5.（可选）绑定你自己的域名

等你买了域名之后：

1. 域名接入 Cloudflare（见 `docs/R2视频托管指南.md` 第 3 节的前置条件）
2. Cloudflare → 你的 Pages 项目 → **Custom domains** → **Set up a custom domain**
3. 填 `www.你的域名.com` → 点 **Activate domain**
4. Cloudflare 会自动加 DNS 记录并申请 HTTPS 证书，等几分钟变成 Active

想让 `你的域名.com`（不带 www）也能访问，再加一条，Cloudflare 会自动做跳转。

---

## 6. 常见坑

| 现象 | 原因 / 解决 |
|---|---|
| 部署成功但图片裂图 | 文件名大小写不对（GitHub/Linux 严格区分大小写）；确认本地能显示、且改动已 commit 并 push |
| 本地能看线上看不到 | 忘了 `git add -A`，或文件被 `.gitignore` 排除了 |
| 构建报错 | 检查 Build command 是否留空；Pages 单文件上限 25MB |
| 手机上背景错位/闪 | 已修（iOS Safari 不支持 `background-attachment: fixed`，已单独处理） |
| 视频打不开 | R2 的 r2.dev 地址有限流；长期方案见 `docs/R2视频托管指南.md` |
| 想回滚 | Cloudflare → 项目 → Deployments → 选中某次 → **Rollback** |

---

## 7. 上线前记得确认的一件事

**换掉联系方式占位**：首页名片卡里的电话、邮箱、微信二维码，确认是你真实想公开的信息。

（调试用的 `mobile-preview.html` 手机预览页已删除，不会出现在正式站点里。）
