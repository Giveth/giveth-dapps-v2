import { GetServerSidePropsContext } from 'next';

import config from '@/configuration';
import {
	homeMetatags,
	projectsMetatags,
	giveconomyMetatags,
	givpowerMetatags,
	givfarmMetatags,
	aboutMetatags,
	givstreamMetatags,
	givbacksMetatags,
	supportMetatags,
	partnershipMetatags,
	joinMetatags,
	faqMetatags,
	nftMetatags,
	generalOnboardingMetaTags,
	projectOnboardingMetaTags,
	donorOnboardingMetaTags,
	giveconomyOnboardingMetaTags,
	archivedQFRoundsMetaTags,
} from '@/content/metatags';
import { escapeXml } from '@/helpers/xml';
import { FETCH_LAST_SITEMAP_URL } from '@/apollo/gql/gqlSitemap';
import { initializeApollo } from '@/apollo/apolloClient';

const URL = config.FRONTEND_LINK;

async function generateSiteMap() {
	const latestSitemap = await fetchLatestSitemap();
	let sitemapUrls = '';

	if (latestSitemap) {
		sitemapUrls = `
			<url>
				<loc>${latestSitemap.sitemapProjectsURL}</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
			</url>
			<url>
				<loc>${latestSitemap.sitemapUsersURL}</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
			</url>
			<url>
				<loc>${latestSitemap.sitemapQFRoundsURL}</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
			</url>
		`;
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     	<url>
      	<loc>${URL}</loc>
			  <title>${escapeXml(homeMetatags.title)}</title>
      	<description>${escapeXml(homeMetatags.desc)}</description>
     	</url>
     	<url>
      	<loc>${URL}/projects/all</loc>
			  <title>${escapeXml(projectsMetatags.title)}</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
     	<url>
      	<loc>${URL}/projects/art-and-culture</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Art & Culture</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/community</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Community</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/economic-and-infrastructure</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Economic & Infrastructure</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/education</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Education</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/environment-and-energy</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Environment & Energy</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/equality</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Equality</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/finance</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Finance</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/health-and-wellness</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Health & Wellness</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/nature</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Nature</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/ngo</loc>
			  <title>${escapeXml(projectsMetatags.title)} - NGO</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/other</loc>
			  <title>${escapeXml(projectsMetatags.title)} - Other</title>
      	<description>${escapeXml(projectsMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/giveconomy</loc>
			  <title>${escapeXml(giveconomyMetatags.title)}</title>
      	<description>${escapeXml(giveconomyMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/givpower</loc>
			  <title>${escapeXml(givpowerMetatags.title)}</title>
      	<description>${escapeXml(givpowerMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/givfarm</loc>
			  <title>${escapeXml(givfarmMetatags.title)}</title>
      	<description>${escapeXml(givfarmMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/about</loc>
			  <title>${escapeXml(aboutMetatags.title)}</title>
      	<description>${escapeXml(aboutMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/givstream</loc>
			  <title>${escapeXml(givstreamMetatags.title)}</title>
      	<description>${escapeXml(givstreamMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/givbacks</loc>
			  <title>${escapeXml(givbacksMetatags.title)}</title>
      	<description>${escapeXml(givbacksMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/support</loc>
			  <title>${escapeXml(supportMetatags.title)}</title>
      	<description>${escapeXml(supportMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/partnerships</loc>
			  <title>${escapeXml(partnershipMetatags.title)}</title>
      	<description>${escapeXml(partnershipMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/join</loc>
			  <title>${escapeXml(joinMetatags.title)}</title>
      	<description>${escapeXml(joinMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/faq</loc>
			  <title>${escapeXml(faqMetatags.title)}</title>
      	<description>${escapeXml(faqMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/nft</loc>
			  <title>${escapeXml(nftMetatags.title)}</title>
      	<description>${escapeXml(nftMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/onboarding</loc>
			  <title>${escapeXml(generalOnboardingMetaTags.title)}</title>
      	<description>${escapeXml(generalOnboardingMetaTags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/onboarding/projects</loc>
			  <title>${escapeXml(projectOnboardingMetaTags.title)}</title>
      	<description>${escapeXml(projectOnboardingMetaTags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/donors/projects</loc>
			  <title>${escapeXml(donorOnboardingMetaTags.title)}</title>
      	<description>${escapeXml(donorOnboardingMetaTags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/donors/giveconomy</loc>
			  <title>${escapeXml(giveconomyOnboardingMetaTags.title)}</title>
      	<description>${escapeXml(giveconomyOnboardingMetaTags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/qf-archive</loc>
			  <title>${escapeXml(archivedQFRoundsMetaTags.title)}</title>
      	<description>${escapeXml(archivedQFRoundsMetaTags.desc)}</description>
     	</url>
			${sitemapUrls}
	 </urlset>
 `;
}

// Generate the XML sitemap with the blog data
export async function getServerSideProps({ res }: GetServerSidePropsContext) {
	const sitemap = await generateSiteMap();

	// Send the XML to the browser
	res.setHeader('Content-Type', 'text/xml');
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
}

async function fetchLatestSitemap() {
	const apolloClient = initializeApollo();

	try {
		const { data } = await apolloClient.query({
			query: FETCH_LAST_SITEMAP_URL,
			fetchPolicy: 'no-cache',
		});

		return data?.getLastSitemap?.sitemap_urls || null;
	} catch (error) {
		console.error('Error fetching sitemap:', error);
		return null;
	}
}

export default function SiteMap() {}
