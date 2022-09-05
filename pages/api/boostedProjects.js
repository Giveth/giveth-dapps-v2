const handler = (req, res) => {
	const { body, method } = req;
	try {
		res.status(200).json({
			boostedProjects: [
				{
					project: { title: 'The Giveth Community of Makers', id: 1 },
					percentage: 30,
				},
				{
					project: { title: 'Gitcoin Grants Matching Pool', id: 2 },
					percentage: 5,
				},
				{ project: { title: 'Unchain Fund', id: 3 }, percentage: 10 },
				{
					project: { title: 'Bridging Digital Communities', id: 4 },
					percentage: 10,
				},
				{ project: { title: 'Free The Food', id: 5 }, percentage: 10 },
				{
					project: { title: 'Diamante Bridge Collective', id: 6 },
					percentage: 10,
				},
				{ project: { title: 'Red Armonia', id: 7 }, percentage: 10 },
				{
					project: { title: 'Giveth Matching Pool', id: 8 },
					percentage: 15,
				},
			],
		});
	} catch (error) {
		res.status(500).json();
	}
};

export default handler;
