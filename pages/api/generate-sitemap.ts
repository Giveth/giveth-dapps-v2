import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@sentry/types';
import { escapeXml } from '@/helpers/xml';
import { IProject, IQFRound } from '@/apollo/types/types';
import { addressToUserView } from '@/lib/routeCreators';
import { shortenAddress } from '@/lib/helpers';

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '10mb',
		},
	},
};

const URL = process.env.NEXT_PUBLIC_FRONTEND_LINK;

function generateProjectsSiteMap(projects: IProject[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${projects
			.map(
				({
					slug,
					title = '',
					descriptionSummary = '',
				}: {
					slug: string;
					title?: string;
					descriptionSummary?: string;
				}) => {
					return `
              <url>
                <loc>${`${URL}/project/${slug}`}</loc>
                <title>${escapeXml(title)}</title>
                <description>${escapeXml(descriptionSummary)}</description>
              </url>
            `;
				},
			)
			.join('')}
    </urlset>`;
}

function generateQFRoundsSiteMap(rounds: IQFRound[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${rounds
			.map(
				({
					slug,
					name = '',
					description = '',
				}: {
					slug: string;
					name?: string;
					description?: string;
				}) => {
					// Default to empty strings if any field is null
					const safeSlug = slug || '';
					const safeName = name || '';
					const safeDescription = description || '';

					return `
              <url>
                <loc>${`${URL}/qf-archive/${safeSlug}`}</loc>
                <title>${escapeXml(safeName)}</title>
                <description>${escapeXml(safeDescription)}</description>
              </url>
            `;
				},
			)
			.join('')}
    </urlset>`;
}

// Function to generate the XML sitemap for users
function generateUsersSiteMap(users: User[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${users
			.filter(({ walletAddress }) => walletAddress !== null)
			.map(({ name = '', walletAddress = '' }) => {
				const userUrl =
					addressToUserView(walletAddress.toLowerCase()) || '';

				const safeName = escapeXml(
					name ||
						shortenAddress(walletAddress.toLowerCase()) ||
						'\u200C',
				);

				return `
              <url>
								<loc>${`${URL}${userUrl}`}</loc>
                <title>${safeName}</title>
              </url>
            `;
			})
			.join('')}
    </urlset>`;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const authHeader = req.headers['authorization'];

	// Only allow GET requests
	if (req.method !== 'POST') {
		return res.status(405).end();
	}

	if (authHeader !== `Bearer ${process.env.SITEMAP_CRON_SECRET}`) {
		return res.status(405).end();
	}

	try {
		// Parse the POST data from the request body
		const { projects, users, qfRounds } = req.body;

		/* PROJECT SITEMAP */

		if (!projects || !Array.isArray(projects)) {
			return res
				.status(400)
				.json({ message: 'Invalid request payload projects' });
		}

		// Generate XML content
		const sitemapContent = generateProjectsSiteMap(projects);

		// Define the file path
		const filePath = path.join(
			process.cwd(),
			'public',
			'sitemap',
			'projects-sitemap.xml',
		);

		// Write the XML content to the file
		await fs.promises.writeFile(filePath, sitemapContent, 'utf-8');

		/* QF ARCHIVED ROUNDS SITEMAP */

		if (!qfRounds || !Array.isArray(qfRounds)) {
			return res
				.status(400)
				.json({ message: 'Invalid request payload qfRounds' });
		}

		// // Generate XML content
		const sitemapRoundsContent = generateQFRoundsSiteMap(qfRounds);

		// Define the file path
		const filePathQFRounds = path.join(
			process.cwd(),
			'public',
			'sitemap',
			'qf-sitemap.xml',
		);

		// // Write the XML content to the file
		await fs.promises.writeFile(
			filePathQFRounds,
			sitemapRoundsContent,
			'utf-8',
		);

		/* USER SITEMAP */

		if (!users || !Array.isArray(users)) {
			return res
				.status(400)
				.json({ message: 'Invalid request payload users' });
		}

		// Generate XML content for users
		const sitemapUsersContent = generateUsersSiteMap(users);

		// Define the file path for users sitemap
		const filePathUsers = path.join(
			process.cwd(),
			'public',
			'sitemap',
			'users-sitemap.xml',
		);

		// Write the XML content to the file
		await fs.promises.writeFile(
			filePathUsers,
			sitemapUsersContent,
			'utf-8',
		);

		// Respond with success
		res.status(200).json({
			message: 'Sitemap generated and saved successfully',
		});
	} catch (error) {
		console.error('Error generating or saving sitemap:', error);
		res.status(500).json({ error: 'Failed to generate sitemap' });
	}
}
