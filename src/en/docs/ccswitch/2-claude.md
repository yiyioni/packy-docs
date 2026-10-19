---
title: Claude Code Setup
icon: material-icon-theme:claude
order: 2
---

1. Launch CC-Switch and select **Claude Code** on the left application sidebar. The top bar shows three connection modes: **Direct / Routing / Aggregation**. This tutorial uses **Direct** connection throughout (clicking tabs only previews details without altering settings).

2. Click **Add Provider** in the top right:

![](/assets/image/CC-Switch/guide/v4/claude-add-supplier.webp)

3. Search for `packycode` in the search box, and select **PackyCode** under the "Third-party Platforms" category:

![](/assets/image/CC-Switch/guide/v4/claude-presets.webp)

4. As detailed in [Create API Token](/en/docs/register/4-token.html), create a token in the **CC** group on PackyAPI and copy your API Key:

![](/assets/image/CC-Switch/guide/v4/claude-token-copy.webp)

5. Paste your copied key into the **API Key** field; change the **API Endpoint** to `https://cf.api.fan`, then click **Add** in the bottom right:

![](/assets/image/CC-Switch/guide/v4/claude-supplier-form.webp)

::: warning API Endpoint Must Be Changed
The default preset URL in PackyCode is `https://www.packyapi.ai`, which is the web console URL and cannot be used as an API endpoint. CC-Switch will fail if left as default.

Choose one of the two real API endpoints based on your network:

- `https://cf.api.fan` (Global Cloudflare network, recommended default)
- `https://slb-v1.api.fan` (Optimized routing, recommended for latency-sensitive users)

See [API Endpoints Reference](/en/docs/register/6-cli.html#api-endpoints) for details.
:::

6. After adding, return to the provider list and click the **Switch** button on the PackyCode card (the ▷ arrow icon). The card status changing to **In Use** indicates successful activation:

![](/assets/image/CC-Switch/guide/v4/claude-switch.webp)

7. Run `claude` in your terminal. If the security prompt appears, select `Yes, I trust this folder`:

```bash
claude
```

![](/assets/image/Cli/036.webp)

Send a test message. When you receive a reply, the configuration is working properly:

![](/assets/image/Cli/037.webp)

::: warning CC Group Must Use Direct Connection, Do Not Enable Routing
If you are using the [CC Group](/en/docs/token/2-group.html#cc-group), note that this group **does not support third-party client integrations**.

CC-Switch's "Routing" mode routes requests locally through CC-Switch first before forwarding upstream, which acts as a third-party proxy. When using the CC group:

- Keep the top mode set to **Direct**; do not click **Start Routing**.
- Verify configuration directly inside the `claude` CLI via conversation.
:::
