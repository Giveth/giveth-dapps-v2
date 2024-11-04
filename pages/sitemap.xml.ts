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
	createProjectMetatags,
	claimMetatags,
	nftMetatags,
	generalOnboardingMetaTags,
	projectOnboardingMetaTags,
	donorOnboardingMetaTags,
	giveconomyOnboardingMetaTags,
} from '@/content/metatags';
import { escapeXml } from '@/helpers/xml';

const URL = config.FRONTEND_LINK;

function generateSiteMap() {
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
      	<loc>${URL}/create</loc>
			  <title>${escapeXml(createProjectMetatags.title)}</title>
      	<description>${escapeXml(createProjectMetatags.desc)}</description>
     	</url>
    	<url>
      	<loc>${URL}/claim</loc>
			  <title>${escapeXml(claimMetatags.title)}</title>
      	<description>${escapeXml(claimMetatags.desc)}</description>
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
      	<loc>${URL}/sitemap/projects-sitemap.xml</loc>
      	<lastmod>${new Date().toISOString()}</lastmod>
     	</url>
	 </urlset>
 `;
}

// Generate the XML sitemap with the blog data
export async function getServerSideProps({ res }: GetServerSidePropsContext) {
	const sitemap = generateSiteMap();

	// Send the XML to the browser
	res.setHeader('Content-Type', 'text/xml');
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
}

export default function SiteMap() {}
