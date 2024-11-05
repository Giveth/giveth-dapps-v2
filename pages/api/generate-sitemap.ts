import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import config from '@/configuration';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { getMainCategorySlug } from '@/helpers/projects';
import { escapeXml } from '@/helpers/xml';
import { IProject } from '@/apollo/types/types';

const URL = config.FRONTEND_LINK;

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
