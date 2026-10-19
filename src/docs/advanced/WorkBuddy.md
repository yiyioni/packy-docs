---
title: WorkBuddy
icon: /assets/icon/workbuddy.png
category:
  - 第三方接入
date: 2026-07-24
---

## 产品介绍

[WorkBuddy](https://www.codebuddy.cn/work/) 是腾讯出品的全场景 AI 办公工作台。用户可以通过自然语言下达任务，由 AI 自主拆解步骤、调用工具并交付文档、表格、PPT、数据分析等完整成果。

WorkBuddy 的主要特点包括：

- 覆盖运营、设计、数据、开发等多种办公场景，支持多专家协同执行任务。
- 支持桌面端、主流 IM 和小程序，可在不同终端发起和跟进任务。
- 支持 MCP 生态与自定义 Skills，可按需扩展工具和工作流。
- 支持在图形界面中添加第三方模型，配置 URL、API Key 和模型名称。

更多产品信息可查看 [WorkBuddy 官方介绍](https://www.workbuddy.cn/docs/workbuddy/Overview) 和 [模型配置说明](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Model)。

## 配置 PackyAPI

### 准备工作

开始配置前，请先完成以下准备：

1. 安装并登录 WorkBuddy。
2. 参考 [创建 API 令牌](/docs/register/4-token.html)，在 PackyAPI 网站创建 API Key。
3. 确认 API Key 所属分组支持需要使用的模型，并记录对应的模型名称。

目前支持接入 WorkBuddy 的令牌分组如下：

- `cc-sale`
- `deepseek-officially`
- `gemini-officially`
- `grok-officially`
- `mimo-officially`
- `minimax-officially`
- `zai-officially`
- `hunyuan-officially`
- `bailian`

::: important
API Key 所属分组决定了可用的模型。配置时填写的模型名称必须与该分组实际提供的模型 ID 完全一致，具体可在 [模型广场](/docs/token/1-intro.html) 或 [令牌分组介绍](/docs/token/2-group.html) 中查询。

请勿分享或公开展示 API Key。截图、录屏或寻求帮助时，应先确认密钥已经完整遮挡。
:::

### 配置步骤

1. 在 WorkBuddy 主界面点击左下角的账户区域展开菜单，然后点击 **设置**。

![](/assets/image/Advanced/WorkBuddy/01.jpg)

2. 进入设置界面后，在左侧导航栏中选择 **模型**。

![](/assets/image/Advanced/WorkBuddy/02.jpg)

3. 在自定义模型区域点击右上角的 **添加模型**。

![](/assets/image/Advanced/WorkBuddy/03.jpg)

4. 展开 **提供商** 列表，在 **其他** 分类中选择 **自定义 / Custom**。

![](/assets/image/Advanced/WorkBuddy/04.jpg)

5. 按照以下说明填写模型配置：

   - **接口地址**：根据所使用的模型类型填写对应地址（详见下方注意提示）。
   - **API Key**：粘贴在 PackyAPI 网站创建的 API Key。
   - **模型名称**：填写 API Key 所属分组下的模型 ID（如 `claude-opus-5` 或 `deepseek-flash`）。
   - **高级配置**：按照所选模型的实际能力勾选。使用 Claude 模型时请关闭“思考模式”；其余模型（如 DeepSeek 等）可按需开启思考模式。

::: warning 注意
- **使用 Claude 模型时**：接口地址需填写 `https://cf.api.fan/compatible/v1/chat/completions`（请关闭思考模式）
- **使用其余模型时（如 DeepSeek 等）**：接口地址请填写 `https://cf.api.fan/v1`
:::

确认配置无误后，点击右下角的 **保存**。WorkBuddy 会将配置写入本地的 `~/.workbuddy/models.json` 文件。

::: tabs

@tab Claude 模型配置示例
![](/assets/image/Advanced/WorkBuddy/05-claude.webp)

@tab 其余模型配置示例
![](/assets/image/Advanced/WorkBuddy/05-other.webp)

:::

6. 返回任务对话界面，点击输入框右下角的模型选择器，选择刚刚配置的模型。发送一条消息并正常收到回复，即表示 PackyAPI 接入成功。

![](/assets/image/Advanced/WorkBuddy/06.webp)
