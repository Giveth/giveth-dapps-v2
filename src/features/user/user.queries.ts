export const GET_USER_BY_ADDRESS = `query UserByAddress($address: String!) {
    userByAddress(address: $address) {
        id
        firstName
        lastName
        name
        email
        avatar
        walletAddress
        url
        location
        totalDonated
        totalReceived
        likedProjectsCount
        projectsCount
        donationsCount
        isSignedIn
        passportScore
	    passportStamps
	    boostedProjectsCount
        chainvineId
		isReferrer
		wasReferred
    }
}`;

export const REGISTER_ON_CHAINVINE = `
  mutation {
    registerOnChainvine {
        id
        firstName
        email
        walletAddress
        chainvineId
    }
  }
`;

export const REGISTER_CLICK_ON_REFERRAL = `
    mutation ($referrerId: String!, $walletAddress: String!) {
        registerClickEvent(referrerId: $referrerId, walletAddress: $walletAddress) {
            id
            firstName
            email
            walletAddress
            chainvineId
            isReferrer
            wasReferred
        }
    }
`;
