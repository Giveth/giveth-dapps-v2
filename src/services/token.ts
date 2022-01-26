import { ethers } from 'ethers'
import { initializeApollo } from '../apollo/apolloClient'
import { LOGIN_USER } from '../apollo/gql/gqlAuth'
import { IUserByAddress } from '../apollo/types/gqlTypes'

const apolloClient = initializeApollo()

export async function getToken(
  walletAddress: string | null | undefined,
  signature: string,
  networkId: number | undefined,
  user?: IUserByAddress
) {
  if (signature && walletAddress && networkId) {
    try {
      const mutate = {
        mutation: LOGIN_USER,
        variables: {
          walletAddress: ethers.utils.getAddress(walletAddress),
          signature,
          email: user?.email,
          avatar: user?.avatar,
          name: user?.name,
          hostname: window?.location.hostname,
          networkId
        }
      }
      const { data } = await apolloClient.mutate(mutate)
      return data?.loginWallet?.token
    } catch (error) {
      console.log('Error in token login: ', error)
    }
  } else {
    console.log('Input data for getting token is incomplete')
  }
}
