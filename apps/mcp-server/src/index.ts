import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerReviewRulesTools } from './tools/review-rules.js';
import { registerAdrTools } from './tools/adrs.js';
import { registerMetricsTools } from './tools/metrics.js';

const server = new McpServer({
	name: 'devreview-mcp',
	version: '1.0.0',
});

registerReviewRulesTools(server);
registerAdrTools(server);
registerMetricsTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
