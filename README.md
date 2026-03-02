# mcp-iteratools

MCP server for [IteraTools API](https://iteratools.com) — 20+ AI-powered tools for AI agents, all under a single API key.

<a href="https://glama.ai/mcp/servers/@fredpsantos33/mcp-iteratools">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@fredpsantos33/mcp-iteratools/badge" alt="mcp-iteratools MCP server" />
</a>

## Tools Available

| Tool | Description | Price |
|------|-------------|-------|
| `generate_image` | AI image generation (Flux 1.1 Pro) | $0.005 |
| `fast_image` | Fast image generation (Flux Schnell) | $0.002 |
| `remove_background` | Remove image background | $0.003 |
| `resize_image` | Resize an image | $0.001 |
| `ocr` | Extract text from image | $0.002 |
| `generate_video` | AI video generation | $0.050 |
| `screenshot` | Screenshot a webpage | $0.003 |
| `scrape` | Scrape webpage content | $0.002 |
| `search` | Web search (Brave) | $0.001 |
| `extract_pdf` | Extract text from PDF | $0.002 |
| `generate_pdf` | Generate PDF from HTML | $0.003 |
| `tts` | Text-to-speech | $0.001 |
| `qrcode` | Generate QR code | $0.001 |
| `weather` | Current weather data | $0.001 |
| `crypto_price` | Cryptocurrency prices | $0.001 |
| `shorten_url` | URL shortener | $0.001 |
| `validate_email` | Email validation | $0.001 |

Pay-per-use pricing with [x402 protocol](https://x402.org) support.

## Setup

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

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

### Smithery (hosted MCP)

Also available as a hosted MCP server on [Smithery](https://smithery.ai/server/@iterasoft/iteratools):

```json
{
  "mcpServers": {
    "iteratools": {
      "url": "https://server.smithery.ai/@iterasoft/iteratools/mcp?api_key=YOUR_KEY"
    }
  }
}
```

## Getting an API Key

1. Visit [iteratools.com](https://iteratools.com)
2. Create a free API key
3. Add credits via Stripe

## Links

- **Website:** https://iteratools.com
- **API Docs:** https://iteratools.com
- **Smithery:** https://smithery.ai/server/@iterasoft/iteratools

## License

MIT