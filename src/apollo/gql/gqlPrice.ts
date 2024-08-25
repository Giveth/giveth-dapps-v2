export const FETCH_MAINNET_TOKEN_PRICES = `
  query FetchMainnetTokenPrices($tokenIds: [String!]!, $daiId: String!) {
    tokens: tokens(where: { id_in: $tokenIds }) {
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

export const FETCH_GNOSIS_TOKEN_PRICES = `
  query FetchGnosisTokenPrices($ids: [String!]!) {
    tokens(where: { id_in: $ids }) {
      id
      derivedNativeCurrency
    }
  }`;
