import { GetServerSidePropsContext } from 'next';

import config from '@/configuration';

const URL = config.FRONTEND_LINK;

function generateSiteMap() {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     	<!-- Add the static URLs manually -->
     	<url>
      	<loc>${URL}</loc>
			  <title>Giveth: Future of Giving with Zero-Fee Crypto Donation</title>
      	<description>Get rewarded for crypto donations to for-good projects with zero added fees and accepting crypto donations. Donate crypto directly to thousands of nonprofits &amp; charities!</description>
     	</url>
     	<url>
      	<loc>${URL}/projects/all</loc>
			  <title>Give directly to for-good projects with crypto &amp; zero fees</title>
      	<description>Support for-good projects, nonprofits &amp; charities with crypto donations. Give directly with zero added fees. Get rewarded when you donate to GIVbacks eligible projects!</description>
     	</url>
    	<url>
      	<loc>${URL}/giveconomy</loc>
			  <title>GIVeconomy: Empowering our collective to build the Future of Giving</title>
      	<description>Giveth is a donor owned and governed economy. With GIVbacks, we reward donors to GIVbacks eligible projects on Giveth with GIV.</description>
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
