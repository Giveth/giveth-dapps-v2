import { gql } from '@apollo/client'

export const GET_USER_BY_ADDRESS = gql`
  query UserByAddress($address: String!) {
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
    }
  }
`
