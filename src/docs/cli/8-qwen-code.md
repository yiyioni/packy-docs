---
title: Qwen Code配置
icon: /assets/icon/qwen.png
order: 8
---

Qwen Code 是通义千问（Qwen）官方推出的终端 AI 编码助手，启动命令为 `qwen`。本教程介绍如何通过 PackyAPI 的 OpenAI 兼容接口，在 Qwen Code 中配置并调用 `qwen3.8-max-0902` 等模型。

::: info 官方文档参考
更多关于 MCP、Agent Skills 等高级扩展能力请参考官方文档：
- [Qwen Code 官方项目](https://github.com/QwenLM/qwen-code)
- [Qwen Code 模型提供商配置文档](https://qwenlm.github.io/qwen-code-docs/zh/users/configuration/model-providers/)
- [Qwen Code 身份验证文档](https://qwenlm.github.io/qwen-code-docs/zh/users/configuration/auth/)
:::

::: warning 不要泄露 API 令牌
请妥善保管你的 API 令牌，切勿将包含真实密钥的 `.env` 或 `settings.json` 提交到公开 Git 仓库，也不要在截图、工单或公开交流中展示完整密钥。
:::

## 准备工作

开始前，请确认以下准备已就绪：

1. **Node.js 环境**：需要 Node.js `22` 或更高版本。
2. **PackyAPI 令牌**：参考 [创建 API 令牌](/docs/register/4-token.html)，在控制台创建拥有调用对应模型权限的令牌。

连接信息概览：

| 配置项 | 填写内容 | 说明 |
| :--- | :--- | :--- |
| **API 协议** | OpenAI 兼容 | 使用 `modelProviders.openai` |
| **接口地址 (baseUrl)** | `https://cf.api.fan/v1` | **必须包含 `/v1`**，不要拼接 `/chat/completions` |
| **模型 ID** | `qwen3.8-max-0902` | 或参考 [模型广场](/docs/token/1-intro.html) 中的实际可用模型 ID |
| **API Key** | 你的 PackyAPI 令牌 | 保存在 `.env` 文件中通过环境变量加载 |

## 安装 Qwen Code

Windows 用户打开 PowerShell / CMD，macOS / Linux 用户打开终端，执行以下步骤：

1. 检查 Node.js 版本（要求 `22` 及以上）：

```bash
node --version
npm --version
```

2. 使用 npm 全局安装最新版 Qwen Code：

```bash
npm install -g @qwen-code/qwen-code@latest
```

3. 检查安装是否成功：

```bash
qwen --version
```

能够正确输出版本号即表示安装成功。如果提示找不到 `qwen`，请关闭终端后重新打开再试。

## 配置文件说明

Qwen Code 的用户配置默认保存在用户主目录下的 `.qwen` 文件夹中，主要涉及以下两个文件：

| 配置文件 | 用途说明 |
| :--- | :--- |
| `settings.json` | 核心配置文件，用于配置接口 Base URL、模型 ID、显示名称与认证协议 |
| `.env` | 环境变量文件，安全存放用于调用的 API Key（启动时由 Qwen Code 自动加载） |

::: tabs

@tab Windows

键盘按下 `Win + R`，输入以下路径打开配置目录：

```text
%USERPROFILE%\.qwen
```

如果目录或文件尚未生成，可在 PowerShell 中执行以下命令创建并用记事本打开：

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.qwen" | Out-Null
notepad "$env:USERPROFILE\.qwen\settings.json"
```

编辑 `.env` 密钥文件：

```powershell
notepad "$env:USERPROFILE\.qwen\.env"
```

> [!important]
> Windows 用户请确认开启“文件扩展名”显示，避免文件被误存为 `settings.json.txt` 或 `.env.txt`。

@tab macOS / Linux

配置文件默认位于：

```text
~/.qwen/settings.json
~/.qwen/.env
```

可在终端执行命令创建目录并编辑：

```bash
mkdir -p ~/.qwen
# 编辑设置文件
nano ~/.qwen/settings.json
# 编辑密钥文件
nano ~/.qwen/.env
```

:::

## 配置 settings.json

将以下配置内容写入 `settings.json`：

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3.8-max-0902",
        "name": "Qwen3.8 Max via PackyAPI",
        "envKey": "PACKY_API_KEY",
        "baseUrl": "https://cf.api.fan/v1"
      }
    ]
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "qwen3.8-max-0902"
  }
}
```

::: tip 配置项说明
- `baseUrl`：PackyAPI 的 OpenAI 兼容接口地址，填写为 `https://cf.api.fan/v1`（**请勿拼接 `/chat/completions`**）。
- `id` 与 `model.name`：目标模型 ID（此处以 `qwen3.8-max-0902` 为例），需与 [模型广场](/docs/token/1-intro.html) 提供的模型 ID 一致。
- `name`：在模型选择列表中的自定义显示名称。
- `envKey`：保存 API Key 的环境变量名称，此处为 `PACKY_API_KEY`。
- `security.auth.selectedType`：认证协议类型，必须填写 `openai`。
:::

## 配置 API Key (.env)

在 `.qwen` 目录下的 `.env` 文件中填入你在 PackyAPI 创建的令牌：

```dotenv
PACKY_API_KEY=sk-替换为你的真实API令牌
```

> [!note] 环境变量对应关系
> `settings.json` 中的 `envKey` 填写的是变量名 `PACKY_API_KEY`，真正的密钥值填写在 `.env` 文件的等号右侧。

macOS / Linux 用户建议限制密钥文件的访问权限：

```bash
chmod 600 ~/.qwen/.env
```

## 启动与验证

配置完成后，在任意项目目录下打开终端，执行：

```bash
qwen
```

进入交互界面后，发送一条测试消息：

```text
你好，请只回复：连接成功
```

若能正常收到回复，即表示 Qwen Code 已成功接入 PackyAPI！

### 切换模型或单次调用

- **切换模型**：在 Qwen Code 交互界面中输入 `/model`，即可查看并切换已配置的 PackyAPI 供应商模型。
- **单次命令行测试**：无需进入交互界面，可直接在终端中运行：

```bash
qwen "请只回复 ok，不要调用任何工具"
```

## 常见问题

### 1. 提示找不到 `qwen` 命令
确认安装命令已成功完成，关闭终端后重新打开。如果仍找不到，请检查 npm 全局可执行文件目录是否已加入系统 `PATH`。

### 2. 启动后仍提示登录或选择认证方式
检查 `settings.json` 中 `security.auth.selectedType` 是否配置为 `"openai"`。Qwen Code 使用 PackyAPI 时走 OpenAI 兼容协议，无需登录阿里云官方账号。同时检查 JSON 文件语法是否有括号或逗号缺失。

### 3. 提示找不到 `PACKY_API_KEY`
确认 `.env` 文件位于用户主目录的 `.qwen` 文件夹中（无 `.txt` 后缀），且变量名与 `settings.json` 中的 `envKey` 完全一致（`PACKY_API_KEY`）。

若需临时测试，也可在终端直接导出变量后再启动：

::: tabs

@tab Windows PowerShell
```powershell
$env:PACKY_API_KEY = "sk-你的真实令牌"
qwen
```

@tab macOS / Linux
```bash
export PACKY_API_KEY="sk-你的真实令牌"
qwen
```

:::

### 4. 报错 401（未授权或无效令牌）
检查 API Key 是否复制完整、是否带有前后多余空格，以及令牌在控制台是否处于启用状态且额度充足。

### 5. 报错 404（模型不存在或渠道不可用）
确认 `baseUrl` 为 `https://cf.api.fan/v1`，且模型 ID 在 [模型广场](/docs/token/1-intro.html) 中存在且当前可用。
