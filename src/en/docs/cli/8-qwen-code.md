---
title: Qwen Code Setup
icon: /assets/icon/qwen.png
order: 8
---

Qwen Code is the official terminal AI coding assistant from Qwen, launched via the `qwen` command. This guide shows how to configure and use models like `qwen3.8-max-0902` in Qwen Code through PackyAPI's OpenAI-compatible interface.

::: info Official Documentation
For advanced features like MCP and Agent Skills, please refer to:
- [Qwen Code GitHub](https://github.com/QwenLM/qwen-code)
- [Qwen Code Model Providers Guide](https://qwenlm.github.io/qwen-code-docs/zh/users/configuration/model-providers/)
- [Qwen Code Authentication Guide](https://qwenlm.github.io/qwen-code-docs/zh/users/configuration/auth/)
:::

::: warning Keep API Keys Secure
Keep your API key private. Do not commit `.env` or `settings.json` containing sensitive keys to public repositories or show complete tokens in screenshots.
:::

## Prerequisites

Before configuring, make sure you have:

1. **Node.js**: Node.js `22` or newer.
2. **PackyAPI Token**: As detailed in [Create API Token](/en/docs/register/4-token.html), create a token with permissions to call the desired model.

Connection parameters summary:

| Parameter | Value | Note |
| :--- | :--- | :--- |
| **Protocol** | OpenAI Compatible | Under `modelProviders.openai` |
| **Base URL** | `https://cf.api.fan/v1` | **Must include `/v1`**, do not append `/chat/completions` |
| **Model ID** | `qwen3.8-max-0902` | Or any live model ID from [Model Square](/en/docs/token/1-intro.html) |
| **API Key** | Your PackyAPI Token | Saved in `.env` and referenced via environment variable |

## Install Qwen Code

Open PowerShell / CMD on Windows, or Terminal on macOS / Linux:

1. Verify Node.js version (`22+` required):

```bash
node --version
npm --version
```

2. Globally install the latest Qwen Code package:

```bash
npm install -g @qwen-code/qwen-code@latest
```

3. Verify installation:

```bash
qwen --version
```

If the version number is returned, installation is complete. If the command is not found, restart your terminal.

## Configuration Files

User configuration for Qwen Code is stored in the `.qwen` folder in your home directory:

| File | Purpose |
| :--- | :--- |
| `settings.json` | Main configuration for Base URL, model IDs, names, and auth mode |
| `.env` | Environment file storing your API Key (automatically loaded by Qwen Code) |

::: tabs

@tab Windows

Press `Win + R`, enter `%USERPROFILE%\.qwen` and press Enter.

If the folder does not exist, run in PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.qwen" | Out-Null
notepad "$env:USERPROFILE\.qwen\settings.json"
```

Edit the `.env` secret file:

```powershell
notepad "$env:USERPROFILE\.qwen\.env"
```

> [!important]
> Make sure file extensions are visible in File Explorer to prevent saving as `settings.json.txt` or `.env.txt`.

@tab macOS / Linux

Configuration paths:

```text
~/.qwen/settings.json
~/.qwen/.env
```

Create and edit via terminal:

```bash
mkdir -p ~/.qwen
nano ~/.qwen/settings.json
nano ~/.qwen/.env
```

:::

## Configure settings.json

Add the following JSON configuration to `settings.json`:

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

::: tip Parameter Details
- `baseUrl`: PackyAPI OpenAI-compatible endpoint: `https://cf.api.fan/v1` (do not append `/chat/completions`).
- `id` & `model.name`: Target model ID (e.g. `qwen3.8-max-0902`), matching available models in [Model Square](/en/docs/token/1-intro.html).
- `name`: Display name shown in model selection.
- `envKey`: Environment variable name pointing to your key (`PACKY_API_KEY`).
- `security.auth.selectedType`: Authentication protocol, set to `openai`.
:::

## Configure API Key (.env)

In `~/.qwen/.env`, write your PackyAPI key:

```dotenv
PACKY_API_KEY=sk-your-real-packyapi-token
```

On macOS / Linux, restrict permissions:

```bash
chmod 600 ~/.qwen/.env
```

## Launch and Verify

In any terminal window, run:

```bash
qwen
```

Send a test message:

```text
Hello, please reply only: Connection Successful
```

A response confirms the configuration is working.

### Model Switching & One-off Commands

- **Switch Model**: Type `/model` inside the interactive session.
- **Single CLI Command**:
  ```bash
  qwen "Please reply with ok only"
  ```

## FAQ

### 1. `qwen` command not found
Restart your terminal after installation. Verify npm global bin directory is in your system `PATH`.

### 2. Prompts for login or auth type on startup
Verify `security.auth.selectedType` is set to `"openai"` in `settings.json`. PackyAPI uses OpenAI-compatible protocol without requiring an Alibaba Cloud account login.

### 3. `PACKY_API_KEY` not found
Check that `.env` is inside `.qwen` without a `.txt` suffix, and that the variable name matches `envKey` in `settings.json`.
