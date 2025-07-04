import { captureException } from '@sentry/nextjs';
import { getNowUnixMS } from '@/helpers/time';
import { SENTRY_URGENT } from '@/configuration';
import { getMongoDB } from '@/lib/mongoDb/db';

const handler = async (req, res) => {
	const { body, method, headers } = req;
	const now = getNowUnixMS();
	body.saveTimestamp = now;
	body.auth = headers.authorization;
	if (method !== 'POST') {
		res.status(405).json({ message: 'Method not allowed' });
		return;
	}
	try {
		if (method === 'POST') {
			const db = await getMongoDB();
			const response = await db.collection('failed_donation').insertOne({
				...body,
			});
			res.status(200).json({
				message: 'Successfully saved',
				id: response.insertedId,
			});
		}
	} catch (error) {
		console.error('Error in saving donation to DB', error);
		captureException(
			{
				data: body,
				authorization: headers.authorization,
				error,
			},
			{
				tags: {
					section: SENTRY_URGENT,
				},
			},
		);
		res.status(500).json();
	}
};

export default handler;
