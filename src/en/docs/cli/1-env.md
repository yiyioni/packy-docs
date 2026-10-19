---
title: Environment Check (Node.js & npm)
icon: mdi:tools
order: 1
redirectFrom: /en/docs/register/5-env.html
---

Before installing any CLI tools, verify that **Node.js** and **npm** are installed on your machine and satisfy the minimum version requirements. This page focuses solely on environment verification; individual CLI installation instructions are located in their respective guides.

## (1) Confirm Installation

Run in your Windows, macOS, or Linux terminal:

```bash
node --version
npm --version
```

![](/assets/image/Cli/027.webp)

Both commands should print their respective version numbers (e.g. `v22.22.3` and `11.17.0`), indicating your environment is ready.

If you see "command not found" or similar errors, Node.js is not yet installed or has not been added to your system PATH. See [(3) What to do if not installed or outdated](#_3-what-to-do-if-not-installed-or-outdated).

## (2) Version Requirements & Recommendations

We recommend installing **Node.js 22 LTS** or **24 LTS**. npm comes bundled automatically with Node.js and does not need to be installed separately.

| Component | Recommended Version | Note |
| --- | --- | --- |
| Node.js | 22 LTS (v22.23.3) or 24 LTS (v24.22.0) | Both LTS release lines satisfy all CLI requirements below |
| npm | Bundled with Node.js | Official 22 LTS bundles npm 10.9.9; 24 LTS bundles npm 11.19.1 |

Minimum Node.js version declared by each CLI (data from npm registry `engines.node`):

| CLI | npm Package | Package Version | Requirement |
| --- | --- | --- | --- |
| Claude Code | `@anthropic-ai/claude-code` | 2.1.302 | Node.js ≥ 22.0.0 |
| Codex | `@openai/codex` | 0.163.0 | Node.js ≥ 16 |
| Kimi Code | `@moonshot-ai/kimi-code` | 2.2.0 | Node.js ≥ 22.19.0 |
| Qwen Code | `@qwen-code/qwen-code` | 0.1.x | Node.js ≥ 22.0.0 |

::: warning Kimi Code Requires Node.js ≥ 22.19.0
Among the CLI tools, Kimi Code has the highest version requirement (`≥ 22.19.0`). Installing on an older Node.js version will fail. Both modern 22 LTS and 24 LTS satisfy this requirement.
:::

::: tip Grok Build Does Not Use npm
Grok Build uses its official installation script rather than a global npm package. See [Grok Build Setup](/en/docs/cli/6-grok-build.html#install-grok-build).
:::

## (3) What to do if not installed or outdated

1. Download and install **22 LTS** or **24 LTS** from the official Node.js website: <https://nodejs.org/en/download>
2. After installation, **open a new terminal window** and run `node --version` and `npm --version` again to verify.
3. If your existing version is outdated (e.g. for Kimi Code you need ≥ 22.19.0), simply install the new version over the old one without uninstalling.

## Next Steps

Once your environment is verified, proceed to install and configure your desired CLI tools:

- [Claude Code Setup](/en/docs/cli/2-claude.html)
- [Codex Setup](/en/docs/cli/3-codex.html)
- [Grok Build Setup](/en/docs/cli/6-grok-build.html)
- [Kimi Code Setup](/en/docs/cli/7-kimi-code.html)
- [Qwen Code Setup](/en/docs/cli/8-qwen-code.html)
