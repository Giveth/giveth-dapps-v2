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

const URL = config.FRONTEND_LINK;

function generateSiteMap() {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     	<!-- Add the static URLs manually -->
     	<url>
      	<loc>${URL}</loc>
			  <title>${homeMetatags.title}</title>
      	<description>${homeMetatags.desc}</description>
     	</url>
     	<url>
      	<loc>${URL}/projects/all</loc>
			  <title>${projectsMetatags.title}</title>
      	<description>${projectsMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/giveconomy</loc>
			  <title>${giveconomyMetatags.title}</title>
      	<description>${giveconomyMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/givpower</loc>
			  <title>${givpowerMetatags.title}</title>
      	<description>${givpowerMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/givfarm</loc>
			  <title>${givfarmMetatags.title}</title>
      	<description>${givfarmMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/about</loc>
			  <title>${aboutMetatags.title}</title>
      	<description>${aboutMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/about</loc>
			  <title>${aboutMetatags.title}</title>
      	<description>${aboutMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/givstream</loc>
			  <title>${givstreamMetatags.title}</title>
      	<description>${givstreamMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/givbacks</loc>
			  <title>${givbacksMetatags.title}</title>
      	<description>${givbacksMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/support</loc>
			  <title>${supportMetatags.title}</title>
      	<description>${supportMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/partnerships</loc>
			  <title>${partnershipMetatags.title}</title>
      	<description>${partnershipMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/join</loc>
			  <title>${joinMetatags.title}</title>
      	<description>${joinMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/faq</loc>
			  <title>${faqMetatags.title}</title>
      	<description>${faqMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/create</loc>
			  <title>${createProjectMetatags.title}</title>
      	<description>${createProjectMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/claim</loc>
			  <title>${claimMetatags.title}</title>
      	<description>${claimMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/nft</loc>
			  <title>${nftMetatags.title}</title>
      	<description>${nftMetatags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/onboarding</loc>
			  <title>${generalOnboardingMetaTags.title}</title>
      	<description>${generalOnboardingMetaTags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/onboarding/projects</loc>
			  <title>${projectOnboardingMetaTags.title}</title>
      	<description>${projectOnboardingMetaTags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/donors/projects</loc>
			  <title>${donorOnboardingMetaTags.title}</title>
      	<description>${donorOnboardingMetaTags.desc}</description>
     	</url>
    	<url>
      	<loc>${URL}/donors/giveconomy</loc>
			  <title>${giveconomyOnboardingMetaTags.title}</title>
      	<description>${giveconomyOnboardingMetaTags.desc}</description>
     	</url>
			<url>
      	<loc>${URL}/projects/projects-sitemap.xml</loc>
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
