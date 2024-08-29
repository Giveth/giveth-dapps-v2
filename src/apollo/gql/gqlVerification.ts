import { gql } from '@apollo/client';

const gqlRes = `{
	id
	isTermAndConditionsAccepted
	email
	emailConfirmationToken
	emailConfirmationSent
	emailConfirmationSentAt
	emailConfirmedAt
	emailConfirmed
	emailConfirmationTokenExpiredAt
	projectRegistry {
		organizationDescription
		isNonProfitOrganization
		organizationCountry
		organizationWebsite
		organizationName
		attachments
	}
	personalInfo {
		email
		walletAddress
		fullName
	}
	projectContacts {
		name
		url
	}
	socialProfiles {
		socialNetworkId
		name
		socialNetwork
		isVerified
		id
	}
	milestones {
		mission
		foundationDate
		achievedMilestones
		achievedMilestonesProofs
		problem
		plans
		impact
	}
	managingFunds {
		description
		relatedAddresses {
			address
			networkId
			chainType
			title
		}
	}
	user {
		id
		walletAddress
		firstName
		lastName
		email
	}
	project {
		id
		slug
		title
	}
	status
	lastStep
}`;

export const CREATE_PROJECT_VERIFICATION = gql`
	mutation createProjectVerificationForm($slug: String!) {
		createProjectVerificationForm(slug: $slug) 
		${gqlRes}

	}
`;

export const FETCH_PROJECT_VERIFICATION = gql`
	query getCurrentProjectVerificationForm($slug: String!) {
		getCurrentProjectVerificationForm(slug: $slug)
		${gqlRes}
	}
`;

export const UPDATE_PROJECT_VERIFICATION = gql`
	mutation updateProjectVerificationForm(
		$projectVerificationUpdateInput: ProjectVerificationUpdateInput!
	) {
		updateProjectVerificationForm(
			projectVerificationUpdateInput: $projectVerificationUpdateInput
		)
		${gqlRes}
	}
`;

export const SEND_EMAIL_VERIFICATION = gql`
	mutation projectVerificationSendEmailConfirmation(
		$projectVerificationFormId: Float!
	) {
		projectVerificationSendEmailConfirmation(
			projectVerificationFormId: $projectVerificationFormId
		) 
		${gqlRes}
	}
`;

export const SEND_EMAIL_VERIFICATION_TOKEN = gql`
	mutation projectVerificationConfirmEmail($emailConfirmationToken: String!) {
		projectVerificationConfirmEmail(
			emailConfirmationToken: $emailConfirmationToken
		)
		${gqlRes}
	}
`;

export const SEND_NEW_SOCIAL_MEDIA = gql`
	mutation addNewSocialProfile(
		$projectVerificationId: Int!
		$socialNetwork: String!
	) {
		addNewSocialProfile(
			projectVerificationId: $projectVerificationId
			socialNetwork: $socialNetwork
		)
	}
`;

export const REMOVE_SOCIAL_MEDIA = gql`
	mutation removeSocialProfile($socialProfileId: Int!) {
		removeSocialProfile(socialProfileId: $socialProfileId)
	}
`;

export const FETCH_ALLOWED_COUNTRIES = gql`
	query {
		getAllowedCountries {
			name
			code
		}
	}
`;
