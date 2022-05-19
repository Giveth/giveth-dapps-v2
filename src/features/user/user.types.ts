export interface ISignToGetToken {
	message: string;
	address: string | undefined | null;
	chainId?: number;
	signer?: any;
}
