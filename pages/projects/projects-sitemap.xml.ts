import { GetServerSidePropsContext } from 'next';

import config from '@/configuration';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { initializeApollo } from '@/apollo/apolloClient';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { getMainCategorySlug } from '@/helpers/projects';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { IProject } from '@/apollo/types/types';

const URL = config.FRONTEND_LINK;

function generateSiteMap(projects: IProject[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     ${projects
			.map(({ slug }: { slug: string }) => {
				return `
           <url>
               <loc>${`${URL}/project/${slug}`}</loc>
           </url>
         `;
			})
			.join('')}
			<url>
       <loc>${URL}/project/projects-sitemap.xml</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
     </url>
   </urlset>
 `;
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	let projects: IProject[] = [];
	try {
		const apolloClient = initializeApollo();
		const sort = EProjectsSortBy.NEWEST;
		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			variables: {
				...variables,
				sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
				mainCategory: getMainCategorySlug({ slug: sort }),
				notifyOnNetworkStatusChange,
			},
			fetchPolicy: 'no-cache',
		});
		console.log({ data });
		const { projects: fetchedProjects } = data.allProjects;
		projects = fetchedProjects;
	} catch (error: any) {
		const statusCode = transformGraphQLErrorsToStatusCode(
			error?.graphQLErrors,
		);
		return {
			props: {
				errorStatus: statusCode,
			},
		};
	}

	// Generate the XML sitemap with the blog data
	const sitemap = generateSiteMap(projects);

	// Send the XML to the browser
	res.setHeader('Content-Type', 'text/xml');
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
}

export default function SiteMap() {}
