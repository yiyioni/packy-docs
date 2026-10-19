---
title: Codex配置
icon: hugeicons:chat-gpt
order: 3
---

## 安装 Codex

::: warning 先完成环境确认
Codex 要求 Node.js ≥ 16，但如果你同时要用 Claude Code 或 Kimi Code，需要按更高那条要求准备环境。还没确认 Node.js 与 npm，先看 [环境确认（Node.js 与 npm）](/docs/cli/1-env.html)。
:::

1. 在 Windows 或 MacOS 终端执行，全局安装最新版：

```bash
npm install -g @openai/codex@latest
```

2. 确认安装成功，能打印出版本号即可（下图为 `codex-cli 0.163.0`）：

```bash
codex --version
```

![](/assets/image/Cli/029.webp)

3. 首次运行一次 `codex`，让程序在你的用户目录下生成 `.codex` 配置目录（下一步要往这个目录里写配置）：

```bash
codex
```

![](/assets/image/Cli/004.webp)

出现登录方式选择界面，说明安装成功，按 `Ctrl+C` 退出这次运行即可。

## 写入配置

::: tabs

@tab Windows

1. 键盘按下“Win+R”键，输入以下内容后回车，打开你的codex配置目录

```bash
%userprofile%\.codex
```

![](/assets/image/Cli/006.webp)

2. 目录里大多是 Codex 自己生成的会话、日志与数据库文件，我们只需要其中两个

![](/assets/image/Cli/007.webp)

  - **config.toml**：Codex的**核心配置**文件，中转服务与MCP等都在此文件配置

  - **auth.json**：用来配置你在中转站获取的ApiKey秘钥

  - **`AGENTS.md`**：用来设置codex全局工作的提示词，不接入中转服务也可以先不建

> [!important]
> 上图里只有 `config.toml` 是 Codex 自己生成的，`auth.json` 与 `AGENTS.md` 都可能不存在，没有就手动新建文件再写入内容。

@tab MacOS

1. 在访达界面按下 “Command+Shift+G”，输入以下路径并回车，打开 Codex 配置目录

```bash
~/.codex
```

![](/assets/image/Cli/011.webp)

2. 目录中可能会存在以下文件，其它文件可忽略

![](/assets/image/Cli/012.webp)

  - **config.toml**：Codex 的核心配置文件，中转服务与 MCP 等都在此文件配置

  - **auth.json**：存放中转站获取的 ApiKey 秘钥

  - **`AGENTS.md`**：Codex 全局工作的提示词，不接入中转服务也可以先不建

> [!important]
> 初次安装若未自动生成，需要手动创建上述文件并写入内容

:::

打开配置目录后的 3–6 步，Windows 与 MacOS 完全一致；`config.toml` 里的 `[windows]` 段只对 Windows 生效，macOS 可以不写。

3. 将以下内容写入 `config.toml`

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
> `model` 要填 [Codex分组](/docs/token/2-group.html) 里实时展示的可用模型 ID，`gpt-5.3-codex` 及其以下版本已被官方删除。上图填的 `gpt-6-astra` 是当时 Codex 分组在售的模型，实际以该页面的实时列表为准。

> [!note]
> **Windows 沙盒装不上时可以换一档**
>
> `[windows] sandbox` 共有三种实现：`mxc`、`elevated`、`unelevated`。截图里用的是 `elevated`，它需要管理员授权完成一次初始化；如果你的电脑 UAC 被拒、或者公司电脑不允许新建本地用户、改防火墙与组策略，改成 `unelevated` 一样能跑，只是网络隔离比 `elevated` 弱一些。
>
> Windows 11 24H2（build 26100.9278）及以上可以改用 `mxc`：`elevated` 那行保持不动，在 `[features]` 里加一行 `prefer_mxc = true`，设备支持时会自动选用 MXC。
>
> 细节见官方文档 [Windows sandbox](https://developers.openai.com/codex/windows/windows-sandbox)。

4. 将以下内容写入 `auth.json`

```json
{
  "OPENAI_API_KEY": "xxx"
}
```

5. 回顾 [创建API令牌](/docs/register/4-token.html) 这一步教程，我们需要在PackyApi中创建 **Codex** 分组的令牌，然后点击右侧的复制按钮

![](/assets/image/Cli/008.webp)

把复制到的 key 填进上方 `xxx` 的位置后保存

![](/assets/image/Cli/009.webp)

6. 测试对话

在终端输入以下命令，出现图示内容，进行对话测试，如果有回复，则配置成功，开始你的Codex使用之旅~

```bash
codex
```

![](/assets/image/Cli/010.webp)

## 开启自动审核（可选）

默认情况下，Codex 执行命令、改文件前会停下来等你点确认。开启自动审核后，这类审批交给 Codex 的审核子代理 `codex-auto-review` 判断，由它直接给出放行或拒绝，不再每个操作都打断你。

> [!note]
> 自动审核只决定「谁来审批」，不改沙盒与权限范围，高风险操作照样会被拒。

1. 选一个主模型，下载对应的模型目录文件，放进 `.codex` 目录（和 `config.toml` 同级）

<ClientOnly>
  <div class="codex-cat">
    <div class="codex-cat__row">
      <label class="codex-cat__label" for="codex-cat-select">主模型</label>
      <select id="codex-cat-select" class="codex-cat__select" v-model="selected" :disabled="!models.length">
        <option value="" disabled>{{ loading ? "正在读取 Codex 分组模型…" : error ? "读取失败" : "请选择模型" }}</option>
        <option v-for="name in models" :key="name" :value="name">{{ name }}</option>
      </select>
      <button class="codex-cat__btn" :disabled="!selected || busy" @click="download">{{ busy ? "生成中…" : "下载目录文件" }}</button>
    </div>
    <p v-if="error" class="codex-cat__hint">
      没读到 Codex 分组模型（{{ error }}），可以先下 <a href="/assets/codex/codex-model-catalog.json">示例文件</a>，手动把里面第一条的 <code>slug</code> 改成你的模型 ID。
    </p>
    <p v-else-if="selected" class="codex-cat__hint">
      下载后确认 <code>config.toml</code> 里的 <code>model</code> 也是 <code>{{ selected }}</code>，两边必须一致。
    </p>
  </div>
</ClientOnly>

> [!important]
> `model_catalog_json` 指向的目录会**整体替换** Codex 内置的模型目录。所以文件里要自己写两条：一条是日常对话的主模型，一条是自动审核用的 `codex-auto-review`（它本来在 Codex 内置目录里，换成自定义目录后就没有了）。

2. 在 `config.toml` 最上方补三行，其余内容不动

```toml
approval_policy = "on-request"
approvals_reviewer = "auto_review"
model_catalog_json = "codex-model-catalog.json"
```

3. 彻底退出 `codex` 再重新打开。之后遇到需要审批的操作，会由审核子代理直接判断，不再每次都停下来等你点

想关掉时，把上面三行删掉、重启 `codex` 即可。

::: details 这份目录文件是怎么来的
- **模型列表**：页面实时从 `/api/pricing` 取 `codex` 分组里的模型给你选；分组里同时有 `codex-auto-review`，说明服务端确实提供审核模型
- **目录内容**：CC Switch 自动生成的原始文件约 100 KB，这里约 61 KB，只删了三类内容，审核策略与系统提示词原文没有改动：
  - 每个模型里 `base_instructions` 与 `model_messages.instructions_template` 是同一份系统提示词，原文件写了两遍，这里只保留后面那一个
  - 值为 `null` 的字段，以及没有内容的 `service_tiers`、`additional_speed_tiers` 两个空列表
  - `model_messages.token_budget`：这一段 `enabled = false`，本来就不生效
:::

<script setup>
import { onMounted, ref } from "vue";

// 和其它页面一致：本地 dev 走 vite 代理（config.ts 里的 /packyapi），线上直连接口
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
      error.value = "接口这次没返回 codex 分组的模型";
    } else if (models.value.includes("gpt-6-astra")) {
      selected.value = "gpt-6-astra";
    } else {
      selected.value = models.value[0];
    }
  } catch (err) {
    error.value = err?.message || "请求失败";
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
    if (!main) throw new Error("目录模板格式不对");
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
    error.value = err?.message || "生成失败";
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

> [!tip]
> **遇到其他配置问题**
>
> 连不上服务、沙盒初始化失败、令牌分组选错等，都可以优先查看 [Codex 相关问题](/docs/faq/Codex.html) 页面，常见报错的处理方法都在里面。
