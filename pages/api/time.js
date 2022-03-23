const handler = (req, res) => {
	res.status(200).json({ unixTime: Date.now() });
};

export default handler;
