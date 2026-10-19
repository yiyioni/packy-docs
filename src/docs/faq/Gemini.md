---
title: Gemini相关问题
icon: vscode-icons:file-type-gemini
order: 3
---

[[toc]]

### 关于 Gemini CLI

::: danger 不提供 Gemini CLI 教程
Google 官方 **Gemini CLI**（`@google/gemini-cli`）目前稳定性较差，常见无法正常调用模型、无法粘贴图片等问题，**几乎无法正常使用**。

因此本站**已移除** Gemini CLI 的安装与配置教程，也**不推荐**继续折腾该工具。
:::

若需要使用 Gemini 模型，请改用支持 **OpenAI 兼容接口** 的工具，例如：

- **Cline**（见下方教程）
- **Roo Code**
- [OpenCode](/docs/advanced/OpenCode.html)
- [AionUI](/docs/advanced/AionUI.html)

令牌请创建 [Gemini](/docs/token/2-group.html#gemini分组) 或更稳的 [Gemini-slb](/docs/token/2-group.html#gemini-slb分组) 分组；企业官方渠道可选 [Gemini-officially](/docs/token/2-group.html#gemini-officially分组)。

### 如何在 Cline 使用 Gemini

#### 软件要求

| 软件 | 版本要求 | 下载链接 |
| --- | --- | --- |
| **VSCode** | 1.80.0+ | [下载 VSCode](https://code.visualstudio.com/) |

#### 1. 创建 Gemini 分组令牌

按照 [创建 API 令牌](/docs/register/4-token.html) 的方法，创建 **Gemini** 或 **Gemini-slb** 分组令牌：

![创建 API 选择分组示意图](/assets/image/FAQ/Gemini/002.webp)

#### 2. 安装 Cline 插件

- 打开 VSCode
- 单击左侧边栏的 **扩展** 图标（或按 `Ctrl+Shift+X` / `Cmd+Shift+X`）
- 在搜索框输入 **Cline**
- 找到 Cline 插件，单击 **安装**

::: info 安装提示
- 安装完成后，左侧边栏会出现 Cline 图标
- 首次使用需要配置 API Key
- 建议安装最新版本以获得最佳体验
:::

#### 3. 打开 Cline 界面

安装完成后，有两种方式打开 Cline：

**方式一：侧边栏图标**

- 单击 VSCode 左侧边栏的 Cline 图标

**方式二：命令面板**

- 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
- 输入 `Cline: Open`
- 按 Enter

#### 4. 首次配置

打开 Cline 界面后，按以下步骤配置：

1. 单击 **API Configuration** 按钮
2. 按下方填写配置信息

```yaml
API Provider: Google Gemini
Google Gemini API Key: 你的 Packy API Key（如 sk-******）
Use custom base URL: 勾选并填写 https://cf.api.fan/v1beta/models/gemini-4-argon:generateContent
Model: gemini-4-argon
Reasoning Effort: Medium
```

![Cline 配置界面示意图](/assets/image/FAQ/Gemini/003.webp)

::: warning 安全提醒
请妥善保管你的 `API Key`，不要在群聊或公开截图中泄露。
:::

::: details 已有用户提示
如果您之前使用过 Cline，请单击右上角的 **⚙️ 设置**按钮进入配置界面。
:::

**配置参数说明**

| 配置项 | 推荐值 | 说明 |
| --- | --- | --- |
| **API Provider** | `Google Gemini` | 选择 Google Gemini 原生提供商 |
| **Google Gemini API Key** | `sk-******` | 你的 Packy API Key |
| **Use custom base URL** | 勾选，并填写 `https://cf.api.fan/v1beta/models/gemini-4-argon:generateContent` | 自定义基础端点地址 |
| **Model** | `gemini-4-argon` | 手动输入目标模型名（提示不在列表中直接确认即可） |
| **Reasoning Effort** | `Medium` | 思考力度（可按需选择） |

#### 5. 完成配置

单击右上角 **Done** 保存。
