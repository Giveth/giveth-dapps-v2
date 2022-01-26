import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
  mutation DoLoginWallet(
    $walletAddress: String!
    $signature: String!
    $email: String
    $avatar: String
    $name: String
    $hostname: String!
    $networkId: Float!
  ) {
    loginWallet(
      walletAddress: $walletAddress
      signature: $signature
      email: $email
      avatar: $avatar
      name: $name
      hostname: $hostname
      networkId: $networkId
    ) {
      token
      user {
        id
        firstName
        lastName
        name
        email
        avatar
        url
        location
      }
    }
  }
`
