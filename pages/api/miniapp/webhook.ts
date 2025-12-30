import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Base Mini App Webhook Handler
 *
 * This endpoint receives webhook notifications from the Base/Farcaster platform.
 * Common webhook events include:
 * - frame_added: When a user adds the mini app
 * - frame_removed: When a user removes the mini app
 * - notifications_enabled: When a user enables notifications
 * - notifications_disabled: When a user disables notifications
 *
 * @see https://docs.base.org/mini-apps/features/notifications
 */

interface WebhookPayload {
	event: string;
	data: {
		fid?: number;
		notificationDetails?: {
			url: string;
			token: string;
		};
		[key: string]: unknown;
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Only accept POST requests
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const payload = req.body as WebhookPayload;

		console.log('[MiniApp Webhook] Received event:', payload.event);
		console.log(
			'[MiniApp Webhook] Payload:',
			JSON.stringify(payload, null, 2),
		);

		// Handle different webhook events
		switch (payload.event) {
			case 'frame_added':
				// User added the mini app
				console.log(
					'[MiniApp Webhook] User added mini app, FID:',
					payload.data?.fid,
				);
				// TODO: Track user addition, store notification details if provided
				break;

			case 'frame_removed':
				// User removed the mini app
				console.log(
					'[MiniApp Webhook] User removed mini app, FID:',
					payload.data?.fid,
				);
				// TODO: Clean up user data if needed
				break;

			case 'notifications_enabled':
				// User enabled notifications
				console.log(
					'[MiniApp Webhook] Notifications enabled, FID:',
					payload.data?.fid,
				);
				// TODO: Store notification URL and token for sending notifications
				if (payload.data?.notificationDetails) {
					// Store: payload.data.notificationDetails.url
					// Store: payload.data.notificationDetails.token
				}
				break;

			case 'notifications_disabled':
				// User disabled notifications
				console.log(
					'[MiniApp Webhook] Notifications disabled, FID:',
					payload.data?.fid,
				);
				// TODO: Remove stored notification credentials
				break;

			default:
				console.log(
					'[MiniApp Webhook] Unknown event type:',
					payload.event,
				);
		}

		// Acknowledge receipt
		return res.status(200).json({ success: true });
	} catch (error) {
		console.error('[MiniApp Webhook] Error processing webhook:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
