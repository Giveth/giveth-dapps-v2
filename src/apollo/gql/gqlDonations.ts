import { gql } from '@apollo/client'

export const FETCH_PROJECT_DONATIONS = gql`
  query DonationsByProjectId($projectId: Float!, $take: Float, $skip: Float) {
    donationsByProjectId(projectId: $projectId, take: $take, skip: $skip) {
      donations {
        id
        anonymous
        user {
          name
        }
        fromWalletAddress
        amount
        valueUsd
        currency
        transactionId
        transactionNetworkId
        createdAt
      }
      totalCount
    }
  }
`

export const SAVE_DONATION = gql`
  mutation (
    $chainId: Float!
    $fromAddress: String!
    $toAddress: String!
    $transactionId: String
    $transactionNetworkId: Float!
    $amount: Float!
    $token: String!
    $projectId: Float!
    $transakId: String
    $transakStatus: String
    $tokenAddress: String
    $anonymous: Boolean
  ) {
    saveDonation(
      chainId: $chainId
      fromAddress: $fromAddress
      toAddress: $toAddress
      transactionId: $transactionId
      transactionNetworkId: $transactionNetworkId
      amount: $amount
      token: $token
      projectId: $projectId
      transakId: $transakId
      transakStatus: $transakStatus
      tokenAddress: $tokenAddress
      anonymous: $anonymous
    )
  }
`

export const SAVE_DONATION_TRANSACTION = gql`
  mutation ($transactionId: String!, $donationId: Float!) {
    saveDonationTransaction(transactionId: $transactionId, donationId: $donationId)
  }
`
