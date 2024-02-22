export default async function handler(req, res) {
	const { tokenAddress } = req.query;

	if (!tokenAddress) {
		return res.status(400).json({ error: 'Token address is required' });
	}

	const velodromeSubgraphUrl = process.env.VELODROME_GRAPHQL_PRICES_URL;
	const query = {
		query: `
        {
            tokens(where:{id:"${tokenAddress?.toLowerCase()}"}) {
                id
                name
                symbol
                decimals
                lastPriceUSD
            }
        }
        `,
	};

	try {
		const response = await fetch(velodromeSubgraphUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(query),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json();
		const lastPriceUSD =
			result.data.tokens.length > 0
				? Number(result.data.tokens[0].lastPriceUSD)
				: null;

		if (lastPriceUSD === null) {
			return res.status(404).json({ error: 'Token not found' });
		}

		res.status(200).json({ price: lastPriceUSD });
	} catch (error) {
		res.status(500).json({
			error: 'Failed to fetch the price',
			details: error.message,
		});
	}
}
