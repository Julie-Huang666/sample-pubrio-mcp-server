import { McpServer, StdioServerTransport } from "@modelcontextprotocol/server";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.PUBRIO_API_KEY) {
  console.error(
    "PUBRIO_API_KEY is missing."
  );
  process.exit(1);
}

// Initialize the MCP Server
const server = new McpServer({
  name: "Pubrio-MCP-Server-Sample",
  version: "1.0.0"
});

// Register the search_companies tool for Company Search endpoint, retrieving up to 10 company profiles per request.
server.registerTool(
    "search_companies",
    {
      description: "Search the Pubrio database for B2B company profiles using company name, country location, and business/industry keywords. Use for company discovery or company lookup requests, and returns matching company profiles. Max 10 company profiles will be returned per request.",
      inputSchema: z.object({
        company_name: z.string().optional().describe("A specific company name to search for (e.g., 'Pubrio'). Partial company name matching is supported."),
        locations: z.array(z.string()).optional().describe("List of 2-letter ISO country codes, e.g., ['US', 'CA']"),
        keywords: z.array(z.string()).optional().describe("Business, industry, product, or specialty keywords used to find relevant companies (e.g., 'fintech', 'AI', 'ecommerce', 'supply chain', 'logistics'). Multiple keywords can be provided separated by commas.")
      })
    },
    async ({ company_name, locations, keywords }) => {
      try {
        const response = await axios.post(
          "https://api.pubrio.com/companies/search",
          {
            company_name: company_name,
            locations: locations,
            keywords: keywords,
            per_page: 10,
            page: 1
          },
          {
            headers: {
              "Content-Type": "application/json",
              "pubrio-api-key": process.env.PUBRIO_API_KEY
            },
            timeout: 20000
          }
        );
        return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
          };
        } catch (error) {
          console.error("Pubrio Company Search Failure:", error.response?.data || error.message);
          return {
            content: [{ type: "text", text: `Error fetching companies: ${error.message}` }],
            isError: true
          };
        }
      }
    );

  // Register the search_people tool for People Search endpoint, retrieving up to 10 people profiles per request.
  server.registerTool(
    "search_people",
    {
      description: "Search the Pubrio database for B2B professional profiles using person name, job title, and geographic location. Use for people discovery or professional lookup requests, and returns matching professional profiles. Max 10 people profiles will be returned per request.",
      inputSchema: z.object({
        people_name: z.string().optional().describe("A specific person's name to search for (e.g., 'king'). Partial name matching is supported."),
        people_titles: z.array(z.string()).optional().describe("List of professional job titles to find relevant profiles, e.g., ['sales manager', 'marketing manager']"),
        people_locations: z.array(z.string()).optional().describe("List of 2-letter ISO country codes where the person lives, e.g., ['US', 'CA']")
      })
    },
    async ({ people_name, people_titles, people_locations }) => {
      try {
        const response = await axios.post(
          "https://api.pubrio.com/people/search",
          {
            people_name: people_name,
            people_titles: people_titles,
            people_locations: people_locations,
            per_page: 10,
            page: 1
          },
          {
            headers: {
              "Content-Type": "application/json",
              "pubrio-api-key": process.env.PUBRIO_API_KEY
            },
            timeout: 20000
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error) {
        console.error("Pubrio People Search Failure:", error.response?.data || error.message);
        return {
          content: [{ type: "text", text: `Error fetching people: ${error.message}` }],
          isError: true
        };
      }
    }
  );


async function bootstrap() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Sample Pubrio MCP Server is officially running");
  }
  
  bootstrap().catch((error) => {
    console.error("MCP Server startup error detected:", error);
  });

