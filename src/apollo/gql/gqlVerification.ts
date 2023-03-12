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

export const GET_CURRENT_PROJECT_VERIFICATION_FORM = `
query getCurrentProjectVerificationForm($projectId: Float!){
    getCurrentProjectVerificationForm(projectId: $projectId) {
             id
             isTermAndConditionsAccepted
			 email
             emailConfirmationToken
             emailConfirmationSent
             emailConfirmationSentAt
             emailConfirmedAt
             emailConfirmed
             projectRegistry {
               organizationDescription
               isNonProfitOrganization
               organizationCountry
               organizationWebsite
             }
             projectContacts {
				name
				url
			}
             milestones {
               mission
               foundationDate
               achievedMilestones
               achievedMilestonesProofs
             }
             managingFunds {
               description
               relatedAddresses {
                 address
                 networkId
                 title
               }
             }
             user {
               id
               walletAddress
             }
             project {
               id
               slug
             }
             status
			 lastStep
             }
     }
`;

export const FETCH_PROJECT_BY_SLUG = `
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
			image
			slug
			description
			verified
			walletAddress
			totalProjectUpdates
			totalDonations
			creationDate
			reaction {
				id
				userId
			}
			totalReactions
			categories {
				name
			}
			adminUser {
				id
				name
				walletAddress
			}
			status {
				id
				name
			}
			organization {
				name
				label
				supportCustomTokens
			}
		}
	}
`;

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
