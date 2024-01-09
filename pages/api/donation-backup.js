import { captureException } from '@sentry/nextjs';

const handler = (req, res) => {
	const { body, method, headers } = req;
	try {
		if (method === 'POST') {
			fetch(process.env.MONGO_DONATION_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Request-Headers': '*',
					'api-key': process.env.MONGO_DONATION_API_KEY,
				},
				body: JSON.stringify({
					collection: process.env.MONGO_DONATION_COLLECTION,
					database: process.env.MONGO_DONATION_DATABASE,
					dataSource: process.env.MONGO_DONATION_DATA_SOURCE,
					document: body,
				}),
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					res.status(200).json('Successfully saved');
				})
				.catch(error => {
					captureException(
						{
							data: body,
							authorization: headers.authorization,
							error,
						},
						{
							tags: {
								section: 'onDonationBackup',
							},
						},
					);
					res.status(200).json('Sent to sentry');
				});
			console.log('body', body);
		}
	} catch (error) {
		res.status(500).json();
	}
};

export default handler;
