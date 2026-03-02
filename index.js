#!/usr/bin/env node
'use strict';

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');

const BASE_URL = process.env.ITERATOOLS_BASE_URL || 'https://tools.iterasoft.com';
const ADMIN_KEY = process.env.ITERATOOLS_ADMIN_KEY || '';
const WALLET_KEY = process.env.ITERATOOLS_WALLET_KEY || '';

function getAuthHeaders() {
  if (ADMIN_KEY) {
    return { Authorization: `Bearer ${ADMIN_KEY}` };
  }
  if (WALLET_KEY) {
    // x402 stub — pass wallet key as a payment proof placeholder
    return { 'X-Payment': JSON.stringify({ type: 'evm-permit', payload: { txHash: WALLET_KEY } }) };
  }
  return {};
}

async function callTool(method, path, body) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };

  const opts = { method, headers };
  if (body && method !== 'GET') {
    opts.body = JSON.stringify(body);
  }

  const resp = await fetch(url, opts);
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(`API error ${resp.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// Tool definitions
const TOOLS = [
  {
    name: 'generate_image',
    description: 'Generate an AI image using Flux 1.1 Pro. Returns a URL to the generated image.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Image generation prompt' },
        width: { type: 'integer', description: 'Image width in pixels', default: 1024 },
        height: { type: 'integer', description: 'Image height in pixels', default: 1024 },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'fast_image',
    description: 'Generate a fast AI image using Flux Schnell (cheaper, faster, slightly lower quality).',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Image generation prompt' },
        width: { type: 'integer', default: 1024 },
        height: { type: 'integer', default: 1024 },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'web_search',
    description: 'Search the web using Brave Search API. Returns titles, URLs, and descriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        count: { type: 'integer', description: 'Number of results (1-10)', default: 5 },
        country: { type: 'string', description: 'Country code (US, BR, etc)', default: 'US' },
      },
      required: ['query'],
    },
  },
  {
    name: 'scrape_url',
    description: 'Scrape and extract text content from a webpage.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to scrape' },
        format: { type: 'string', description: 'Output format: text or html', default: 'text' },
      },
      required: ['url'],
    },
  },
  {
    name: 'text_to_speech',
    description: 'Convert text to speech audio. Returns base64 encoded audio.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to convert to speech' },
        voice: { type: 'string', description: 'Voice name (e.g. pt-BR-AntonioNeural, en-US-JennyNeural)', default: 'pt-BR-AntonioNeural' },
        format: { type: 'string', description: 'Audio format: mp3 or wav', default: 'mp3' },
      },
      required: ['text'],
    },
  },
  {
    name: 'screenshot',
    description: 'Take a screenshot of a webpage. Returns base64 encoded image.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to screenshot' },
        width: { type: 'integer', default: 1280 },
        height: { type: 'integer', default: 720 },
        format: { type: 'string', default: 'png' },
      },
      required: ['url'],
    },
  },
  {
    name: 'qr_code',
    description: 'Generate a QR code for any text or URL. Returns a base64 PNG data URL.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text or URL to encode' },
        size: { type: 'integer', description: 'Size in pixels', default: 256 },
        error_level: { type: 'string', description: 'Error correction: L, M, Q, H', default: 'M' },
      },
      required: ['text'],
    },
  },
  {
    name: 'weather',
    description: 'Get current weather for any city or location.',
    inputSchema: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City name or location' },
        units: { type: 'string', description: 'metric or imperial', default: 'metric' },
      },
      required: ['location'],
    },
  },
  {
    name: 'crypto_price',
    description: 'Get current cryptocurrency price from CoinGecko.',
    inputSchema: {
      type: 'object',
      properties: {
        coin: { type: 'string', description: 'Coin ID (e.g. bitcoin, ethereum, solana)', default: 'bitcoin' },
        currency: { type: 'string', description: 'Currency (usd, brl, eur)', default: 'usd' },
      },
      required: ['coin'],
    },
  },
  {
    name: 'email_validate',
    description: 'Validate an email address (syntax + MX DNS check).',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email address to validate' },
      },
      required: ['email'],
    },
  },
  {
    name: 'url_shorten',
    description: 'Shorten a URL using the IteraTools URL shortener.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to shorten' },
      },
      required: ['url'],
    },
  },
];

// Create server
const server = new Server(
  { name: 'mcp-iteratools', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'generate_image':
        result = await callTool('POST', '/image/generate', args);
        break;
      case 'fast_image':
        result = await callTool('POST', '/image/fast', args);
        break;
      case 'web_search':
        result = await callTool('POST', '/search', args);
        break;
      case 'scrape_url':
        result = await callTool('POST', '/scrape', args);
        break;
      case 'text_to_speech':
        result = await callTool('POST', '/tts', args);
        break;
      case 'screenshot':
        result = await callTool('POST', '/screenshot', args);
        break;
      case 'qr_code':
        result = await callTool('POST', '/qrcode', { text: args.text, size: args.size, error_level: args.error_level });
        break;
      case 'weather': {
        const qs = new URLSearchParams({ location: args.location, units: args.units || 'metric' });
        result = await callTool('GET', `/weather?${qs}`, null);
        break;
      }
      case 'crypto_price': {
        const qs = new URLSearchParams({ coin: args.coin, currency: args.currency || 'usd' });
        result = await callTool('GET', `/crypto/price?${qs}`, null);
        break;
      }
      case 'email_validate':
        result = await callTool('POST', '/email/validate', args);
        break;
      case 'url_shorten':
        result = await callTool('POST', '/url/shorten', args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('IteraTools MCP server running on stdio');
}

main().catch(console.error);
