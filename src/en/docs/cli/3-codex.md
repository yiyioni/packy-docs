---
title: Codex Setup
icon: hugeicons:chat-gpt
order: 3
---

## Install Codex

::: warning Complete Environment Check First
Codex requires Node.js ≥ 16, but if you also plan to use Claude Code or Kimi Code, prepare your environment according to their higher version requirements. See [Environment Check (Node.js & npm)](/en/docs/cli/1-env.html).
:::

1. Run the following command in Windows or macOS terminal to install the latest version globally:

```bash
npm install -g @openai/codex@latest
```

2. Confirm installation by checking the version number:

```bash
codex --version
```

![](/assets/image/Cli/029.webp)

3. Run `codex` once to allow it to initialize and generate the `.codex` configuration directory under your home folder:

```bash
codex
```

![](/assets/image/Cli/004.webp)

When you see the login method selection screen, the installation is complete. Press `Ctrl+C` to exit.

## Configuration

::: tabs

@tab Windows

1. Press `Win + R` on your keyboard, paste the path below, and press Enter to open your Codex configuration directory:

```bash
%userprofile%\.codex
```

![](/assets/image/Cli/006.webp)

2. Your directory contains several files. Only three matter, and only two need manual editing:

![](/assets/image/Cli/007.webp)

  - **config.toml**: Codex's **core configuration** file for API endpoints, models, sandboxes, and MCP.
  - **auth.json**: Stores the API Key obtained from PackyAPI.
  - **AGENTS.md**: Sets global system prompts for Codex (optional).

> [!important]
> Only `config.toml` is created automatically. If `auth.json` or `AGENTS.md` does not exist, create them manually.

3. Write the following configuration into `config.toml`:

```toml
disable_response_storage = true
model = "gpt-6-astra"
model_provider = "packycode"
model_reasoning_effort = "xhigh"
model_verbosity = "high"

[features]
web_search_request = true

[model_providers.packycode]
base_url = "https://cf.api.fan/v1"
name = "packycode"
requires_openai_auth = true
wire_api = "responses"

[tui]
screen_reader_detection_done = true

[windows]
sandbox = "elevated"
```

![](/assets/image/Cli/038.webp)

> [!important]
> Set `model` according to live model IDs in the [Codex Group](/en/docs/token/2-group.html#codex-group). The example above uses `gpt-6-astra`.

> [!note]
> **Windows Sandbox Tiers**
>
> `[windows] sandbox` provides three modes: `mxc`, `elevated`, and `unelevated`. If UAC or group policies prevent administrator setup, you can switch to `unelevated`.
> On Windows 11 24H2 (build 26100.9278) or newer, you can keep `elevated` and add `prefer_mxc = true` under `[features]`.

4. Write the following content into `auth.json`:

```json
{
  "OPENAI_API_KEY": "xxx"
}
```

5. As described in [Create API Token](/en/docs/register/4-token.html), create a token in the **Codex** group on PackyAPI, copy the key, and paste it into `auth.json` replacing `"xxx"`.

![](/assets/image/Cli/008.webp)

![](/assets/image/Cli/009.webp)

6. Test conversation:

```bash
codex
```

![](/assets/image/Cli/010.webp)

@tab MacOS

1. In Finder, press `Command + Shift + G`, enter the path below, and press Enter:

```bash
~/.codex
```

![](/assets/image/Cli/011.webp)

2. Configuration files:
  - **config.toml**: Core configuration for endpoints and models.
  - **auth.json**: Stores your API Key.
  - **AGENTS.md**: Global prompt definition.

![](/assets/image/Cli/012.webp)

3. Write the following into `config.toml`:

```toml
disable_response_storage = true
model = "gpt-6-astra"
model_provider = "packycode"
model_reasoning_effort = "xhigh"
model_verbosity = "high"

[features]
web_search_request = true

[model_providers.packycode]
base_url = "https://cf.api.fan/v1"
name = "packycode"
requires_openai_auth = true
wire_api = "responses"

[tui]
screen_reader_detection_done = true
```

4. Write your API Key into `auth.json`:

```json
{
  "OPENAI_API_KEY": "xxx"
}
```

5. Copy your **Codex** group token from PackyAPI and save it into `auth.json`.

![](/assets/image/Cli/009.webp)

6. Run in terminal to verify:

```bash
codex
```

![](/assets/image/Cli/010-mac.webp)

@tab Linux

1. Create the configuration directory:

```bash
mkdir -p ~/.codex
```

2. Create `~/.codex/config.toml`:

```toml
disable_response_storage = true
model = "gpt-6-astra"
model_provider = "packycode"
model_reasoning_effort = "xhigh"
model_verbosity = "high"

[features]
web_search_request = true

[model_providers.packycode]
base_url = "https://cf.api.fan/v1"
name = "packycode"
requires_openai_auth = true
wire_api = "responses"
```

3. Create `~/.codex/auth.json`:

```json
{
  "OPENAI_API_KEY": "xxx"
}
```

Replace `"xxx"` with your PackyAPI **Codex** group token.

4. Run `codex` to verify.

:::

## Enable Auto-Review (Optional)

By default, Codex pauses and prompts for manual confirmation before executing commands or modifying files. Enabling auto-review delegates approvals to Codex's built-in `codex-auto-review` subagent, preventing repetitive manual interruptions.

> [!note]
> Auto-review only decides "who approves", without altering sandbox boundaries or permissions. High-risk operations will still be rejected safely.

1. Select your primary model and download the corresponding model catalog file, then place it in your `.codex` directory (alongside `config.toml`):

<ClientOnly>
  <div class="codex-cat">
    <div class="codex-cat__row">
      <label class="codex-cat__label" for="codex-cat-select">Primary Model</label>
      <select id="codex-cat-select" class="codex-cat__select" v-model="selected" :disabled="!models.length">
        <option value="" disabled>{{ loading ? "Loading Codex models…" : error ? "Failed to load" : "Select a model" }}</option>
        <option v-for="name in models" :key="name" :value="name">{{ name }}</option>
      </select>
      <button class="codex-cat__btn" :disabled="!selected || busy" @click="download">{{ busy ? "Generating…" : "Download Catalog" }}</button>
    </div>
    <p v-if="error" class="codex-cat__hint">
      Failed to load Codex models ({{ error }}). You can download the <a href="/assets/codex/codex-model-catalog.json">sample file</a> and manually replace the first <code>slug</code> with your model ID.
    </p>
    <p v-else-if="selected" class="codex-cat__hint">
      After downloading, ensure <code>model</code> in <code>config.toml</code> matches <code>{{ selected }}</code>.
    </p>
  </div>
</ClientOnly>

> [!important]
> `model_catalog_json` replaces Codex's built-in model catalog entirely. The file contains both your primary conversation model and `codex-auto-review` for automated approvals.

2. Add these three lines to the top of `config.toml`:

```toml
approval_policy = "on-request"
approvals_reviewer = "auto_review"
model_catalog_json = "codex-model-catalog.json"
```

3. Restart `codex`. Required approvals will now be handled automatically by the review subagent.

To disable auto-review, remove the three lines above and restart `codex`.

<script setup>
import { onMounted, ref } from "vue";

const PRICING_API_DEV = "/packyapi/api/pricing";
const PRICING_API_PROD = "https://www.packyapi.ai/api/pricing";
const PRICING_API = import.meta.env.DEV ? PRICING_API_DEV : PRICING_API_PROD;
const CATALOG_TEMPLATE = "/assets/codex/codex-model-catalog.json";
const REVIEW_MODEL = "codex-auto-review";

const models = ref([]);
const selected = ref("");
const loading = ref(true);
const busy = ref(false);
const error = ref("");

const loadModels = async () => {
  try {
    const res = await fetch(PRICING_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = (data?.data || [])
      .filter((item) => (item.enable_groups || []).includes("codex"))
      .map((item) => item.model_name)
      .filter((name) => name && name !== REVIEW_MODEL);
    models.value = [...new Set(list)];
    if (!models.value.length) {
      error.value = "No models found for codex group";
    } else if (models.value.includes("gpt-5.6-sol")) {
      selected.value = "gpt-5.6-sol";
    } else if (models.value.includes("gpt-6-astra")) {
      selected.value = "gpt-6-astra";
    } else {
      selected.value = models.value[0];
    }
  } catch (err) {
    error.value = err?.message || "Request failed";
  } finally {
    loading.value = false;
  }
};

const download = async () => {
  if (!selected.value) return;
  busy.value = true;
  try {
    const res = await fetch(CATALOG_TEMPLATE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const catalog = await res.json();
    const main = catalog?.models?.[0];
    if (!main) throw new Error("Catalog template format error");
    main.slug = selected.value;
    main.display_name = selected.value;
    const blob = new Blob([`${JSON.stringify(catalog, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "codex-model-catalog.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    error.value = err?.message || "Generation failed";
  } finally {
    busy.value = false;
  }
};

onMounted(loadModels);
</script>

<style>
.codex-cat {
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  border-radius: 12px;
  padding: 14px 16px;
  margin: 12px 0;
  max-width: 720px;
  background: var(--vp-c-bg-soft, #f8fafc);
}

.codex-cat__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.codex-cat__label {
  font-weight: 600;
}

.codex-cat__select {
  flex: 1 1 220px;
  min-width: 180px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider, #d1d5db);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: inherit;
  font-size: 14px;
}

.codex-cat__btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-accent-bg, #3b82f6);
  color: var(--vp-c-white, #fff);
  font-size: 14px;
  cursor: pointer;
}

.codex-cat__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.codex-cat__hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-mute, #6b7280);
}
</style>

::: tip Other Configuration Questions
For issues with sandboxes, token groups, or connectivity, please refer to the [Codex FAQ](/en/docs/faq/Codex.html) page.
:::
