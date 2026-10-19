---
title: DS接入Codex
icon: simple-icons:deepseek
order: 7
---

本教程用于通过 CC Switch 将 PackyApi 的 `deepseek-officially` 分组接入 Codex CLI 和 ChatGPT。

:::: warning 兼容性提醒
Codex 原生面向 OpenAI 模型。接入 DeepSeek 后可能出现模型元数据缺失等提示，部分能力或性能可能受到影响。请以实际对话结果和 PackyApi 当前支持的模型为准。
::::

## 创建并启用供应商

1. 打开 CC Switch，在左侧应用切换栏中选择 **Codex**。

![](/assets/image/CC-Switch/guide/028.jpg)

2. 点击右上角 **+ 添加供应商**，在搜索预设供应商中搜 `packyapi`，选择 **PackyCode**。

![](/assets/image/CC-Switch/guide/029.jpg)

3. 回顾 [创建 API 令牌](/docs/register/4-token.html)，在 PackyApi 中创建 `deepseek-officially` 分组的令牌，然后复制 API Key。

![](/assets/image/CC-Switch/guide/030.jpg)

4. 在 PackyCode 供应商配置中填写以下内容：

   - **官网链接**：`https://www.packyapi.ai`
   - **API Key**：刚才创建的 `deepseek-officially` 分组 API Key
   - **API 请求地址**：`https://cf.api.fan/v1`
   - **默认模型**：`deepseek-v4-flash`

![](/assets/image/CC-Switch/guide/031.jpg)

5. 点击右下角 **添加**，返回供应商列表后启用新建的 PackyCode 供应商（显示 **使用中** 即表示切换成功）。

![](/assets/image/CC-Switch/guide/032.jpg)

6. 完全退出并重新打开正在运行的 Codex CLI 或 ChatGPT，使新的供应商配置生效。

## 验证配置

在终端运行 `codex` 并发送一条测试消息。界面底部显示 `deepseek-v4-flash` 且能够正常回复，即表示 Codex CLI 已经接入成功。

![](/assets/image/CC-Switch/guide/033.jpg)

如果使用 ChatGPT / Codex 桌面端，同样发送一条测试消息；能够正常回复即表示应用侧配置生效。

![](/assets/image/CC-Switch/guide/034.jpg)
