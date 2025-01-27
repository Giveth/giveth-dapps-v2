import { NextRouter } from 'next/router';
import {
	ECampaignFilterField,
	ECampaignType,
	EProjectsFilter,
	ICampaign,
} from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';

export function campaignLinkGenerator(campaign: ICampaign) {
	if (
		campaign.type === ECampaignType.WITHOUT_PROJECTS ||
		campaign.landingLink
	)
		return campaign.landingLink;

	let params = new URLSearchParams('');
	if (campaign.type === ECampaignType.MANUALLY_SELECTED)
		params.append('campaign', campaign.slug);

	if (campaign.type === ECampaignType.SORT_FIELD)
		params.append('sort', campaign.sortingField);

	if (campaign.type === ECampaignType.FILTER_FIELDS) {
		campaign.filterFields.forEach(filter => {
			switch (filter) {
				case ECampaignFilterField.Verified:
					params.append('filter', EProjectsFilter.VERIFIED);
					break;
				case ECampaignFilterField.IsGivbackEligible:
					params.append(
						'filter',
						EProjectsFilter.IS_GIVBACK_ELIGIBLE,
					);
					break;
				case ECampaignFilterField.Endaoment:
					params.append('filter', EProjectsFilter.Endaoment);
					break;
				case ECampaignFilterField.BoostedWithGivPower:
					params.append(
						'filter',
						EProjectsFilter.BOOSTED_WITH_GIVPOWER,
					);
					break;
				case ECampaignFilterField.AcceptFundOnMainnet:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_MAINNET,
					);
					break;
				case ECampaignFilterField.AcceptFundOnGnosis:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_GNOSIS,
					);
					break;
				case ECampaignFilterField.AcceptFundOnPolygon:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_POLYGON,
					);
					break;
				case ECampaignFilterField.AcceptFundOnCelo:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_CELO,
					);
					break;
				case ECampaignFilterField.AcceptFundOnArbitrum:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_ARBITRUM,
					);
					break;
				case ECampaignFilterField.AcceptFundOnBase:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_BASE,
					);
					break;
				case ECampaignFilterField.AcceptFundOnOptimism:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_OPTIMISM,
					);
					break;
				case ECampaignFilterField.AcceptFundOnSolana:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_SOLANA,
					);
					break;
				case ECampaignFilterField.AcceptFundOnZKEVM:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_ZKEVM,
					);
					break;
				case ECampaignFilterField.AcceptFundOnStellar:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_STELLAR,
					);
					break;
				default:
					break;
			}
		});
	}

	const query = params.toString();
	return `${Routes.AllProjects}${query ? `?${query}` : ''}`;
}

export function removeQueryParam(
	asPath: string,
	params: string[],
	fullURl: boolean = false,
) {
	const [url, oldQuery] = asPath.split('?');
	const urlParams = new URLSearchParams(oldQuery);
	params.forEach(param => {
		urlParams.delete(param);
	});
	const newQuery = urlParams.toString();
	if (fullURl) {
		return newQuery ? `${url}?${newQuery}` : url;
	}
	return newQuery ? `?${newQuery}` : '';
}

export function removeQueryParamAndRedirect(
	router: NextRouter,
	params: string[],
) {
	const newPath = removeQueryParam(router.asPath, params, true); // Get full URL
	if (router.isReady) router.replace(newPath, undefined, { shallow: true });
}

export const convertIPFSToHTTPS = (url: string) => {
	return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
};

export const getSocialMediaHandle = (
	socialMediaUrl: string,
	socialMediaType: string,
) => {
	let cleanedUrl = socialMediaUrl
		.replace(/^https?:\/\//, '')
		.replace('www.', '');

	// Remove trailing slash if present
	if (cleanedUrl.endsWith('/')) {
		cleanedUrl = cleanedUrl.slice(0, -1);
	}

	// Match against different social media types using custom regex
	const lowerCaseType = socialMediaType.toLowerCase();

	switch (lowerCaseType) {
		case 'github':
			return extractUsernameFromPattern(
				cleanedUrl,
				/github\.com\/([^\/]+)/,
				false,
			);
		case 'x': // Former Twitter
			return extractUsernameFromPattern(
				cleanedUrl,
				/x\.com\/([^\/]+)/,
				false,
			);
		case 'facebook':
			return extractUsernameFromPattern(
				cleanedUrl,
				/facebook\.com\/([^\/]+)/,
				false,
			);
		case 'instagram':
			return extractUsernameFromPattern(
				cleanedUrl,
				/instagram\.com\/([^\/]+)/,
				false,
			);
		case 'linkedin':
			return extractUsernameFromPattern(
				cleanedUrl,
				/linkedin\.com\/(?:in|company)\/([^\/]+)/,
				false,
			);
		case 'youtube':
			return extractUsernameFromPattern(
				cleanedUrl,
				/youtube\.com\/(?:c\/|@)([^\/]+)/,
				true,
			);
		case 'reddit':
			return extractUsernameFromPattern(
				cleanedUrl,
				/reddit\.com\/r\/([^\/]+)/,
				true,
			);
		case 'telegram':
			return extractUsernameFromPattern(
				cleanedUrl,
				/t\.me\/([^\/]+)/,
				false,
			);
		case 'discord':
			return extractUsernameFromPattern(
				cleanedUrl,
				/discord\.(?:gg|com\/channels|com)\/([^\/]+)/,
				true,
			);
		case 'farcaster':
			const isWarpcastUser = cleanedUrl.includes('warpcast');
			const isWarpcastChannel =
				cleanedUrl.includes('channel') && isWarpcastUser;
			if (isWarpcastChannel) {
				return extractUsernameFromPattern(
					cleanedUrl,
					/warpcast\.com\/~\/channel\/([^\/]+)/,
					true,
				);
			} else if (isWarpcastUser) {
				return extractUsernameFromPattern(
					cleanedUrl,
					/warpcast\.com\/([^\/]+)/,
					false,
				);
			} else {
				return extractUsernameFromPattern(
					cleanedUrl,
					/farcaster\.xyz\/([^\/]+)/,
					false,
				);
			}
		case 'lens':
			// Assuming Lens uses a pattern like 'lens.xyz/username'
			return extractUsernameFromPattern(
				cleanedUrl,
				/lens\.xyz\/([^\/]+)/,
				false,
			);
		case 'website':
		default:
			return cleanedUrl; // Return cleaned URL for generic websites or unsupported social media
	}
};

// Function to extract username from URL based on the regex pattern
export const extractUsernameFromPattern = (
	url: string,
	regex: RegExp,
	isChannel: boolean,
): string => {
	const match = url.match(regex);
	if (match && match[1]) {
		console.log('match', match[1]);
		return isChannel ? `/${match[1]}` : `@${match[1]}`; // Return '@username' for users and '/channel' for channels
	}
	return url; // Fallback to original URL if no match is found
};

/**
 * Ensures that a given URL uses the https:// protocol.
 * If the URL starts with http://, it will be replaced with https://.
 * If the URL does not start with any protocol, https:// will be added.
 * If the URL already starts with https://, it will remain unchanged.
 *
 * @param {string} url - The URL to be checked and possibly modified.
 * @returns {string} - The modified URL with https://.
 */
export function ensureHttps(url: string): string {
	if (!url.startsWith('https://')) {
		if (url.startsWith('http://')) {
			// Replace http:// with https://
			url = url.replace('http://', 'https://');
		} else {
			// Add https:// if no protocol is present
			url = 'https://' + url;
		}
	}
	return url;
}
