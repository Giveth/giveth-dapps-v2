import { utils } from 'ethers';

import airdrops from './merkle_distributor_xdai_result.json';
const handler = (req, res) => {
	const { body, method } = req;
	try {
		if (method === 'POST') {
			const address = utils.getAddress(body.address.toLowerCase());
			const claim = airdrops.claims[address];
			if (claim) {
				res.status(200).json(claim);
			} else {
				res.status(404).json();
			}
		}
	} catch (error) {
		res.status(500).json();
	}
};

export default handler;
