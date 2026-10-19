---
title: GPT-Image 绘图教程（gpt-image-2.5-flare）
icon: material-symbols:image-outline
order: 2
---

本文介绍通过 Packy API 使用 `gpt-image-2.5-flare` 生成和编辑图片。

接口验证日期：2026 年 10 月 16 日。本文示例使用 `https://cf.api.fan`，适用于此模型和本次验证的渠道；其他模型请以各自说明为准。

## 前置准备

1. 在控制台创建具有 `gpt-image-2.5-flare` 调用权限的 API Key，并确认账户余额和模型权限。
2. 令牌分组以控制台当前提供的模型范围为准。如果模型不可用，请检查令牌分组、模型限制及渠道状态。
3. 准备支持 Images API 的客户端，或按下文直接调用接口。

| 配置项 | 填写内容 |
| --- | --- |
| 服务地址 | `https://cf.api.fan` |
| SDK Base URL（SDK 自动追加资源路径时） | `https://cf.api.fan/v1` |
| 模型名称 | `gpt-image-2.5-flare`（或 `gpt-image-2`） |
| 文生图完整地址 | `https://cf.api.fan/v1/images/generations` |
| 图片编辑完整地址 | `https://cf.api.fan/v1/images/edits` |
| 认证方式 | `Authorization: Bearer YOUR_API_KEY` |

不同客户端拼接地址的方式不同，请以最终请求地址为准，避免遗漏 `/v1` 或拼成 `/v1/v1`。

## 快速开始：生成第一张图片

先使用 `1024x1024`、`low`、`n: 1` 验证连接，再按需求提高质量或尺寸。

### 1. 准备请求文件

在工作目录新建 UTF-8 编码的 `request.json`，内容如下：

```json
{
  "model": "gpt-image-2.5-flare",
  "prompt": "一只橘猫戴着橙色围巾抱着水獭，温暖插画风格",
  "size": "1024x1024",
  "quality": "low",
  "output_format": "png",
  "n": 1
}
```

::: warning 注意事项
**不要添加 `response_format`。** 此模型直接返回 Base64 图片；传入 `response_format: "url"` 或 `response_format: "b64_json"` 均会报错 `unknown_parameter`。
:::

### 2. 发送请求

将 `YOUR_API_KEY` 替换为自己的密钥。以下命令需要在 `request.json` 所在目录执行。

macOS / Linux：

```bash
export PACKY_API_KEY="YOUR_API_KEY"
curl --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header response-headers.txt "https://cf.api.fan/v1/images/generations" -H "Authorization: Bearer $PACKY_API_KEY" -H "Content-Type: application/json" --data-binary @request.json --output response.json
```

Windows PowerShell：

```powershell
$env:PACKY_API_KEY = "YOUR_API_KEY"
curl.exe --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header response-headers.txt "https://cf.api.fan/v1/images/generations" -H "Authorization: Bearer $env:PACKY_API_KEY" -H "Content-Type: application/json" --data-binary "@request.json" --output response.json
```

请使用支持 `--fail-with-body` 的 curl（7.76.0 或更新）。成功时响应保存到 `response.json`；HTTP 错误时也会保留响应体，便于查看具体原因。不要直接将 `response.json` 改名为图片。

### 3. 保存返回的图片

返回结构示意如下，Base64 已省略，不能直接拿此示意内容解码：

```json
{
  "data": [
    {
      "b64_json": "此处为完整的图片Base64数据",
      "generation_id": "本次生成的标识"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024"
}
```

图片位于 `data[].b64_json`，不是下载链接。本次响应未包含 `revised_prompt`，程序不应依赖它一定存在。响应还可能包含 `created`、`usage` 等字段。

将下面内容保存为 `save_images.py`。脚本只使用 Python 3 标准库，可以保存全部返回图片，并按实际文件格式选择扩展名：

```python
import base64
import binascii
import json
import sys
from pathlib import Path


def main():
    source = Path(sys.argv[1] if len(sys.argv) > 1 else "response.json")
    result = json.loads(source.read_text(encoding="utf-8-sig"))
    if result.get("error"):
        raise ValueError("接口返回错误：" + json.dumps(result["error"], ensure_ascii=False))
    items = result.get("data")
    if not isinstance(items, list) or not items:
        raise ValueError("响应没有图片，请检查 HTTP 状态及响应内容")
    output_dir = source.parent / (source.stem + "-images")
    output_dir.mkdir(exist_ok=True)
    for index, item in enumerate(items, 1):
        encoded = item.get("b64_json")
        if not isinstance(encoded, str) or not encoded:
            raise ValueError(f"第 {index} 项缺少 b64_json")
        raw = base64.b64decode(encoded, validate=True)
        if raw.startswith(b"\x89PNG\r\n\x1a\n"):
            extension = "png"
        elif raw.startswith(b"\xff\xd8\xff"):
            extension = "jpg"
        elif raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
            extension = "webp"
        else:
            raise ValueError(f"第 {index} 项不是可识别的 PNG、JPEG 或 WebP")
        output = output_dir / f"image-{index}.{extension}"
        output.write_bytes(raw)
        print("已保存：", output)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, TypeError, AttributeError, binascii.Error) as error:
        print("保存失败：", error, file=sys.stderr)
        sys.exit(1)
```

macOS / Linux（需安装 Python 3）：

```bash
python3 save_images.py response.json
```

Windows（需安装 Python 3 及 Python 启动器）：

```powershell
py -3 save_images.py response.json
```

图片保存到 `response-images` 目录。重复解码同一个响应文件会覆盖同名图片；需要保留不同批次时，请使用不同的响应文件名。

## 文生图参数

下表将官方参数范围与本渠道实测情况分开说明。“官方定义”不代表已遍历测试所有取值。

| 参数 | 说明 | 本次验证情况 |
| --- | --- | --- |
| `model` | 必填，填写 `gpt-image-2.5-flare` | 已验证 |
| `prompt` | 必填，描述主体、场景、风格，以及需要出现的文字 | 中英文提示词均已出图 |
| `n` | 官方范围为整数 `1`–`10`，初次使用推荐 `1` | `1`、`2` 成功；`11` 被拒绝 |
| `size` | `auto` 或符合限制的 `宽x高` | 指定 `1024x1024`、`1536x864`、`3840x2160` 成功 |
| `quality` | `low`、`medium`、`high`、`xhigh`、`max`、`auto` | `low`、`high`、`xhigh`、`max` 成功；其余取值未单独验证 |
| `output_format` | `png`、`jpeg`、`webp` | 三种格式均已验证实际文件 |
| `output_compression` | JPEG / WebP 可设置 `0`–`100`；PNG 不使用此参数 | JPEG、WebP 的 `80` 成功；未逐一测试全部取值 |
| `background` | `opaque`、`transparent`、`auto`；透明输出需 PNG 或 WebP | 默认不透明、WebP 透明背景成功；透明 PNG 未单独验证 |
| `response_format` | **不要传入** | `url`、`b64_json` 都返回 400；响应本身包含 `b64_json` |
| `stream`、`partial_images` | 当前渠道未开启图片流式输出，教程使用非流式请求 | `stream: true` 返回渠道未开启的错误；请省略这两个字段 |

`moderation`、`user` 等非必要参数未纳入本次验证，首次接入请先使用本文最小示例。`style` 不在本文示例中使用。

### 尺寸与质量怎么选

| 用途 | 建议尺寸 |
| --- | --- |
| 正方形 | `1024x1024` |
| 横向插画 | `1536x1024` |
| 纵向海报 | `1024x1536` |
| 16:9 横图 | `1536x864` |
| 4K 横图 | `3840x2160`，属于高分辨率实验范围 |

根据官方说明，显式请求的自定义尺寸需要满足：

- 宽和高均为 16 的倍数。
- 长边与短边之比不超过 3:1。
- 任意一边不超过 3840 像素。
- 总像素数介于 655,360 与 8,294,400 之间。
- 高于 `2560x1440` 的分辨率属于实验范围，发布前请检查结果。

省略 `size` 时不要假设固定返回 `1024x1024`。本次仅传模型和提示词得到的是 `1254x1254` PNG；如有固定尺寸需求，请显式填写并检查生成文件。上述尺寸规则用于显式请求，不用于保证自动选择的输出尺寸。

建议先用 `low` 检查构图，满意后再选择更高质量。分辨率、质量、数量都会影响资源消耗，费用以控制台当前计费规则为准。

### 示例：一次生成两张 JPEG

将快速开始的 `request.json` 替换为以下内容，重新发送请求并运行保存脚本即可：

```json
{
  "model": "gpt-image-2.5-flare",
  "prompt": "白色背景中央的一个红色圆形，无文字",
  "size": "1024x1024",
  "quality": "low",
  "output_format": "jpeg",
  "output_compression": 80,
  "n": 2
}
```

### 示例：生成透明 WebP

```json
{
  "model": "gpt-image-2.5-flare",
  "prompt": "一个纯红色圆形，四周完全透明，没有阴影，没有文字",
  "size": "1536x864",
  "quality": "xhigh",
  "output_format": "webp",
  "output_compression": 80,
  "background": "transparent",
  "n": 1
}
```

::: tip 查看透明图片
查看透明图片时，部分软件会用白色或黑色显示透明区域。需要确认透明性时，请使用支持透明棋盘背景的图片查看器或编辑器。
:::

## 图片编辑与局部修改

编辑使用 `POST /v1/images/edits`，通过 `multipart/form-data` 上传原图。先准备一张名为 `input.png` 的图片，放在当前工作目录。

macOS / Linux：

```bash
curl --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header edit-headers.txt "https://cf.api.fan/v1/images/edits" -H "Authorization: Bearer $PACKY_API_KEY" -F "model=gpt-image-2.5-flare" -F "prompt=将图中的红色圆形改成蓝色，保留白色背景和圆形形状" -F "image=@input.png" -F "size=1024x1024" -F "quality=low" -F "output_format=png" -F "n=1" --output edit-response.json
```

Windows PowerShell：

```powershell
curl.exe --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header edit-headers.txt "https://cf.api.fan/v1/images/edits" -H "Authorization: Bearer $env:PACKY_API_KEY" -F "model=gpt-image-2.5-flare" -F "prompt=将图中的红色圆形改成蓝色，保留白色背景和圆形形状" -F "image=@input.png" -F "size=1024x1024" -F "quality=low" -F "output_format=png" -F "n=1" --output edit-response.json
```

不要手动设置此请求的 `Content-Type`，curl 会自动生成包含 boundary 的上传请求头。

编辑响应同样通过 `b64_json` 返回。保存方法与文生图相同，输入文件改为 `edit-response.json`：

```bash
python3 save_images.py edit-response.json
```

Windows 使用 `py -3 save_images.py edit-response.json`。

| 编辑字段 | 使用方法 |
| --- | --- |
| `image` | 必填，上传原图文件；本文按单张 PNG 输入编写 |
| `prompt` | 必填，写清楚需要保留和修改的内容 |
| `mask` | 可选，上传与原图像素尺寸一致、带透明通道的 PNG 蒙版 |
| `size`、`quality`、`output_format`、`n` | 按需填写；已验证编辑输出 `1024x1024`、`low`、PNG、1 张 |
| `input_fidelity` | **不要传入**，此模型会拒绝该参数 |
| `response_format` | **不要传入** |

### 使用蒙版

将需要修改的区域设为透明，将希望保留的区域设为不透明，保存为 `mask.png`。蒙版必须与**输入原图**尺寸一致；它不必与请求的输出 `size` 一致。

在上面的编辑命令中，紧接 `-F "image=@input.png"` 添加：

```text
-F "mask=@mask.png"
```

同时在提示词中明确要修改的对象。蒙版用于引导编辑，不能保证蒙版外所有像素完全不变。已验证上传原图和蒙版后，将红色圆形成功编辑为蓝色圆形。

## 关于其他接口

本教程推荐已验证的 Images API。OpenAI 官方也提供 Responses API 的图像生成工具：顶层选择受支持的主模型，在 `image_generation` 工具中指定图像模型；这与把图像模型直接作为普通聊天模型不同。

本次未验证 `cf.api.fan` 的 Responses 图像工具路径，也未验证普通 Chat Completions 出图，本文不对这些路径作可用性承诺。如需使用图片能力，建议统一接入 Images API。

## 在 Cherry Studio 中使用

1. 在控制台创建具有绘图模型权限的 API Key（分组以控制台当前提供的范围为准）。创建好令牌后，点击复制按钮，将 API Key 复制到剪切板。

2. 访问 [Cherry Studio](https://www.cherry-ai.com/) 官网下载并安装软件。

3. 打开 Cherry Studio，点击左下角设置按钮，进入 `模型服务` 页面，点击底部的 `添加` 按钮新增提供商。

4. 在添加提供商窗口中填写提供商名称，例如 `packyapi-gpt-image`，`提供商类型` 选择 `New API`，然后点击 `确定`。

![](/assets/image/Paint/gpt-image-2/01.webp)

5. 在左侧列表中找到刚添加的提供商，将第 1 步复制的 API Key 填入 `API 密钥`，`API 地址` 填写 `https://cf.api.fan`。

![](/assets/image/Paint/gpt-image-2/02.webp)

6. 点击模型区域右侧的 `获取模型列表`，刷新后添加 `gpt-image-2.5-flare`（或 `gpt-image-2`）模型。添加完成后，可以在提供商配置页中看到模型列表里已经出现该模型。

7. 点击模型右侧的编辑按钮，进入编辑模型窗口，将 `端点类型` 设置为 `图像生成（OpenAI）`，然后点击 `保存`。

![](/assets/image/Paint/gpt-image-2/03.webp)

8. 回到首页，点击顶部的 `+` 按钮，在应用列表中选择 `绘画`。

![](/assets/image/Paint/gpt-image-2/04.webp)

9. 进入绘画页面后，左侧 `提供商` 选择刚才添加的供应商，`模型` 选择 `gpt-image-2.5-flare`（或 `gpt-image-2`）。首次使用建议先将 `图片尺寸`、`质量`、`敏感度` 等选项保持为 `自动`，`生成数量` 保持为 `1`。

![](/assets/image/Paint/gpt-image-2/05.webp)

10. 如果只需要根据提示词生成图片，顶部选择 `绘图` 模式，输入提示词后点击发送按钮即可开始生成。

11. 如果需要上传参考图进行图生图或局部修改，顶部切换到 `编辑` 模式，在左侧 `输入图片` 中上传参考图，再输入修改要求后点击发送按钮。

![](/assets/image/Paint/gpt-image-2/06.webp)

::: tip 使用建议
- `API 地址` 直接填写 `https://cf.api.fan` 即可，Cherry Studio 会自动拼接兼容端点，无需手动补 `/v1`。
- 如果模型列表中没有对应模型，请先在 `管理` 中刷新模型；如果仍无法正常绘图，请检查 `端点类型` 是否为 `图像生成（OpenAI）`。
- 使用 `绘图` 模式可以进行文生图；使用 `编辑` 模式可以上传参考图进行图生图或局部修改。
- 如果客户端版本较旧，仍在后台发送 `response_format` 或 `input_fidelity`，可能导致 400 错误。若遇到此类问题，请检查客户端更新或直接使用本文提供的 API 方式调用。
- 普通对话页关闭流式输出并不会自动转换为 Images API，请优先使用绘画应用和图像生成端点。
:::

## 常见问题与排查

| 现象 | 处理方法 |
| --- | --- |
| `Unknown parameter: 'response_format'` | 删除整个 `response_format` 字段；不要只把 `url` 改成 `b64_json` |
| 提示不支持 `input_fidelity` | 删除 `input_fidelity` 字段 |
| `streaming image output is not enabled on this channel` | 省略 `stream`、`partial_images`，使用非流式请求；此提示表示当前渠道未开启 |
| `n` 超出范围 | 使用整数 `1`–`10`，首次调试使用 `1` |
| HTTP 401 / 403 或模型不可用 | 根据错误响应检查密钥、余额、令牌模型权限及渠道状态；不要只按状态码猜测原因 |
| HTTP 429 | 检查额度、并发或限流信息，按平台提示控制请求频率 |
| `Failed to fetch` | 查看网络面板的最终 URL、HTTP 状态和响应内容；排查客户端、网络、代理、浏览器跨域限制及服务端错误 |
| `Unexpected token '<' ... is not valid JSON` | 响应可能是 HTML 错误页、验证页或错误路径返回的页面；检查 HTTP 状态、`Content-Type`、路径及响应正文，不要盲目重试 |
| HTTP 200 但页面没有显示图片 | 检查 `data[].b64_json` 是否存在，并确认客户端支持 Base64 图片；可先按本文 Python 脚本保存到本地 |
| 超时或连接中断 | 检查客户端和代理的超时设置；先到控制台核对请求记录，再决定是否重试 |

### 可能遇到的客户端提示

如果 Cherry Studio 弹出 `Failed to fetch`，通常是请求连接被中断或受到网络/代理影响。可以先检查网络环境与代理设置，确认能正常访问 `https://cf.api.fan` 后再重试。

![](/assets/image/Paint/gpt-image-2/07.webp)

如果 Cherry Studio 弹出 `Unexpected token '<', "<html><h"... is not valid JSON`，通常是请求过程中收到了 Cloudflare 验证页或 HTML 报错页，客户端按 JSON 解析时显示异常。遇到这种情况请检查请求路径与网络状态，确认无误后再尝试。

![](/assets/image/Paint/gpt-image-2/08.webp)

## 特别注意：长连接与代理设置

无论是直接通过 API 调用，还是在 Cherry Studio 等客户端程序中使用绘图模型，图片生成请求通常都比普通聊天请求耗时更久，尤其是使用编辑模式、高清质量或高分辨率尺寸时。生成耗时受尺寸、质量、数量、排队及网络影响。如果本机代理、网络工具或中间网关对长连接有限制，可能会在超时阈值处主动断开连接，表现为 API 请求超时、没有返回内容，或客户端提示 `Failed to fetch`。

下面以 Cherry Studio 的编辑模式为例，长连接中断时程序侧通常会直接弹出 `Failed to fetch`；在开发者工具中，也可以看到 `edits` 请求停在超时时间附近。直接调用 API 时虽然界面提示不同，但问题本质相同，都是连接在图片生成完成前被中途断开。

![](/assets/image/Paint/gpt-image-2/09.webp)

如果确认是代理导致连接被中断，建议将实际请求域名 **`cf.api.fan`** 以及本站域名 **`packyapi.ai`** 加入代理工具的直连或白名单规则，让访问 Packy API 时不再经过代理。不同代理软件的设置入口可能不同，核心是添加类似 `domain:cf.api.fan` 和 `domain:packyapi.ai` 的域名规则。

![](/assets/image/Paint/gpt-image-2/10.webp)

放行后，同类请求可以等待更久并正常返回。下图中请求在约 1.6 分钟后返回图片；如果使用更高分辨率或更高质量选项，生成时间还可能继续增加。为了减少不可控的网络中断，建议绘图请求尽量直连 `cf.api.fan`，不要经过会限制长连接的代理或中转网络。

![](/assets/image/Paint/gpt-image-2/11.webp)

::: warning 超时与重试提示
- 无需手动添加 `Host` 或 `Connection: keep-alive` 请求头。`keep-alive` 不能替代客户端和代理的超时设置。
- 超时并不等于服务端没有完成生成。重试前先核对控制台的调用记录，避免重复生成和重复扣费。
:::

## 参考资料

- [OpenAI 图像生成指南](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI Images API 参数参考](https://developers.openai.com/api/reference/resources/images)
- [Cherry Studio 绘画指南](https://docs.cherryai.com.cn/cherry-studio/preview/drawing)
