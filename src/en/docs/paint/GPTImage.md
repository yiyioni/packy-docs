---
title: GPT-Image-2 Tutorial
icon: material-symbols:image-outline
order: 2
---

## Prerequisites

The `gpt-image-2` model belongs to the **Sora Group**. Before using it, create a token with the group set to `sora`.

Refer to the [Create Token Group](/en/docs/register/4-token.html#enter-token-management) tutorial to create a token, and **select `sora` for the group**.

## Invocation Methods

OpenAI's official documentation categorizes image-related capabilities into Responses API, Images API, and Chat Completions API. For Packy's `gpt-image-2`, please prioritize using the Images API.

| API | OpenAI Official Purpose | Recommendation for Packy `gpt-image-2` | Status |
|-----|-------------------------|----------------------------------------|--------|
| Responses API | Analyze images as input; generate image output via tools | Not supported as an entry point for `gpt-image-2`. Use Images API instead. | Not Supported |
| Images API | Generate images, upload images as input for editing | Supports text-to-image and image editing; recommended method for `gpt-image-2`. | Recommended |
| Chat Completions API | Analyze image inputs and generate text or audio | Not supported as an entry point for `gpt-image-2`; `size`, `quality`, `output_format` parameters do not take effect. | Not Supported |

### Method 1: Images API (Recommended)

Images API is the recommended method for `gpt-image-2`, consisting of two endpoints:

- Text-to-Image: `POST https://cf.api.fan/v1/images/generations`
- Image Editing / Image-to-Image: `POST https://cf.api.fan/v1/images/edits`

Each endpoint is explained below with examples and parameters. For beginners, simply pass `model`, `prompt`, and set `n` to `1`; when uploading an image, use the `image` field.

::: tip Recommended Usage
Use `/v1/images/generations` for text-to-image, and `/v1/images/edits` for image editing with a reference image.
:::

#### Text-to-Image: `/v1/images/generations`

##### Example Request

```bash
curl --location 'https://cf.api.fan/v1/images/generations' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_SORA_TOKEN' \
--header 'Accept: */*' \
--header 'Host: cf.api.fan' \
--header 'Connection: keep-alive' \
--data '{
    "model": "gpt-image-2",
    "prompt": "An orange cat wearing an orange scarf holding an otter, warm illustration style",
    "size": "3840x2160",
    "quality": "high",
    "output_format": "png",
    "response_format": "url",
    "n": 1
}'
```

##### Parameters

| Parameter | Type | Support | Description |
|-----------|------|---------|-------------|
| `model` | string | Supported | Always set to `gpt-image-2`. |
| `prompt` | string | Supported | Description of the desired image; specify subject, scene, style, ratio, and text. |
| `n` | integer | `1` only | Returns 1 image per request. Multi-image requests (e.g. `n: 2`, `n: 4`) are not supported. |
| `size` | string | Supported | Supports `auto` and constrained sizes such as `1024x1024`, `1536x1024`, `1024x1536`, `1536x864`, `3840x2160`. |
| `quality` | string | Supported | Options: `low`, `medium`, `high`, `auto`. Use `low` for drafts, `high` for production. |
| `response_format` | string | Supported | Options: `url`, `b64_json`. Default recommendation is `url`; `b64_json` is useful for programmatic saving. |
| `output_format` | string | Partial | Recommended: `png` or `jpeg`. `webp` is not recommended. |
| `output_compression` | integer | Supported | Only applicable when `output_format` is `jpeg`, values from `0` to `100`. |
| `background` | string | Partial | Recommended: default or `opaque`. `transparent` is not supported. |
| `moderation` | string | Supported | Options: `auto`, `low`. Safety moderation parameter; does not directly alter art style. Keep default when unsure. |
| `user` | string | Supported | Optional identifier for your end-user. Can be omitted for standard calls. |
| ~~`stream`~~ | boolean | Not Supported | Do not enable streaming. |
| ~~`partial_images`~~ | integer | Not Supported | Intermediate image streaming; not supported. |
| ~~`style`~~ | string | Not Recommended | Legacy parameter from older models; not needed for `gpt-image-2`. |

#### Image Editing / Image-to-Image: `/v1/images/edits`

`/v1/images/edits` uses `multipart/form-data` for file uploads. Pass the binary image file in `image` and describe desired modifications in `prompt`.

##### Example Request

```bash
curl --location 'https://cf.api.fan/v1/images/edits' \
--header 'Authorization: Bearer YOUR_SORA_TOKEN' \
--header 'Accept: */*' \
--form 'model="gpt-image-2"' \
--form 'prompt="Keep the subject, add a small red stamp in the top right corner with DEMO written on it"' \
--form 'image=@"/path/to/your-image.jpg"' \
--form 'size="1024x1024"' \
--form 'quality="high"' \
--form 'output_format="png"' \
--form 'response_format="url"'
```

##### Parameters

| Parameter | Type | Support | Description |
|-----------|------|---------|-------------|
| `model` | string | Supported | Always set to `gpt-image-2`. |
| `prompt` | string | Supported | Clearly describe what to keep, modify, and the desired outcome. |
| `image` | file | Supported | Required binary image file. Upload 1 image per request. |
| `mask` | file | Supported | Optional PNG mask for localized edits; if omitted, the whole image is edited. |
| `n` | integer | `1` only | Returns 1 image per request. Multiple outputs not supported. |
| `size` | string | Supported | Same as text-to-image; supports `auto` and constrained sizes. |
| `quality` | string | Supported | Options: `low`, `medium`, `high`, `auto`. |
| `response_format` | string | Supported | Options: `url`, `b64_json`. Default recommendation is `url`. |
| `output_format` | string | Partial | Recommended: `png` or `jpeg`. `webp` is not recommended. |
| `output_compression` | integer | Supported | Only applicable when `output_format` is `jpeg`, values from `0` to `100`. |
| `background` | string | Partial | Recommended: default or `opaque`. `transparent` is not supported. |
| `moderation` | string | Supported | Options: `auto`, `low`. Safety moderation parameter. |
| `input_fidelity` | string | Supported | Can pass `high` to preserve original subject and details. |
| `user` | string | Supported | Optional identifier. |
| ~~`stream`~~ | boolean | Not Supported | Do not enable streaming. |
| ~~`partial_images`~~ | integer | Not Supported | Intermediate image streaming; not supported. |

#### General Notes

##### Sizes and Quality

- **Popular Sizes**
  - **1024 × 1024**: Square
  - **1536 × 1024**: Landscape
  - **1024 × 1536**: Portrait
  - **2048 × 2048**: 2K Square
  - **2048 × 1152**: 2K Landscape
  - **3840 × 2160**: 4K Landscape
  - **2160 × 3840**: 4K Portrait
  - **auto**: Automatic (Default)

- **Size Constraints**
  - Maximum dimension must be **less than or equal to 3840 pixels**.
  - Width and height must be **multiples of 16**.
  - Aspect ratio **cannot exceed 3:1**.
  - Total pixels must be **between 655,360 and 8,294,400**.

- **Quality Options**
  - **low**: Low quality (fastest)
  - **medium**: Medium quality
  - **high**: High quality (recommended for production)
  - **auto**: Automatic (Default)

##### Response Format

Default response returns a download URL:

```json
{
  "created": 1776923999,
  "data": [
    {
      "url": "https://external-resources.packyapi.ai/file_download/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "revised_prompt": "..."
    }
  ]
}
```

If `"response_format": "b64_json"` is passed, base64 image data is returned:

```json
{
  "created": 1776923999,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA...",
      "revised_prompt": "..."
    }
  ]
}
```

### Method 2: Responses API (Not Supported)

::: warning Not Supported
Packy's `gpt-image-2` does not support generating images via `/v1/responses`. Do not use `image_generation` tools, `input`, or `input_image` to invoke `gpt-image-2`.
:::

### Method 3: Chat Completions API (Not Supported)

::: warning Not Supported
Packy's `gpt-image-2` does not support generating images via `/v1/chat/completions`. Do not pass image generation parameters into Chat Completions requests.
:::

## Using in Cherry Studio

1. Refer to [Create Token Group](/en/docs/register/4-token.html#enter-token-management) and create an API Key with the group set to `sora`. Copy the API Key.
2. Download and install [Cherry Studio](https://www.cherry-ai.com/).
3. Open Cherry Studio, click Settings in the bottom-left corner, go to **Model Services**, and click **Add** at the bottom to add a provider.
4. Name the provider (e.g. `packyapi-gpt-image-2`), set **Provider Type** to `New API`, and click **OK**.

![](/assets/image/Paint/gpt-image-2/01.webp)

5. Paste your `sora` API Key into **API Key**, and set **API URL** to `https://cf.api.fan`.

![](/assets/image/Paint/gpt-image-2/02.webp)

6. Click **Get Model List**, refresh, and add `gpt-image-2`.
7. Click the edit button next to `gpt-image-2`, set **Endpoint Type** to `Image Generation (OpenAI)`, and save.

![](/assets/image/Paint/gpt-image-2/03.webp)

8. Return to the main screen, click `+` at the top, and select the **Paint / Image Generation** application.

![](/assets/image/Paint/gpt-image-2/04.webp)

9. On the left panel, select your newly added provider and set model to `gpt-image-2`. Keep size, quality, and moderation set to Auto initially, and count set to 1.

![](/assets/image/Paint/gpt-image-2/05.webp)

10. Use **Paint** mode for text-to-image by typing your prompt and sending.
11. Use **Edit** mode to upload a reference image for image-to-image or editing.

![](/assets/image/Paint/gpt-image-2/06.webp)

## Notes on Long Connections & Proxies

Image generation requests take significantly longer than text chats. If your local proxy or gateway enforces strict timeouts (around 60s), the connection may be prematurely dropped, showing `Failed to fetch`.

Configure your proxy client to set **`cf.api.fan`** and **`packyapi.ai`** to **Direct Connection (Bypass Proxy / Whitelist)** to prevent unexpected timeouts.
