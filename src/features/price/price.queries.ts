export const FETCH_MAINNET_TOKEN_PRICE = `query FetchMainnetTokenPrice($tokenId: String!, $daiId:String){
	token: token(id: $tokenId) {
	  id
	  symbol
	  derivedETH
	}
	daitoken: token(id: $daiId) {
	  id
	  symbol
	  derivedETH
	}
  }`;

export const FETCH_GNOSIS_TOKEN_PRICE = `query FetchGnosisTokenPrice($id: String!){
	token(id: $id) {
		derivedETH
	}
  }`;
