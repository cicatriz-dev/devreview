import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "devreview-mcp",
  version: "1.0.0",
});

server.registerTool(
  "get_team_review_rules",
  {
    title: "Get Team Review Rules",
    description:
      "Retrieves active code review rules for a team. " +
      "Use when reviewing a PR to know the team's standards.",
    inputSchema: {
      team_id: z.string().uuid().describe("UUID of the team"),
    },
  },
  async ({ team_id }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({
          team_id,
          rules: [
            { category: "security", rule: "Nunca expor chaves de API em código-fonte", severity: "error" },
            { category: "style", rule: "Usar nomenclatura camelCase para variáveis", severity: "warning" },
            { category: "performance", rule: "Evitar renderizações desnecessárias", severity: "warning" },
          ],
          count: 3,
        }),
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
