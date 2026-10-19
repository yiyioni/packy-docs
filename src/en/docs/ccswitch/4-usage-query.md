---
title: Usage Query Setup
icon: mdi:chart-line
order: 4
---

CC-Switch can display your real-time **Balance** directly on the PackyCode provider card. Usage querying uses PackyAPI's **System Access Token + User ID**, rather than the standard API Key used for model calls.

1. Launch CC-Switch, select **Claude Code** (or **Codex**—the process is identical), click **`...`** on the PackyCode card, and choose **Configure Usage Query**:

![](/assets/image/CC-Switch/guide/v4/usage-query-menu.webp)

2. Toggle on **Enable Usage Query** in the top right, and set **Preset Template** to `NewAPI`:

![](/assets/image/CC-Switch/guide/v4/usage-query-template.webp)

3. Fill in your credentials:

   - **API Endpoint**: `https://www.packyapi.ai`
   - **Access Token**: Generate a System Access Token in PackyAPI under **Personal Settings → Security Settings**, and paste it here.
   - **User ID**: Found at the top of your Personal Settings page.

   Keep **Timeout** at `10`s and **Auto Query Interval** at `5` minutes (`0` disables automatic polling). The **Extractor Code** is preconfigured by the `NewAPI` template and does not need modification.

![](/assets/image/CC-Switch/guide/v4/usage-query-filled.webp)

::: warning This Endpoint Differs From Provider Endpoints
In [Claude Code Setup](/en/docs/ccswitch/2-claude.html) and [Codex Setup](/en/docs/ccswitch/3-codex.html), providers use API endpoints such as `https://cf.api.fan` (or `/v1`). Usage queries require the console web address `https://www.packyapi.ai`. Do not mix them up.
:::

4. Click **Save Configuration** in the bottom right. Returning to the provider list will now show your live **Balance** on the PackyCode card:

![](/assets/image/CC-Switch/guide/v4/usage-query-balance.webp)
