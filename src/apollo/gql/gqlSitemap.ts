import { gql } from '@apollo/client';

// Fetch last sitemap URLs
export const FETCH_LAST_SITEMAP_URL = gql`
	query FetchLastSitemapUrl {
		getLastSitemap {
			id
			sitemap_urls {
				sitemapProjectsURL
				sitemapUsersURL
				sitemapQFRoundsURL
				sitemapCausesURL
			}
		}
	}
`;
