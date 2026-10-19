---
title: Gemini FAQ
icon: vscode-icons:file-type-gemini
order: 3
---

[[toc]]

### About Gemini CLI

::: danger No Gemini CLI Tutorial
Google's official **Gemini CLI** (`@google/gemini-cli`) currently exhibits severe stability issues, including authentication failures, inability to paste images, and frequent crashes.

Therefore, we have **removed** the Gemini CLI tutorial and **do not recommend** using it.
:::

To use Gemini models, please use tools supporting **OpenAI-compatible endpoints**, such as:

- **Cline** (see tutorial below)
- **Roo Code**
- [OpenCode](/en/docs/advanced/OpenCode.html)
- [AionUI](/en/docs/advanced/AionUI.html)

Create an API token under the [Gemini](/en/docs/token/2-group.html#gemini-group) or high-stability [Gemini-slb](/en/docs/token/2-group.html#gemini-slb-group) group; for official enterprise channels, select [Gemini-officially](/en/docs/token/2-group.html#gemini-officially-group).

### How to use Gemini with Cline

#### Software Requirements

| Software | Version | Download |
| --- | --- | --- |
| **VSCode** | 1.80.0+ | [Download VSCode](https://code.visualstudio.com/) |

#### 1. Create Gemini Token

Refer to [Create API Token](/en/docs/register/4-token.html) to create an API token under **Gemini** or **Gemini-slb**:

![Create API Token Group Selection](/assets/image/FAQ/Gemini/002.webp)

#### 2. Install Cline Extension

- Open VSCode.
- Click the **Extensions** icon on the left sidebar (`Ctrl+Shift+X` / `Cmd+Shift+X`).
- Search for **Cline** and click **Install**.

::: info Installation Tips
- After installation, the Cline icon appears in the left sidebar.
- Initial setup requires configuring the API Key.
- Keeping Cline updated is recommended for optimal experience.
:::

#### 3. Open Cline

Open Cline via either method:
- **Sidebar:** Click the Cline icon in the left sidebar.
- **Command Palette:** Press `Ctrl+Shift+P` / `Cmd+Shift+P`, type `Cline: Open`, and press Enter.

#### 4. Initial Configuration

In the Cline interface:
1. Click the **API Configuration** button (or the **⚙️ Settings** gear icon).
2. Fill in the parameters as shown below:

```yaml
API Provider: Google Gemini
Google Gemini API Key: Your Packy API Key (e.g. sk-******)
Use custom base URL: Check and enter https://cf.api.fan/v1beta/models/gemini-4-argon:generateContent
Model: gemini-4-argon
Reasoning Effort: Medium
```

![Cline Configuration Interface](/assets/image/FAQ/Gemini/003.webp)

::: warning Security Notice
Keep your API Key secure and do not share screenshots containing active keys.
:::

::: details Existing Users
If you previously used Cline, click the **⚙️ Settings** gear icon in the top right to open settings.
:::

**Configuration Parameters**

| Setting | Recommended Value | Description |
| --- | --- | --- |
| **API Provider** | `Google Gemini` | Select native Google Gemini provider |
| **Google Gemini API Key** | `sk-******` | Your Packy API Key |
| **Use custom base URL** | Check and enter `https://cf.api.fan/v1beta/models/gemini-4-argon:generateContent` | Custom base URL endpoint |
| **Model** | `gemini-4-argon` | Target model ID (confirm directly if not in dropdown) |
| **Reasoning Effort** | `Medium` | Reasoning depth effort |

#### 5. Complete Setup

Click **Done** in the top right corner.
