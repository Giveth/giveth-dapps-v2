const handler = (req, res) => {
	res.status(200).json({
		general: 1,
		givEconomyRelated: 2,
		projectsRelated: 3,
		lastNotificationId: '1000',
		total: 6,
	});
};

export default handler;
