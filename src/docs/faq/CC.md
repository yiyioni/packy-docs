---
title: Claude Code相关问题
icon: material-icon-theme:claude
order: 1
---

### ::ic:round-whatshot:: 明明选的是 Opus 5，账单里为什么会出现别的模型

**先说结论：这是正常情况，不是你的问题，也不是系统出错了。**

Claude Code 自己会在背地里做几件小事，比如：

- 给你的对话起个名字（就是历史记录里显示的那一行标题）
- 把很长的聊天记录压缩一下，省得占空间

做这些小事的时候，Claude Code 会自己换一个更便宜、更快的模型去处理，不会用你选的 Opus 5。所以账单里多出一些别的模型，是它自己在干活，不是你选错了，也不是被多扣钱。

::: tip 到底要不要担心
- 这笔钱如果很小（一般几分钱到几毛钱），不用管，正常
- 如果这笔钱很大（比如好几块钱以上），那就不正常了，去群里找客服问一下
:::

**想亲眼确认一下：**

1. 打开 <https://www.packyapi.ai/login>，登录你的账号
2. 登录后找到"消费日志"（一般在控制台左侧菜单里）
3. 点进去，按时间找到你怀疑的那一笔，上面会写清楚用的是哪个模型、花了多少钱

::: details 想知道背后更详细的技术原因（普通用户可以跳过）
Claude Code 支持派生出子任务 Agent（术语叫 Subagent，比如内置的 `Explore`、`general-purpose`、`statusline-setup`，或者你自己配置的自定义 Agent）来单独处理某一小块任务。每个 Subagent 可以在自己的配置文件里单独指定使用哪个模型，这和你主对话选择的 Opus 5 是两回事——如果某个 Subagent 被设置成用 Sonnet 或 Haiku，账单里自然会出现对应的调用记录。`/fast` 切换的只是 Opus 的更快输出模式，不涉及降级到其他模型。
:::

### ::ic:round-whatshot:: Claude Desktop 新建对话时为什么会自动调用模型

**同样是正常现象，跟上面是一回事。**

Claude Desktop 在你新建一个对话、发出第一条消息之后，会自动调用一个便宜的小模型，帮你给这个对话起个标题（就是左侧对话列表里显示的那行字）。这个标题生成和你实际对话用的模型没关系，是软件自带的功能，关不掉。

- 这笔钱通常很小很小，几乎感觉不到
- 如果你在消费记录里看到一笔莫名其妙的小额调用，大概率就是这个标题生成产生的，不用怀疑账号被盗

### 如何在Vscode CC插件中使用PackyApi

::: tabs

@tab Windows
1. 确保你已进行 [环境检查](/docs/cli/1-env.html) 并保证你的claude code cli是没问题的，如果有问题，请按照教程进行配置

2. 键盘按下“Win+R”键，输入以下内容后回车，打开Claude Code配置目录

```bash
%userprofile%\.claude
```

![](/assets/image/Cli/013.webp)

3. 目录内容如图所示，如果目录中没有 `config.json`，你需要手动创建后打开

- **config.json**：配置Vscode的Claude Code插件的一些行为

![](/assets/image/Cli/014.webp)

4. 在`config.json`中写入以下内容后保存

```json
{
  "primaryApiKey": "PackyApi"
}
```

5. 重启你的Vscode，开始愉快使用吧！

@tab MacOS

1. 确保你已进行 [环境检查](/docs/cli/1-env.html) 并保证你的claude code cli是没问题的，如果有问题，请按照教程进行配置

2. 在访达界面按下 “Command+Shift+G”，输入以下路径后回车，打开配置目录

```bash
~/.claude
```

![](/assets/image/Cli/017.webp)

3. 目录内容如图所示，如果目录中没有 `config.json`，你需要手动创建后打开

- **config.json**：配置Vscode的Claude Code插件的一些行为

![](/assets/image/Cli/018.webp)

4. 在`config.json`中写入以下内容后保存

```json
{
  "primaryApiKey": "PackyApi"
}
```

5. 重启你的Vscode，开始愉快使用吧！

:::

### Claude Code 中常用命令

| 命令 | 功能说明 |
| --- | --- |
| /claude | 在当前目录启动交互式 REPL，对话式使用 Claude Code。 |
| /claude "解释这个项目" | 启动 REPL 并带上初始问题，一进来就让 Claude 分析项目。 |
| /claude -p "解释这个函数" | 使用 print 模式一次性问答，输出结果后直接退出，便于脚本/CI 调用。 |
| /cat logs.txt \| claude -p "帮我总结错误" | 将文件或命令输出通过管道喂给 Claude，再配合 `-p` 做总结、分析。 |
| /claude -c | 继续当前目录最近的一次会话，在原有上下文里接着聊。 |
| /claude -c -p "检查类型错误" | 在最近会话上下文中执行一次性请求，常用于自动化检查。 |
| /claude -r "abc123" "把这个 PR 完成" | 通过会话 ID 恢复指定会话，并继续执行新的任务。 |
| /claude update | 将 Claude Code CLI 更新到最新版本。 |
| /claude mcp | 管理和配置 MCP 服务器，让 Claude 能访问外部数据源和工具。 |
| /claude --add-dir ../apps ../lib | 为 Claude 额外添加可访问的代码目录，支持跨多个路径读代码。 |
| /claude --agents '{"reviewer":{...}}' | 通过 JSON 临时定义子 Agent，例如 code-reviewer、debugger 等。 |
| /claude -p "生成接口文档" --output-format json | 使用 JSON 格式输出回答，方便后续脚本解析处理。 |
| /claude --model sonnet | 指定会话使用的模型（如 sonnet / opus 或具体模型名）。 |
| /claude --verbose | 打开详细日志，显示工具调用和内部步骤，便于调试。 |
| /claude --resume abc123 "继续修这个 Bug" | 通过会话 ID 恢复会话，在任意目录继续之前的工作。 |
| /claude --continue | 载入当前目录最近的一次会话，相当于“继续上次对话”。 |
| /claude --append-system-prompt "始终使用 TypeScript" | 在默认系统提示后追加自定义规则，不影响默认行为。 |
| /claude --dangerously-skip-permissions | 跳过权限确认，让 Claude 自动执行读写文件/运行命令（高风险，仅在完全信任环境使用）。 |

### claude code 无法连接到 Anthropic 服务

::: info 注意事项
**如果你是首次配置根据链接跳转到这一步，直接按照下面的教程运行命令即可**
:::

使用npm安装完claude之后。
在命令行输入claude报了如下错误：
```text
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR BAD REQUEST
lease check your internet connection and network settings.
Note: Claude Code might not be available in your country, Check supported countries atnttps://anthropic.com/supported-countriesS E:ltoollclaude code>
```

![](/assets/image/FAQ/CC/001.webp)

或是在你初次配置时出现以下问题：

![](/assets/image/FAQ/CC/003.webp)

::: tabs

@tab Windows

1. 按下键盘 `Win + R` 键，输入 `cmd` 后回车，打开命令行程序

2. 在命令行中运行以下命令后回车

```bash
powershell -Command "$f='%USERPROFILE%\.claude.json';$j=Get-Content $f|ConvertFrom-Json;$j|Add-Member -NotePropertyName 'hasCompletedOnboarding' -NotePropertyValue $true -Force;$j|ConvertTo-Json|Set-Content $f"
```

3. 重启你的Claude Cli

@tab MacOS

1. 在APP列表中找到终端程序，点击运行
![](/assets/image/FAQ/CC/002.webp)

2. 在终端中运行以下命令后回车

```bash
jq '. + {"hasCompletedOnboarding": true}' ~/.claude.json > /tmp/tmp.json && mv /tmp/tmp.json ~/.claude.json
```

> [!tip]
> 注意，如果提示未找到jq，可以输入 `brew install jq` 进行安装

3. 重启你的Claude Cli
:::

### ::ic:round-whatshot:: API Error: 400 messages.1: system content must contain at least one block

在使用或恢复历史会话（例如运行 `claude -c` 或继续之前对话）时，可能会遇到如下 400 报错：

```text
API Error: 400 messages.1: system content must contain at least one block (request id: 20261007144143462-08e6b1a3)
```

#### 报错原因

**客户端升级后与旧会话上下文格式不兼容**。

当你升级了新版本 Claude Code 客户端后，旧版本客户端所生成的历史会话记录（包括系统提示词结构、消息上下文格式等）可能与新版规范不一致，导致请求重新组装时发送了空的 `system` 块，从而被 Anthropic 接口拒绝并返回 400 错误。

#### 解决方案

##### 方案一：新开对话（推荐）

最快速简单的解决办法是不继承旧会话，直接新开对话：

1. 启动全新的会话（**不要加** `-c` 或 `--continue` 参数）：
   ```bash
   claude
   ```
2. 让 Claude 在新会话中读取之前旧会话的记录或项目代码，例如直接输入提示词：
   > “请读取我之前的会话历史记录和相关文件，了解我们刚才做的工作，然后在此新对话中继续完成任务。”
3. 在新会话中继续使用，新生成的会话记录会严格匹配当前版本的规范，不会再出现该报错。

##### 方案二：回退到升级前的客户端版本

如果必须保留并继续旧会话的原有上下文，可以回退到升级前的 Claude Code 版本：

1. **查找之前正常运行时的版本号**：
   Claude Code 的会话记录里每条记录都包含 `version` 字段。
   - **方法 A（在新会话中让 AI 查）**：输入 `claude` 新开一个对话，发送提示词：
     > “请帮我检查 `~/.claude` 目录下的历史会话记录（如 `~/.claude/history.jsonl`），查看之前正常运行时的记录里自带的 `version` 字段，告诉我当时使用的具体版本号是多少。”
   - **方法 B（直接在终端提取）**：
     - **macOS / Linux**：
       ```bash
       grep -o '"version":"[^"]*"' ~/.claude/history.jsonl | tail -n 10
       ```
     - **Windows PowerShell**：
       ```powershell
       Select-String -Path "$env:USERPROFILE\.claude\history.jsonl" -Pattern '"version":"([^"]+)"' | Select-Object -Last 10
       ```
2. **通过 npm 重新安装对应版本**：
   获取到之前的版本号后，在终端执行降级安装：
   ```bash
   npm install -g @anthropic-ai/claude-code@<查到的版本号>
   ```
3. 降级完成后，重新运行 `claude -c` 即可继续旧会话。

### Claude Code 如何切换回 200K 上下文并禁用非必要流量

如果你希望将 Claude Code 从 1M 上下文切换回 200K 上下文，并关闭一些
非必要请求、遥测与终端标题变更，可以在 `settings.json` 的 `env` 中加入以下配置。

::: tabs

@tab Windows

1. 按下键盘 `Win + R`，输入以下内容后回车

```bash
%userprofile%\.claude
```

2. 打开或创建 `settings.json`

3. 确认 `env` 中包含以下内容（可与现有 `ANTHROPIC_*` 等配置合并，不要覆盖已有令牌）

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_1M_CONTEXT": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_DISABLE_TERMINAL_TITLE": "1",
    "CLAUDE_CODE_NEW_INIT": "1",
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "DISABLE_AUTOUPDATER": "1",
    "DISABLE_TELEMETRY": "1",
    "DISABLE_BUG_COMMAND": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "ENABLE_TOOL_SEARCH": "false",
    "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS": "1",
    "CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS": "1"
  }
}
```

@tab MacOS

1. 在访达中按下 `Command + Shift + G`，输入以下路径后回车

```bash
~/.claude
```

2. 打开或创建 `settings.json`

3. 确认 `env` 中包含以下内容（可与现有 `ANTHROPIC_*` 等配置合并，不要覆盖已有令牌）

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_1M_CONTEXT": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_DISABLE_TERMINAL_TITLE": "1",
    "CLAUDE_CODE_NEW_INIT": "1",
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "DISABLE_AUTOUPDATER": "1",
    "DISABLE_TELEMETRY": "1",
    "DISABLE_BUG_COMMAND": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "ENABLE_TOOL_SEARCH": "false",
    "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS": "1",
    "CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS": "1"
  }
}
```

:::

::: tip 为什么要关闭 Git 状态收集（`CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`）

Claude Code 默认会在每次对话中自动获取当前仓库的 git 状态信息（比如 `git status`、`git diff` 等），把这些信息塞到系统提示词里。

**问题在于：** 这些 git 状态会频繁变化（新建文件、修改代码、切换分支……任何改动都会变），而系统提示词是构建缓存 key 的一部分。git 状态一变，缓存 key 就变了，导致本轮对话的缓存命中率大幅下降，实际 token 消耗和费用都会增加。

对于 PackyApi 按量计费的用户来说，关闭这个功能可以减少无效的缓存失效，让缓存更稳定、省钱。
:::

完整推荐配置与各字段说明，见 [Claude Code配置 · 配置项说明](/docs/cli/2-claude.html#配置项说明)。
