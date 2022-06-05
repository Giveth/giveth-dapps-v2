export const GET_CURRENT_PROJECT_VERIFICATION_FORM = `
query getCurrentProjectVerificationForm($projectId: Float!){
    getCurrentProjectVerificationForm(projectId: $projectId) {
             id
             isTermAndConditionsAccepted
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
               youtube
               instagram
               linkedin
               facebook
               instagram
               twitter
             }
             milestones {
               mission
               foundationDate
               achievedMilestones
               achievedMilestonesProof
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
			traceCampaignId
			walletAddress
			totalProjectUpdates
			totalDonations
			totalTraceDonations
			creationDate
			reaction {
				id
				userId
			}
			totalReactions
			traceCampaignId
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
