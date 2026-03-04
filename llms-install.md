# IteraTools MCP Server — Installation Guide for AI Agents

## Prerequisites
- Node.js 18+
- An IteraTools API key (get one at https://iteratools.com)

## Installation (npx — recommended)

No installation needed. Run directly with:

```bash
npx mcp-iteratools
```

## Configuration

Set your API key via environment variable:

```bash
export ITERATOOLS_API_KEY=it-XXXX-XXXX-XXXX
npx mcp-iteratools
```

Or pass it as a flag:

```bash
npx mcp-iteratools --api-key it-XXXX-XXXX-XXXX
```

## Claude Desktop Configuration

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "iteratools": {
      "command": "npx",
      "args": ["mcp-iteratools"],
      "env": {
        "ITERATOOLS_API_KEY": "it-XXXX-XXXX-XXXX"
      }
    }
  }
}
```

## Cline Configuration

In Cline settings, add a new MCP server:

```json
{
  "iteratools": {
    "command": "npx",
    "args": ["mcp-iteratools"],
    "env": {
      "ITERATOOLS_API_KEY": "it-XXXX-XXXX-XXXX"
    }
  }
}
```

## Available Tools

Once connected, the following tools are available to your AI agent:

| Tool | Description |
|------|-------------|
| `image_generate` | Generate images with Flux 1.1 Pro ($0.005) |
| `image_fast` | Fast image generation with Flux Schnell ($0.002) |
| `image_rembg` | Remove image background ($0.003) |
| `image_resize` | Resize an image ($0.001) |
| `image_ocr` | Extract text from image ($0.002) |
| `scrape` | Scrape webpage content ($0.002) |
| `screenshot` | Screenshot a URL ($0.003) |
| `search` | Web search via Brave ($0.001) |
| `tts` | Text to speech ($0.001) |
| `qrcode` | Generate QR code ($0.001) |
| `pdf_extract` | Extract text from PDF ($0.002) |
| `pdf_generate` | Generate PDF from HTML ($0.003) |
| `translate` | Translate text ($0.001) |
| `transcribe` | Transcribe audio ($0.002) |
| `chart_generate` | Generate chart image ($0.002) |
| `weather` | Get weather data ($0.001) |
| `crypto_price` | Get crypto price ($0.001) |
| `url_shorten` | Shorten a URL ($0.001) |
| `email_validate` | Validate email address ($0.001) |
| `whatsapp_send` | Send WhatsApp message ($0.002) |

## Getting an API Key

1. Visit https://iteratools.com
2. Click "Get Started" or "Get API Key"
3. Enter your email to receive your free API key
4. Add credits via Stripe to start using paid tools

## Pricing

Pay-per-use, no subscription. Tools cost between $0.001 and $0.05 per call.
Credits can be purchased in any amount starting from $1.
