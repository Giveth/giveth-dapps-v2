import { gql } from '@apollo/client';

export const CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY = gql`
	mutation (
		$projectId: Int!
		$networkId: Int!
		$address: String!
		$txHash: String!
	) {
		addAnchorContractAddress(
			projectId: $projectId
			networkId: $networkId
			address: $address
			txHash: $txHash
		) {
			id
			address
			isActive
		}
	}
`;
