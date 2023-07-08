import { gql } from '@apollo/client';

export const REFRESH_USER_SCORES = gql`
	query ($address: String!) {
		refreshUserScores(address: $address) {
			id
			firstName
			lastName
			name
			email
			avatar
			walletAddress
			url
			location
			boostedProjectsCount
			likedProjectsCount
			donationsCount
			projectsCount
			passportScore
			passportStamps
		}
	}
`;
