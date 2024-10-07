// pages/sitemap.xml.js

// import { getSortedPostsData } from '../lib/posts';

const URL = 'https://acme.com';

function generateSiteMap(posts) {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs manually -->
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/portfolio</loc>
     </url>
      <url>
       <loc>${URL}/blog</loc>
     </url>
     ${posts
			.map(({ id }) => {
				return `
           <url>
               <loc>${`${URL}/blog/${id}`}</loc>
           </url>
         `;
			})
			.join('')}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
	// const posts = getSortedPostsData();

	const posts = [
		{
			id: '1',
			title: 'My First Blog Post',
			date: '2023-01-01',
			content: 'This is the content of my first blog post.',
		},
		{
			id: '2',
			title: 'My Second Blog Post',
			date: '2023-01-02',
			content: 'This is the content of my second blog post.',
		},
		// Add more blog posts here...
	];

	// Generate the XML sitemap with the blog data
	const sitemap = generateSiteMap(posts);

	res.setHeader('Content-Type', 'text/xml');
	// Send the XML to the browser
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
}

export default function SiteMap() {}
