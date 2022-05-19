export const getUserByAddress = `query UserByAddress($address: String!) {
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
    }
}`;
