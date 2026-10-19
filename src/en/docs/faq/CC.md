---
title: Claude Code FAQ
icon: material-icon-theme:claude
order: 1
---

### ::ic:round-whatshot:: Why do other models appear in my billing when I selected Opus?

**Short answer: This is normal behavior and not an error or extra charge.**

Claude Code automatically performs several background tasks during a session:
- Generating titles for historical sessions in the conversation list.
- Compacting long conversation contexts to save memory space.

During these tasks, Claude Code automatically routes requests to lighter, more economical models (such as Haiku or Sonnet) rather than your primary Opus model.

::: tip When to Be Concerned
- Small amounts (cents or minor fractions): completely normal background tasks.
- If large charges appear without your activity, check your token usage log and contact customer support.
:::

**How to verify:**
1. Sign in to <https://www.packyapi.ai/login>.
2. Go to **Consumption Logs** in the console.
3. Review exact timestamps, token counts, and billed models.

::: details Technical Explanation (Optional)
Claude Code supports spawning sub-agents (e.g. `Explore`, `general-purpose`, `statusline-setup`, or custom agents) to handle isolated subtasks. Each subagent can specify its own model independently. `/fast` toggles fast output mode for Opus without switching the model family.
:::

### ::ic:round-whatshot:: Automatic model calls when creating chats in Claude Desktop

Similar to Claude Code, Claude Desktop issues a lightweight background model call after your first message to automatically synthesize a concise title for the sidebar chat list.

### How to use PackyAPI with the VSCode Claude Code Extension

::: tabs

@tab Windows

1. Ensure the [Environment Check](/en/docs/cli/1-env.html) is complete.
2. Press `Win + R`, enter `%userprofile%\.claude`, and press Enter.

![](/assets/image/Cli/013.webp)

3. If `config.json` does not exist, create it manually:

- **config.json**: Configures behaviors of the VSCode Claude Code extension.

![](/assets/image/Cli/014.webp)

4. Write the following into `config.json`:

```json
{
  "primaryApiKey": "PackyApi"
}
```

5. Restart VSCode.

@tab MacOS

1. Ensure the [Environment Check](/en/docs/cli/1-env.html) is complete.
2. Press `Command + Shift + G` in Finder and enter `~/.claude`.

![](/assets/image/Cli/017.webp)

3. Open or create `config.json`:

![](/assets/image/Cli/018.webp)

4. Write the following into `config.json`:

```json
{
  "primaryApiKey": "PackyApi"
}
```

5. Restart VSCode.

:::

### Common Claude Code Commands

| Command | Description |
| --- | --- |
| `claude` | Launch interactive REPL in the current directory. |
| `claude "explain this project"` | Launch REPL with an initial prompt. |
| `claude -p "explain this function"` | Print mode: executes once, outputs result, and exits. |
| `cat logs.txt \| claude -p "summarize errors"` | Pipe file or command output directly into Claude. |
| `claude -c` | Continue the most recent conversation in this directory. |
| `claude -c -p "check type errors"` | Run a one-off prompt within the most recent session context. |
| `claude -r "abc123" "complete this PR"` | Resume a specific session by ID. |
| `claude update` | Update Claude Code CLI to the latest version. |
| `claude mcp` | Manage MCP server configurations. |
| `claude --add-dir ../apps ../lib` | Add extra directory paths for multi-project awareness. |
| `claude --agents '{"reviewer":{...}}'` | Define temporary subagents via JSON. |
| `claude -p "generate API docs" --output-format json` | Format output as structured JSON. |
| `claude --model sonnet` | Specify the model to use for this session. |
| `claude --verbose` | Verbose debug logging with full tool calls. |
| `claude --resume abc123 "continue bug fix"` | Resume session in any working directory. |
| `claude --continue` | Continue the most recent conversation in the directory. |
| `claude --append-system-prompt "Always use TypeScript"` | Append instructions to system prompt. |
| `claude --dangerously-skip-permissions` | Skip permission prompts (trusted environments only). |

### Claude Code Cannot Connect to Anthropic Services

::: info Note
If you were directed here during initial setup, run the appropriate command below.
:::

If you encounter this error:
```text
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR BAD REQUEST
Please check your internet connection and network settings.
```

![](/assets/image/FAQ/CC/001.webp)

Or during onboarding:

![](/assets/image/FAQ/CC/003.webp)

::: tabs

@tab Windows

1. Press `Win + R`, enter `cmd`, and press Enter.
2. Run the following command:

```bash
powershell -Command "$f='%USERPROFILE%\.claude.json';$j=Get-Content $f|ConvertFrom-Json;$j|Add-Member -NotePropertyName 'hasCompletedOnboarding' -NotePropertyValue $true -Force;$j|ConvertTo-Json|Set-Content $f"
```

3. Restart `claude`.

@tab MacOS

1. Open Terminal.

![](/assets/image/FAQ/CC/002.webp)

2. Run the following command:

```bash
jq '. + {"hasCompletedOnboarding": true}' ~/.claude.json > /tmp/tmp.json && mv /tmp/tmp.json ~/.claude.json
```

> [!tip]
> If `jq` is not found, install it with `brew install jq`.

3. Restart `claude`.

:::

### ::ic:round-whatshot:: API Error: 400 messages.1: system content must contain at least one block

When resuming or continuing a previous conversation (e.g. via `claude -c`), you may encounter the following error:

```text
API Error: 400 messages.1: system content must contain at least one block (request id: 20261007144143462-08e6b1a3)
```

#### Cause

**Incompatibility between upgraded client versions and legacy session records**.

After updating Claude Code to a newer version, session contexts recorded by previous versions (including system block formats, version metadata, or message structures) may not conform to the new client's request schema, causing an empty `system` block to be dispatched to the API.

#### Solutions

##### Solution 1: Start a New Conversation (Recommended)

The cleanest and fastest fix is starting a fresh session instead of resuming legacy context:

1. Start a new session (**do not pass** `-c` or `--continue`):
   ```bash
   claude
   ```
2. Prompt Claude to read previous session logs or workspace files to restore context:
   > "Please review our previous conversation history in `~/.claude` and workspace context, summarize the work completed, and continue the task here."
3. Continue working in this new conversation. New sessions conform strictly to the updated client specification and will not trigger this error.

##### Solution 2: Roll Back to the Previous Client Version

If you must continue directly inside the existing session:

1. **Find your previous client version**:
   Claude Code records a `version` field on every message entry in history logs.
   - **Method A (Ask Claude in a new session)**: Start a new `claude` session and prompt:
     > "Please inspect my session history in `~/.claude/history.jsonl`, check the `version` field on earlier successful records, and tell me the exact version number."
   - **Method B (Extract via terminal)**:
     - **macOS / Linux**:
       ```bash
       grep -o '"version":"[^"]*"' ~/.claude/history.jsonl | tail -n 10
       ```
     - **Windows PowerShell**:
       ```powershell
       Select-String -Path "$env:USERPROFILE\.claude\history.jsonl" -Pattern '"version":"([^"]+)"' | Select-Object -Last 10
       ```
2. **Reinstall the target version via npm**:
   Once the previous version number is determined, reinstall that specific release:
   ```bash
   npm install -g @anthropic-ai/claude-code@<version>
   ```
3. After rollback, resume your session normally with `claude -c`.

### How to Switch Claude Code Back to 200K Context and Disable Non-Essential Traffic

To switch from 1M to 200K context and disable telemetry, automatic update pings, and dynamic git polling:

::: tabs

@tab Windows

1. Press `Win + R`, enter `%userprofile%\.claude`, and press Enter.
2. Open `settings.json`.
3. Ensure `env` contains:

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

1. Press `Command + Shift + G` in Finder and enter `~/.claude`.
2. Open `settings.json`.
3. Ensure `env` contains:

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

::: tip Why Disable Git Status Collection (`CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`)
Claude Code by default attaches dynamic `git status` output to the system prompt. Because git status frequently changes with file edits, it alters the prompt prefix hash and breaks prompt cache matching. Disabling this keeps system prompt prefixes static, preserving cache hits and reducing token costs.
:::
