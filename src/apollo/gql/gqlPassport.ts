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
			activeQFMBDScore
		}
	}
`;

export const SCORE_ACTIVE_QF_DONOR_ADDRESS = gql`
	query ($address: String!) {
		scoreUserAddress(address: $address) {
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
			activeQFMBDScore
		}
	}
`;
