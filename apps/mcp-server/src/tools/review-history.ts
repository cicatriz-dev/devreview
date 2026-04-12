import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';

export function registerReviewHistoryTools(server: McpServer) {
	server.registerTool(
		'log_review',
		{
			title: 'Log Code Review',
			description:
				'Records a completed code review in the review_history table. ' +
				'Call this exactly once at the end of every PR review so team metrics stay up to date.',
			inputSchema: {
				team_id: z.string().uuid().describe('UUID of the team (from the teams table)'),
				pr_url: z.string().url().describe('Full URL of the reviewed pull request'),
				pr_number: z.number().int().positive().describe('PR number (e.g., 123)'),
				repo: z
					.string()
					.min(1)
					.describe('Repository in owner/repo format (e.g., "myorg/myrepo")'),
				review_summary: z
					.string()
					.min(1)
					.describe('Short summary of the review (1-3 sentences, plain text)'),
				issues_found: z
					.number()
					.int()
					.min(0)
					.describe('Total number of issues reported in the review (0 if none)'),
			},
		},
		async ({ team_id, pr_url, pr_number, repo, review_summary, issues_found }) => {
			const { data, error } = await supabase
				.from('review_history')
				.insert({
					team_id,
					pr_url,
					pr_number,
					repo,
					review_summary,
					issues_found,
				})
				.select('id, reviewed_at')
				.single();

			if (error) {
				throw new Error(`Failed to log review history: ${error.message}`);
			}

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({
							logged: true,
							id: data.id,
							reviewed_at: data.reviewed_at,
						}),
					},
				],
			};
		},
	);
}
