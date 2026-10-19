---
title: GPT-Image Tutorial (gpt-image-2.5-flare)
icon: material-symbols:image-outline
order: 2
---

This guide introduces image generation and editing using `gpt-image-2.5-flare` via Packy API.

Verification Date: October 16, 2026. The examples in this guide use `https://cf.api.fan`, which applies to this model and the verified channel.

## Prerequisites

1. In the console, create an API Key with permissions for `gpt-image-2.5-flare` and verify account balance and model access.
2. Token grouping is subject to current console offerings. If the model is unavailable, check token group permissions, model restrictions, and channel status.
3. Prepare an Images API-compatible client or call the API directly as shown below.

| Configuration | Value |
| --- | --- |
| Service Address | `https://cf.api.fan` |
| SDK Base URL (when SDK auto-appends path) | `https://cf.api.fan/v1` |
| Model Name | `gpt-image-2.5-flare` (or `gpt-image-2`) |
| Text-to-Image Endpoint | `https://cf.api.fan/v1/images/generations` |
| Image Editing Endpoint | `https://cf.api.fan/v1/images/edits` |
| Authentication | `Authorization: Bearer YOUR_API_KEY` |

Different clients construct URLs differently; ensure the final endpoint contains `/v1` without duplicating it (e.g. `/v1/v1`).

## Quick Start: Generate Your First Image

Start with `1024x1024`, `low`, and `n: 1` to verify connectivity before requesting higher resolutions or quality.

### 1. Prepare Request File

Create a UTF-8 encoded `request.json` file in your working directory:

```json
{
  "model": "gpt-image-2.5-flare",
  "prompt": "An orange cat wearing an orange scarf holding an otter, warm illustration style",
  "size": "1024x1024",
  "quality": "low",
  "output_format": "png",
  "n": 1
}
```

::: warning Important Note
**Do not pass `response_format`.** This model directly returns Base64 image data. Passing `response_format: "url"` or `response_format: "b64_json"` will return a 400 `unknown_parameter` error.
:::

### 2. Send Request

Replace `YOUR_API_KEY` with your actual token. Run the command in the directory containing `request.json`.

macOS / Linux:

```bash
export PACKY_API_KEY="YOUR_API_KEY"
curl --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header response-headers.txt "https://cf.api.fan/v1/images/generations" -H "Authorization: Bearer $PACKY_API_KEY" -H "Content-Type: application/json" --data-binary @request.json --output response.json
```

Windows PowerShell:

```powershell
$env:PACKY_API_KEY = "YOUR_API_KEY"
curl.exe --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header response-headers.txt "https://cf.api.fan/v1/images/generations" -H "Authorization: Bearer $env:PACKY_API_KEY" -H "Content-Type: application/json" --data-binary "@request.json" --output response.json
```

Use curl with `--fail-with-body` support (v7.76.0+). On success, the response is saved to `response.json`; on HTTP errors, the error response body is retained for easy inspection. Do not simply rename `response.json` to an image file.

### 3. Save Returned Image

Response structure schematic (Base64 omitted):

```json
{
  "data": [
    {
      "b64_json": "Base64 image data string...",
      "generation_id": "generation-identifier"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024"
}
```

Images reside in `data[].b64_json`, not as download URLs. `revised_prompt` may not be present and should not be strictly required by clients.

Save the following script as `save_images.py`. It uses only the Python 3 standard library to decode and save all returned images with automatic format detection:

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
        raise ValueError("API Error: " + json.dumps(result["error"], ensure_ascii=False))
    items = result.get("data")
    if not isinstance(items, list) or not items:
        raise ValueError("No images found in response. Check HTTP status and response body.")
    output_dir = source.parent / (source.stem + "-images")
    output_dir.mkdir(exist_ok=True)
    for index, item in enumerate(items, 1):
        encoded = item.get("b64_json")
        if not isinstance(encoded, str) or not encoded:
            raise ValueError(f"Item {index} missing b64_json")
        raw = base64.b64decode(encoded, validate=True)
        if raw.startswith(b"\x89PNG\r\n\x1a\n"):
            extension = "png"
        elif raw.startswith(b"\xff\xd8\xff"):
            extension = "jpg"
        elif raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
            extension = "webp"
        else:
            raise ValueError(f"Item {index} is not recognized as PNG, JPEG, or WebP")
        output = output_dir / f"image-{index}.{extension}"
        output.write_bytes(raw)
        print("Saved:", output)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, TypeError, AttributeError, binascii.Error) as error:
        print("Save failed:", error, file=sys.stderr)
        sys.exit(1)
```

macOS / Linux:

```bash
python3 save_images.py response.json
```

Windows PowerShell:

```powershell
py -3 save_images.py response.json
```

Images are saved to the `response-images` folder.

## Text-to-Image Parameters

| Parameter | Description | Verification Status |
| --- | --- | --- |
| `model` | Required. Specify `gpt-image-2.5-flare` | Verified |
| `prompt` | Required. Describe subjects, scene, style, and text | Verified with English and Chinese |
| `n` | Official range is integer `1`–`10`. Default `1` | `1` and `2` verified; `11` rejected |
| `size` | `auto` or valid `widthxheight` | `1024x1024`, `1536x864`, `3840x2160` verified |
| `quality` | `low`, `medium`, `high`, `xhigh`, `max`, `auto` | `low`, `high`, `xhigh`, `max` verified |
| `output_format` | `png`, `jpeg`, `webp` | All three verified with valid files |
| `output_compression` | `0`–`100` for JPEG / WebP; not used for PNG | `80` verified for JPEG and WebP |
| `background` | `opaque`, `transparent`, `auto`; transparent requires PNG or WebP | Default opaque and WebP transparent verified |
| `response_format` | **Do not pass** | Both `url` and `b64_json` return 400; response natively includes `b64_json` |
| `stream`, `partial_images` | Image streaming is not enabled on this channel | `stream: true` returns channel error; omit both fields |

### Size & Quality Selection Guide

| Use Case | Recommended Size |
| --- | --- |
| Square | `1024x1024` |
| Landscape Illustration | `1536x1024` |
| Portrait Poster | `1024x1536` |
| 16:9 Widescreen | `1536x864` |
| 4K UHD | `3840x2160` (Experimental resolution) |

Explicit custom sizes must meet the following rules:

- Width and height must both be multiples of 16.
- Aspect ratio must not exceed 3:1.
- Max dimension $\le 3840$ pixels.
- Total pixel count between 655,360 and 8,294,400.
- Resolutions higher than `2560x1440` are considered experimental.

If `size` is omitted, the model chooses automatically (e.g. `1254x1254` PNG in test). Specify `size` explicitly if a fixed resolution is required.

### Example: Generate Two JPEGs

```json
{
  "model": "gpt-image-2.5-flare",
  "prompt": "A red circle in the center of a pure white background, no text",
  "size": "1024x1024",
  "quality": "low",
  "output_format": "jpeg",
  "output_compression": 80,
  "n": 2
}
```

### Example: Generate Transparent WebP

```json
{
  "model": "gpt-image-2.5-flare",
  "prompt": "A pure red circle, fully transparent surrounding, no shadows, no text",
  "size": "1536x864",
  "quality": "xhigh",
  "output_format": "webp",
  "output_compression": 80,
  "background": "transparent",
  "n": 1
}
```

## Image Editing & Inpainting

Image editing uses `POST /v1/images/edits` via `multipart/form-data`. Prepare an `input.png` image in your working directory.

macOS / Linux:

```bash
curl --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header edit-headers.txt "https://cf.api.fan/v1/images/edits" -H "Authorization: Bearer $PACKY_API_KEY" -F "model=gpt-image-2.5-flare" -F "prompt=Change the red circle to a blue circle, retain white background and shape" -F "image=@input.png" -F "size=1024x1024" -F "quality=low" -F "output_format=png" -F "n=1" --output edit-response.json
```

Windows PowerShell:

```powershell
curl.exe --connect-timeout 30 --max-time 300 --fail-with-body --show-error --dump-header edit-headers.txt "https://cf.api.fan/v1/images/edits" -H "Authorization: Bearer $env:PACKY_API_KEY" -F "model=gpt-image-2.5-flare" -F "prompt=Change the red circle to a blue circle, retain white background and shape" -F "image=@input.png" -F "size=1024x1024" -F "quality=low" -F "output_format=png" -F "n=1" --output edit-response.json
```

Do not manually add a `Content-Type` header; curl sets the boundary automatically.

Save the edited image using the same Python script:

```bash
python3 save_images.py edit-response.json
```

| Edit Field | Usage |
| --- | --- |
| `image` | Required binary file of the source image |
| `prompt` | Required description of changes |
| `mask` | Optional PNG mask with transparent alpha matching source image dimensions |
| `size`, `quality`, `output_format`, `n` | Optional parameters |
| `input_fidelity` | **Do not pass** (rejected by model with 400 error) |
| `response_format` | **Do not pass** |

### Using an Inpainting Mask

Set areas to modify as transparent and areas to preserve as opaque. The mask must match the **input image** dimensions exactly.

Add `-F "mask=@mask.png"` to the curl command:

```text
-F "mask=@mask.png"
```

## About Other APIs

This tutorial recommends the verified Images API. OpenAI also offers image tools in Responses API (`image_generation`), which differs from calling image models directly as chat models. Responses image tools and Chat Completions image generation are unverified on `cf.api.fan`; prioritize Images API.

## Using in Cherry Studio

1. Create an API Key in the console with image model access. Copy the API Key.
2. Download and install [Cherry Studio](https://www.cherry-ai.com/).
3. Open Cherry Studio, click the lower-left settings icon, navigate to `Model Services`, and click `Add`.
4. Set Provider Name to `packyapi-gpt-image`, Provider Type to `New API`, and click OK.

![](/assets/image/Paint/gpt-image-2/01.webp)

5. Paste your API Key and set `API Address` to `https://cf.api.fan`.

![](/assets/image/Paint/gpt-image-2/02.webp)

6. Click `Fetch Model List` to add `gpt-image-2.5-flare` (or `gpt-image-2`).
7. Click the edit icon next to the model, set Endpoint Type to **Image Generation (OpenAI)**, and click Save.

![](/assets/image/Paint/gpt-image-2/03.webp)

8. Return to Home, click the `+` button in the top bar, and select the **Paint** app.

![](/assets/image/Paint/gpt-image-2/04.webp)

9. Select the provider and model `gpt-image-2.5-flare`. Keep size and quality as Auto and quantity as 1 for initial tests.

![](/assets/image/Paint/gpt-image-2/05.webp)

10. For text-to-image, select **Paint** mode at the top and enter your prompt.
11. For editing or image-to-image, switch to **Edit** mode, upload a reference image, and submit your prompt.

![](/assets/image/Paint/gpt-image-2/06.webp)

::: tip Usage Tips
- **API Address**: Simply enter `https://cf.api.fan`; Cherry Studio automatically appends compatible endpoints without needing `/v1`.
- If older client versions send `response_format` or `input_fidelity`, check for client updates or invoke the API directly.
- Disabling stream in standard chat does not convert Chat Completions to Images API; use the Paint app.
:::

## Troubleshooting & FAQ

| Issue | Resolution |
| --- | --- |
| `Unknown parameter: 'response_format'` | Remove `response_format` entirely from your payload. |
| Unsupported `input_fidelity` | Remove `input_fidelity` from form-data. |
| `streaming image output is not enabled on this channel` | Omit `stream` and `partial_images`; streaming is not enabled on this channel. |
| `n` out of range | Use integers `1`–`10`. |
| HTTP 401 / 403 or model unavailable | Verify token permissions, account balance, and model group restrictions. |
| HTTP 429 | Rate limit reached; adjust request frequency. |
| `Failed to fetch` | Check network, proxy, browser CORS, and ensure `cf.api.fan` is accessible. |
| `Unexpected token '<' ... is not valid JSON` | HTML error or challenge page returned; verify endpoint URL and status before retrying. |
| HTTP 200 but image not rendered | Verify `data[].b64_json` is present; decode locally using the provided Python script. |
| Timeout / connection abort | Check client and proxy timeout settings; verify console logs before retrying. |

### Client Error Screens

- **`Failed to fetch`**: Network interruption or proxy timeout. Ensure `https://cf.api.fan` is accessible.

![](/assets/image/Paint/gpt-image-2/07.webp)

- **`Unexpected token '<', "<html>...`**: A Cloudflare challenge or HTML error page was returned instead of JSON.

![](/assets/image/Paint/gpt-image-2/08.webp)

## Long-Connection & Proxy Settings

Image generation tasks can take 60–120 seconds or longer depending on resolution and quality. If your local proxy software enforces a 60-second connection timeout, it may abort the request and display `Failed to fetch`.

![](/assets/image/Paint/gpt-image-2/09.webp)

To avoid proxy timeouts, configure your proxy client to **Direct Connect (Bypass Proxy / Whitelist)** for both **`cf.api.fan`** and **`packyapi.ai`**.

![](/assets/image/Paint/gpt-image-2/10.webp)

Once configured, image generation requests can complete cleanly without premature proxy termination.

![](/assets/image/Paint/gpt-image-2/11.webp)

::: warning Timeout & Retry Reminder
- Do not manually add `Host` or `Connection: keep-alive` headers; they cannot override proxy/client timeouts.
- A timeout does not mean the backend failed to generate; check console logs before retrying to avoid duplicate charges.
:::

## References

- [OpenAI Image Generation Guide](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI Images API Reference](https://developers.openai.com/api/reference/resources/images)
- [Cherry Studio Drawing Guide](https://docs.cherryai.com.cn/cherry-studio/preview/drawing)
