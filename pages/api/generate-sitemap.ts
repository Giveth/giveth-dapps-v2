import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@sentry/types';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { getMainCategorySlug } from '@/helpers/projects';
import { escapeXml } from '@/helpers/xml';
import { IProject, IQFRound } from '@/apollo/types/types';
import { FETCH_QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';
import { FETCH_ALL_USERS_BASIC_DATA } from '@/apollo/gql/gqlUser';
import { addressToUserView } from '@/lib/routeCreators';
import { shortenAddress } from '@/lib/helpers';

export const config = {
	maxDuration: 300,
	dynamic: 'force-dynamic',
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
	if (req.method !== 'GET') {
		return res.status(405).end();
	}

	if (authHeader !== `Bearer ${process.env.SITEMAP_CRON_SECRET}`) {
		return res.status(405).end();
	}

	try {
		/* PROJECT SITEMAP */

		// Get first project data
		const projectData = await getProjects(0);

		const projects: IProject[] = projectData.allProjects?.projects || [];

		if (projectData.allProjects.totalCount > 50) {
			for (let i = 50; i < projectData.allProjects.totalCount; i += 50) {
				const fetchNewProjectData = await getProjects(i);
				projects.push(...fetchNewProjectData.allProjects?.projects);
			}
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

		// Get first project data
		const roundsData = await getArchivedRounds();

		// // Generate XML content
		const sitemapRoundsContent = generateQFRoundsSiteMap(roundsData);

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

		// Fetch user data
		const users = await getUsers(0);
		const userTotalCount = users.totalCount;
		const userEntries = [...users.users];

		// Fetch remaining users if necessary
		if (userTotalCount > 50) {
			for (let i = 50; i < userTotalCount; i += 50) {
				const nextBatch = await getUsers(i);
				userEntries.push(...nextBatch.users);
			}
		}

		// Generate XML content for users
		const sitemapUsersContent = generateUsersSiteMap(userEntries);

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

// Fetch project data from GraphQL
async function getProjects(skip: number) {
	const apolloClient = initializeApollo();
	const slug = 'all';
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;

	const { data } = await apolloClient.query({
		query: FETCH_ALL_PROJECTS,
		variables: {
			...variables,
			limit: 50,
			skip: skip,
			sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
			mainCategory: getMainCategorySlug({ slug }),
			notifyOnNetworkStatusChange,
		},
		fetchPolicy: 'no-cache',
	});

	return data;
}

// Fetch qf archived rounds data from GraphQL
async function getArchivedRounds() {
	const apolloClient = initializeApollo();

	const { data } = await apolloClient.query({
		query: FETCH_QF_ROUNDS_QUERY,
	});

	return data.qfRounds || [];
}

// Fetch user data from GraphQL
async function getUsers(skip: number) {
	const apolloClient = initializeApollo();

	const { data } = await apolloClient.query({
		query: FETCH_ALL_USERS_BASIC_DATA, // Query for user data
		variables: {
			limit: 50,
			skip: skip,
		},
		fetchPolicy: 'no-cache',
	});

	return data.allUsersBasicData || { users: [], totalCount: 0 };
}
