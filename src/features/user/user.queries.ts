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
    }
}`;
