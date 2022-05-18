export const getUserByAddress = (address: string) => `query {
    userByAddress(address: "${address}") {
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
        donationsCount                    }
  }`;
