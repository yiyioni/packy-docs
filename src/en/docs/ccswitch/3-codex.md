---
title: Codex Setup
icon: hugeicons:chat-gpt
order: 3
---

1. Launch CC-Switch and select **Codex** on the left application sidebar. The top bar shows **Direct / Routing / Aggregation**; this tutorial uses **Direct** connection throughout.

2. Click **Add Provider** in the top right:

![](/assets/image/CC-Switch/guide/v4/codex-add-supplier.webp)

3. Search for `packycode` and select **PackyCode** under "Third-party Platforms":

![](/assets/image/CC-Switch/guide/v4/codex-presets.webp)

4. As detailed in [Create API Token](/en/docs/register/4-token.html), create a token in the **Codex** group on PackyAPI and copy your API Key:

![](/assets/image/Cli/008.webp)

5. Configure provider parameters:
   - Paste the token into **API Key**.
   - Change **API Endpoint** to `https://cf.api.fan/v1`.
   - In **Model List**, click **+ Add Manually** to add two rows (see note below).
   - Set **Auto Review Model** to `Codex Default (codex-auto-review)`.
   - Click **Add** in the bottom right.

![](/assets/image/CC-Switch/guide/v4/codex-supplier-form.webp)

::: warning API Endpoint Must Include /v1
Codex uses OpenAI-compatible endpoints requiring `/v1`, unlike [Claude Code Setup](/en/docs/ccswitch/2-claude.html) which uses `https://cf.api.fan`. The default preset URL is `https://www.packyapi.ai/v1`, which is invalid for API calls. Choose one of:

- `https://cf.api.fan/v1` (Global Cloudflare network, recommended default)
- `https://slb-v1.api.fan/v1` (Optimized routing, for latency-sensitive users)
:::

::: warning Add Models Manually
Clicking **Fetch Model List** will not automatically fetch PackyCode's dynamic models. Click **+ Add Manually** and fill in two rows:

- **Row 1**: Primary model ID (e.g. `gpt-5.6-sol` or `gpt-6-astra`). Fill both Display Name and Request Model with the exact model ID from [Codex Group](/en/docs/token/2-group.html#codex-group).
- **Row 2**: Fill both columns with `codex-auto-review` to match the **Auto Review Model** selection above.
:::

6. Return to the provider list and click **Switch** on the PackyCode card (the ▷ arrow icon). When the status shows **In Use**, the provider is activated:

![](/assets/image/CC-Switch/guide/v4/codex-switch.webp)

7. A yellow warning banner will appear in CC-Switch stating that active Codex instances may still use prior credentials. Completely restart Codex: exit running CLI sessions and restart desktop applications:

![](/assets/image/CC-Switch/guide/v4/codex-restart.webp)

8. In your terminal, run `codex` and send a test message. A response confirms setup is complete:

```bash
codex
```

![](/assets/image/Cli/010.webp)

To show your live balance directly on the PackyCode provider card, see [Usage Query Setup](/en/docs/ccswitch/4-usage-query.html).

## More Codex Integrations

- [ChatGPT Desktop Integration](/en/docs/ccswitch/6-codex-app.html)
- [DeepSeek in Codex](/en/docs/advanced/DeepSeekCodex.html)
