import { screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithProviders } from '@/tests/utils';
import NotificationView from './notification.view';
import config from '@/configuration';
import { INotificationsState } from '@/features/notification/notification.types';

const server = setupServer(
	rest.get<any, any, INotificationsState | [] | undefined>(
		`${config.MICROSERVICES.notification}`,
		async (req, res, ctx) => {
			return res(
				ctx.json({
					count: 1,
					notifications: [
						{
							id: 5,
							createdAt: 'test',
							isRead: false,
							metadata: {
								test: 'test',
							},
							notificationType: {
								category: 'test',
								content: 'test',
								description: 'test',
								icon: 'test',
								htmlTemplate: [],
							},
						},
					],
				}),
			);
		},
	),
);

beforeAll(() => {
	// Establish requests interception layer before all tests.
	server.listen();
});
afterAll(() => {
	// Clean up after all tests are done, preventing this
	// interception layer from affecting irrelevant tests.
	server.close();
});

test('show no notifications when we dont have notifications', async () => {
	renderWithProviders(<NotificationView />);
	expect(
		screen.getByText(/you don't have any notifications/i),
	).toBeInTheDocument();
});
