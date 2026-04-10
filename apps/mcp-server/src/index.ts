import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
	name: 'devreview-mcp',
	version: '1.0.0',
});

// Tool mockada — dados fixos por enquanto
server.registerTool(
	'get_team_review_rules',
	{
		title: 'Get Team Review Rules',
		description:
			'Retrieves active code review rules for a team. ' +
			'Use this when reviewing a PR to know what standards the team enforces. ' +
			'Return rules grouped by category and severity.',
		inputSchema: {
			team_id: z.string().uuid().describe('UUID of the team (from the teams table)'),
			category: z
				.enum(['style', 'architecture', 'security', 'performance'])
				.optional()
				.describe('Filter by category. Omit to get all categories.'),
			severity: z
				.enum(['error', 'warning', 'info'])
				.optional()
				.describe(
					'Filter by severity. "error" = must fix, "warning" = should fix, "info" = good to have. Omit to get all severities.',
				),
			limit: z
				.number()
				.int()
				.min(1)
				.max(50)
				.default(20)
				.describe('Max rules to returnes (1-50, default 20)'),
		},
	},
	async ({ team_id, category, severity, limit }) => {
		const allRules = [
			{
				category: 'security',
				rule: 'Nunca expor chaves de API em código-fonte',
				severity: 'error',
			},
			{
				category: 'style',
				rule: 'Usar nomenclatura camelCase para variáveis',
				severity: 'warning',
			},
			{ category: 'performance', rule: 'Evitar renderizações desnecessárias', severity: 'warning' },
			{
				category: 'architecture',
				rule: 'Toda chamada de API deve passar por um service',
				severity: 'error',
			},
		];

		const filteredRules = allRules
			.filter((rule) => !category || rule.category === category)
			.filter((rule) => !severity || rule.severity === severity)
			.slice(0, limit);

		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						team_id,
						rules: filteredRules,
						count: filteredRules.length,
					}),
				},
			],
		};
	},
);

// Resource: schema do banco (dado estático)
server.registerResource(
	'review-schema',
	'review://schema',
	{
		description: 'Database schema for the DevReview application',
		mimeType: 'application/json',
	},
	async () => ({
		contents: [
			{
				uri: 'review://schema',
				mimeType: 'application/json',
				text: JSON.stringify({
					tables: ['teams', 'review_rules', 'review_history', 'adrs'],
					review_rules_columns: ['id', 'team_id', 'category', 'rule', 'severity', 'active'],
				}),
			},
		],
	}),
);

// Prompt: template de code review
server.registerPrompt(
	'code-review',
	{
		description: 'Template for reviewing a PR using team rules',
		argsSchema: {
			pr_number: z.string().describe('Number of the PR to review'),
			team_id: z.string().describe('UUID of the team'),
		},
	},
	({ pr_number, team_id }) => ({
		messages: [
			{
				role: 'user',
				content: {
					type: 'text',
					text: `Review PR #${pr_number} using the coding standards of team ${team_id}. Check for violations of the team's review rules and relevant ADRs.`,
				},
			},
		],
	}),
);

const transport = new StdioServerTransport();
await server.connect(transport);
