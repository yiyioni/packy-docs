---
title: DeepSeek in Codex
icon: simple-icons:deepseek
order: 7
---

This guide explains how to route the `deepseek-officially` token group to Codex CLI and the ChatGPT desktop application via CC-Switch.

::: warning Compatibility Notice
Codex was natively built for OpenAI models. Using DeepSeek models may occasionally display missing model metadata warnings. Actual performance depends on current model capabilities and PackyAPI routing.
:::

## Create and Enable Provider

1. Open CC-Switch and select **Codex** on the left application bar.

![](/assets/image/CC-Switch/guide/028.jpg)

2. Click **+ Add Provider** in the top right, search for `packyapi`, and select **PackyCode**.

![](/assets/image/CC-Switch/guide/029.jpg)

3. Create a token in the `deepseek-officially` group on PackyAPI and copy your API Key.

![](/assets/image/CC-Switch/guide/030.jpg)

4. Configure parameters:
   - **Website**: `https://www.packyapi.ai`
   - **API Key**: Your `deepseek-officially` token.
   - **API Endpoint**: `https://cf.api.fan/v1`
   - **Default Model**: `deepseek-v4-flash`

![](/assets/image/CC-Switch/guide/031.jpg)

5. Click **Add**, then enable the newly created PackyCode provider card (showing **In Use** indicates successful activation).

![](/assets/image/CC-Switch/guide/032.jpg)

6. Completely restart any running Codex CLI or ChatGPT instances.

## Verification

Run `codex` in your terminal and send a test prompt. If the bottom shows `deepseek-v4-flash` and replies properly, configuration is successful.

![](/assets/image/CC-Switch/guide/033.jpg)

In ChatGPT / Codex desktop app, send a test prompt as well:

![](/assets/image/CC-Switch/guide/034.jpg)
