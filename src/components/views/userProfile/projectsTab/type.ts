export enum ClaimTransactionState {
	NOT_STARTED = 'Not_Started',
	WITHDRAWING = 'Withdrawing', // FOR ERC20 TOKENS ONLY
	DOWNGRADING_TO_ETH = 'Downgrading_To_ETH', // FOR ETHx ONLY
	TRANSFERRING_ETH = 'Transferring_ETH', // FOR ETHx ONLY
	SUCCESS = 'Success',
}
