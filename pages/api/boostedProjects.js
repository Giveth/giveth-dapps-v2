const handler = (req, res) => {
	const { body, method } = req;
	try {
		res.status(200).json({
			boostedProjects: [
				{
					project: { title: 'The Giveth Community of Makers' },
					percentage: 30,
				},
				{
					project: { title: 'Gitcoin Grants Matching Pool' },
					percentage: 5,
				},
				{ project: { title: 'Unchain Fund' }, percentage: 10 },
				{
					project: { title: 'Bridging Digital Communities' },
					percentage: 10,
				},
				{ project: { title: 'Free The Food' }, percentage: 10 },
				{
					project: { title: 'Diamante Bridge Collective' },
					percentage: 10,
				},
				{ project: { title: 'Red Armonia' }, percentage: 10 },
				{ project: { title: 'Giveth Matching Pool' }, percentage: 15 },
			],
		});
	} catch (error) {
		res.status(500).json();
	}
};

export default handler;
