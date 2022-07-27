export interface ClaimData {
	index: number;
	amount: string;
	proof: Array<string>;
	flags: {
		[key: string]: boolean;
	};
}
