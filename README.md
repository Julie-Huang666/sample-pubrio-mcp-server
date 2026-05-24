# Sample Pubrio MCP Server

A sample [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that connects to the [Pubrio](https://pubrio.com/) API for B2B company and people search.

## Tools

- **search_companies** — Search company profiles by name, location, and industry keywords
- **search_people** — Search professional profiles by name, job title, and location

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A Pubrio API key

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Julie-Huang666/sample-pubrio-mcp-server.git
   cd sample-pubrio-mcp-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

   Add your Pubrio API key to `.env`:

   ```env
   PUBRIO_API_KEY=your_api_key_here
   ```

4. Run the server:

   ```bash
   npm start
   ```

## Cursor Configuration

Add this to your Cursor MCP settings (`~/.cursor/mcp.json` or via **Settings → MCP**):

```json
{
  "mcpServers": {
    "pubrio": {
      "command": "node",
      "args": ["/absolute/path/to/sample-pubrio-mcp-server/server.js"],
      "env": {
        "PUBRIO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Replace `/absolute/path/to/sample-pubrio-mcp-server/server.js` with the actual path on your machine.

## License

ISC
