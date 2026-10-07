# 部署指南：GitHub → Cloudflare Pages

## 0. 当前已准备好的状态

我已经把部署前的准备工作做完了，你现在只需要「建仓库 → 推送 → 连线」三步：

| 项目 | 状态 |
|---|---|
| Git 仓库 | ✅ 已初始化，已有 3 次提交 |
| 纳入仓库的文件 | 150 个（不含未引用的重复素材） |
| 仓库体积 | 约 **46 MB**（GitHub 推送几十秒） |
| 图片优化 | ✅ 526 MB → **30 MB**，压缩到原来的 6% |
| 最大单文件 | 1.0 MB（Cloudflare Pages 上限 25 MB，安全） |
| 引用完整性 | ✅ 122 张图片全部校验通过，无死链 |
| 视频 | 走 Cloudflare R2（r2.dev），不占仓库体积 |

> 原图（未压缩的原始静帧）仍在桌面 `/Users/shuozaiyao/Desktop/薛嘉耀/作品集/个人网站`，没有丢。

---

## 1. 在 GitHub 网页上建一个空仓库（你已登录，直接点）

1. 浏览器打开 **https://github.com/new**
   （或：GitHub 首页右上角点 **+** → **New repository**）
2. **Repository name** 填：`xjy-portfolio`
3. 下面选 **Public**（公开）或 **Private**（私有）都可以 —— **Cloudflare Pages 两种都支持**，不影响部署。
   建议选 Public：作品集源码没什么可藏的，公开还能白嫖一份云端备份。
4. ⚠️ 页面下半部分那几个复选框 —— **全都不要勾**：
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   （我们本地已经有了，勾了会和本地文件冲突，反而麻烦）
5. 点右下角绿色的 **Create repository**

点完会跳到一个新页面，中间有一块灰色代码区，里面写着地址，形如：
```
https://github.com/你的用户名/xjy-portfolio.git
```
**把「你的用户名」那部分记住**（就是你 GitHub 的账号名），第 2 步要用。

---

## 2. 把网站文件传上去

> 你问的「复制粘贴粘贴在哪里」—— 粘贴到**「终端」**这个程序里。
> 下面方式 A 是鼠标操作、完全不用敲命令；方式 B 才需要终端，我把「终端是什么、怎么开、怎么粘」也写清楚了。**推荐先用方式 A。**

### 方式 A：GitHub Desktop（鼠标点，不用敲命令）

1. 下载安装：https://desktop.github.com （打开后点 Download for macOS，装完打开）
2. 打开后 → **Sign in to GitHub.com** → 点 **Continue with browser**
   → 会跳到浏览器，因为你已经登录了，直接点 **Authorize** 授权即可，自动回到软件
3. 软件左上角菜单 **File** → **Add Local Repository...**
4. 弹出的窗口里点 **Choose...**，选中这个文件夹：
   `/Users/shuozaiyao/WorkBuddy/2026-08-23-00-39-39`
   > 找文件夹的快捷办法：在访达里按 `Shift + Command + G`，把上面这串路径粘进去回车，就能直接跳到那个文件夹
5. 选好后点 **Add Repository**
6. 如果左下角提示有未提交的改动：Summary 随便填「初次上传」，点 **Commit to main**
   （如果你之前已经让我提交过，这里可能是空的，空的就跳过这步）
7. 如果之前那个仓库被删过，顶部中间会重新出现 **Publish repository** 按钮 —— 点它
8. 弹窗里三项：
   - **Name** 填 `xjy-portfolio`
   - **Description** 可留空
   - **去掉 "Keep this code private" 的勾**（这样是 Public；想私有就留着，Cloudflare 同样支持）
9. 点 **Publish Repository**，等它转圈（46MB，快的话十几秒）

✅ **成功标志**：回浏览器刷新 `github.com/Warrenxjy/xjy-portfolio`，能看到 `index.html`、`assets`、`pages` 这些文件列表。

> ⚠️ 如果 Publish 之后又弹出「repository does not seem to exist」：说明本地还残留着旧仓库地址。在软件里点 **Repository → Repository settings... → Remote**，把 Primary remote 的地址删掉，关掉再打开就能重新 Publish 了。

---

### 方式 B：用终端命令行

#### B-1. 「终端」是什么、怎么打开

终端是 macOS 自带的一个黑（或白）底窗口，在里面敲文字命令来控制电脑。

**打开方式（任选一种）：**
- 按 `Command (⌘) + 空格` → 输入 `终端` 或 `Terminal` → 回车
- 或者：访达 → 左侧「应用程序」→ 进去找「实用工具」文件夹 → 双击「终端」

打开后你会看到一个窗口，里面有一行类似这样、结尾带光标闪烁的文字：
```
shuozaiyao@MacBook-Pro ~ %
```
这就说明可以输入了。

#### B-2. 怎么把命令「粘贴」进去

1. 从本文档里**选中并复制**一条命令（⌘+C）
2. **鼠标点一下终端窗口**，让光标在闪
3. 按 **⌘ + V** 粘贴
   - 如果按 ⌘+V 没反应：在终端窗口里**右键 → 选择「粘贴」**
4. 按 **回车** 执行
5. 等它跑完（光标重新出现、可以再次输入），再粘下一条

⚠️ **一次只粘一行，粘一行按一次回车。** 不要三行一起粘。

#### B-3. 依次执行这四条命令

**第 1 条**（进入网站文件夹）：
```bash
cd /Users/shuozaiyao/WorkBuddy/2026-08-23-00-39-39
```
执行后看起来没什么变化，是正常的。

**第 2 条**（告诉 git 仓库在哪 —— 把 `你的用户名` 换成你刚才记下的 GitHub 用户名）：
```bash
git remote add origin https://github.com/你的用户名/xjy-portfolio.git
```
> 比如你的用户名是 `jiayao`，这条就写成：
> `git remote add origin https://github.com/jiayao/xjy-portfolio.git`
> 没有任何输出 = 成功了。
> 如果报错 `error: remote origin already exists`，改成执行：
> `git remote set-url origin https://github.com/你的用户名/xjy-portfolio.git`

**第 3 条**（确认分支名）：
```bash
git branch -M main
```

**第 4 条**（上传）：
```bash
git push -u origin main
```

这一步会弹登录：
- 如果弹出一个**浏览器窗口**让你授权 → 直接点 Authorize，最简单
- 如果终端里问 `Username:` 和 `Password:`：
  - Username 填 GitHub 用户名
  - **Password 不能填你的登录密码**，要填「个人访问令牌」，生成方法见下面 B-4

> 第一次执行 `git` 命令时，macOS 可能弹一个「需要安装命令行开发者工具」的安装框 —— 点「安装」，装完**重新执行那一条命令**。

✅ **成功标志**：终端里出现类似这样的几行，最后写着分支名：
```
Enumerating objects: 152, done.
...
To https://github.com/你的用户名/xjy-portfolio.git
 * [new branch]      main -> main
```
然后刷新 GitHub 页面，能看到文件列表就成了。

#### B-4. 生成「个人访问令牌」（只在 B-3 要你填密码时才需要）

1. 浏览器打开 https://github.com/settings/tokens
   （路径：GitHub 右上角头像 → Settings → 左侧最下面 Developer settings → Personal access tokens → Tokens (classic)）
2. 点 **Generate new token** → 选 **Generate new token (classic)**
3. **Note** 随便填，比如 `portfolio-upload`
4. **Expiration** 选 30 days（用一个月就够了，到期自动失效，安全）
5. 勾选 **`repo`**（把第一项那个大勾勾上，它下面的子项会自动全选）
6. 拉到最下面点 **Generate token**
7. **页面上会显示一串绿色字符（ghp_ 开头），马上复制下来** —— 这个页面刷新后就再也看不到了
8. 回到终端，在 Password 那里粘贴它（粘贴后屏幕上不会显示任何字符，这是正常的防偷窥设计，直接按回车）

#### B-5. 常见报错对照

| 终端显示 | 什么意思 / 怎么办 |
|---|---|
| `remote: Repository not found` | 地址里的用户名或仓库名写错了，回到第 2 条重设一次 |
| `Authentication failed` | 密码填成了登录密码，要用 B-4 的令牌 |
| `Permission denied (publickey)` | 说明走的是 SSH 方式，改用 HTTPS 地址（第 2 条那种 `https://` 开头的） |
| `failed to push some refs` | 网页上建仓库时不小心勾了 README，回到 GitHub 网页把那个文件删掉，再重试第 4 条 |
| 一直在转圈没动静 | 46MB 上传需要一点时间，耐心等 1–3 分钟 |

---

## 3. Cloudflare Pages 连接 GitHub

1. 登录 https://dash.cloudflare.com
2. 左侧菜单 **Compute (Workers)** → 或旧版界面是 **Workers & Pages**
3. **Create application** → 选 **Pages** 标签 → **Connect to Git**
4. 点 **Connect GitHub** → 授权 Cloudflare 访问你的 GitHub
   - 如果仓库没出现在列表里：点 "Only select repositories" 旁边的 **Edit repositories**，把刚才那个仓库加进去
5. 选中 `xjy-portfolio` → **Begin setup**
6. 构建配置**照抄这一页**：

| 字段 | 填什么 |
|---|---|
| Project name | `xjy-portfolio`（会变成网址前缀） |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **留空**（纯静态站点不需要构建） |
| Build output directory | **留空或填 `/`** |
| Root path | 留空 |

7. 点 **Save and Deploy**

第一次部署大概 1–2 分钟。完成后会给一个网址：
```
https://xjy-portfolio.pages.dev
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
