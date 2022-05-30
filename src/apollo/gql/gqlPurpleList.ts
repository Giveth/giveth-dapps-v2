export const CHECK_PURPLE_LIST = `
	query walletAddressIsPurpleListed($address: String!) {
		walletAddressIsPurpleListed(address: $address)
	}
`;
