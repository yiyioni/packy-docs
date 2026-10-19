---
title: CC-Switch Guide
index: false
icon: fluent:table-switch-16-filled
category:
  - CC-Switch
date: 2025-11-23
---

## Common Steps

### Introduction to CC-Switch

<div align="center">

<h3>All-in-One Management Platform for Claude Code & Codex</h3>

[![Version](https://img.shields.io/github/v/release/farion1231/cc-switch?color=blue&label=version)](https://github.com/farion1231/cc-switch/releases)
[![Trending](https://img.shields.io/badge/🔥_TypeScript_Trending-Daily%20%7C%20Weekly%20%7C%20Monthly-ff6b6b.svg)](https://github.com/trending/typescript)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/farion1231/cc-switch/releases)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange.svg)](https://tauri.app/)
[![Downloads](https://img.shields.io/endpoint?url=https://api.pinstudios.net/api/badges/downloads/farion1231/cc-switch/total)](https://github.com/farion1231/cc-switch/releases/latest)

<a href="https://trendshift.io/repositories/15372" target="_blank"><img src="https://trendshift.io/api/badge/repositories/15372" alt="farion1231%2Fcc-switch | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

[::mdi:clipboard-text-history::Changelog](https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md) | [::fa-solid:cloud-download-alt::Download Releases](https://github.com/farion1231/cc-switch/releases/latest)

**From Provider Switcher to AI CLI Unified Management Platform**

**Unified management of provider configurations, MCP servers, Skills extensions, and system prompts for Claude Code, Codex, and other CLI tools.**
</div>

With CC-Switch, you can:
- ✅ **One-Click API Switch** - Swiftly toggle between multiple API providers.
- ✅ **Visual Configuration Management** - Manage all configurations effortlessly through a graphical interface.
- ✅ **Built-in PackyAPI Presets** - Pre-configured PackyAPI connection templates out of the box.
- ✅ **MCP / Skills / Prompt Management** - Maintain in one place, sync across multiple CLIs.
- ✅ **Session & Quota Monitoring** - Inspect chat histories, monitor balances and consumption in real time.

::: tip Built-in Preset
CC-Switch has built-in PackyAPI configuration presets. No manual configuration file editing is required!
:::

### Download & Installation

::: tabs

@tab Windows
1. Visit the [GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest) page.

2. Scroll down to `Assets` and select the installer for your system. We recommend downloading the standard `.msi` package (`CC-Switch-vX.X.X-Windows.msi`) or the portable zip (`CC-Switch-vX.X.X-Windows-Portable.zip`).

![](/assets/image/CC-Switch/guide/v4/release-assets.webp)

3. After installation, launch CC-Switch to see the main dashboard:

![](/assets/image/CC-Switch/guide/v4/main-interface.webp)

@tab MacOS
- Homebrew is the recommended installation method on macOS:

```bash
# Install CC-Switch
brew install --cask cc-switch
```

- Alternatively, download `.dmg` from [GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest).

@tab Linux
- Download `.AppImage` or `.deb` packages from [GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest).

:::

## ::material-icon-theme:claude:: Claude Code Setup

1. Launch CC-Switch and select **Claude Code** on the left application sidebar. The top bar shows three connection modes: **Direct / Routing / Aggregation**. This tutorial uses **Direct** connection throughout.

2. Click **Add Provider** in the top right:

![](/assets/image/CC-Switch/guide/v4/claude-add-supplier.webp)

3. Search for `packycode` in the search box, and select **PackyCode** under the "Third-party Platforms" category:

![](/assets/image/CC-Switch/guide/v4/claude-presets.webp)

4. As detailed in [Create API Token](/en/docs/register/4-token.html), create a token in the **CC** group on PackyAPI and copy your API Key:

![](/assets/image/CC-Switch/guide/v4/claude-token-copy.webp)

5. Paste your copied key into the **API Key** field; change the **API Endpoint** to `https://cf.api.fan`, then click **Add** in the bottom right:

![](/assets/image/CC-Switch/guide/v4/claude-supplier-form.webp)

::: warning API Endpoint Must Be Changed
The default preset URL in PackyCode is `https://www.packyapi.ai`, which is the web console URL and cannot be used as an API endpoint.

Choose one of the two real API endpoints:
- `https://cf.api.fan` (Global Cloudflare network, recommended default)
- `https://slb-v1.api.fan` (Optimized routing, for latency-sensitive users)
:::

6. Return to the provider list and click **Switch** on the PackyCode card (the ▷ arrow icon). The card status changing to **In Use** indicates successful activation:

![](/assets/image/CC-Switch/guide/v4/claude-switch.webp)

7. Run `claude` in your terminal to test:

```bash
claude
```

![](/assets/image/Cli/036.webp)

Send a test message to confirm connectivity:

![](/assets/image/Cli/037.webp)

::: warning CC Group Must Use Direct Connection
If using the [CC Group](/en/docs/token/2-group.html#cc-group), maintain the mode on **Direct**. Do not enable routing.
:::

## ::hugeicons:chat-gpt:: Codex Setup

1. Launch CC-Switch and select **Codex** on the left application sidebar. This tutorial uses **Direct** connection.

2. Click **Add Provider** in the top right:

![](/assets/image/CC-Switch/guide/v4/codex-add-supplier.webp)

3. Search for `packycode` and select **PackyCode**:

![](/assets/image/CC-Switch/guide/v4/codex-presets.webp)

4. Copy your API Key from the **Codex** group token in PackyAPI:

![](/assets/image/Cli/008.webp)

5. Configure provider parameters:
   - Paste the token into **API Key**.
   - Change **API Endpoint** to `https://cf.api.fan/v1`.
   - In **Model List**, click **+ Add Manually** to add two rows:
     - Row 1: Primary model ID (e.g. `gpt-5.6-sol` or `gpt-6-astra`).
     - Row 2: Fill both columns with `codex-auto-review`.
   - Set **Auto Review Model** to `Codex Default (codex-auto-review)`.
   - Click **Add**.

![](/assets/image/CC-Switch/guide/v4/codex-supplier-form.webp)

::: warning API Endpoint Must Include /v1
Codex requires `/v1`. Use `https://cf.api.fan/v1` or `https://slb-v1.api.fan/v1`.
:::

6. Return to the provider list and click **Switch** on the PackyCode card:

![](/assets/image/CC-Switch/guide/v4/codex-switch.webp)

7. Restart any active Codex sessions:

![](/assets/image/CC-Switch/guide/v4/codex-restart.webp)

8. In your terminal, run `codex` to verify:

```bash
codex
```

![](/assets/image/Cli/010.webp)

## ::mdi:chart-line:: Usage Query Setup

1. Select **Claude Code** or **Codex**, click **`...`** on the PackyCode card, and choose **Configure Usage Query**:

![](/assets/image/CC-Switch/guide/v4/usage-query-menu.webp)

2. Enable usage query and select template `NewAPI`:

![](/assets/image/CC-Switch/guide/v4/usage-query-template.webp)

3. Fill in:
   - **API Endpoint**: `https://www.packyapi.ai`
   - **Access Token**: Your System Access Token from **Personal Settings → Security Settings**
   - **User ID**: Found at the top of your Personal Settings page

![](/assets/image/CC-Switch/guide/v4/usage-query-filled.webp)

4. Save configuration. Your real-time **Balance** will appear on the PackyCode card:

![](/assets/image/CC-Switch/guide/v4/usage-query-balance.webp)

## More Integrations

- [ChatGPT Desktop Integration](/en/docs/ccswitch/6-codex-app.html)
- [DeepSeek in Codex](/en/docs/advanced/DeepSeekCodex.html)
