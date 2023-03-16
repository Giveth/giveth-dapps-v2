import { screen, waitFor } from '@testing-library/react';
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
							id: 8,
							projectId: null,
							emailStatus: 'noNeedToSend',
							email: null,
							trackId:
								'100-0xf640b47ea690e00098a13898a35d87f735c0850d10e8236f61f8c5be24528e48-2',
							emailContent: null,
							isRead: true,
							segmentData: null,
							metadata: {
								amount: '4.0',
								network: '100',
								contractName: 'Gnosis Token Distro',
								transactionHash:
									'0xf640b47ea690e00098a13898a35d87f735c0850d10e8236f61f8c5be24528e48',
							},
							createdAt: '2022-12-27T15:21:25.000Z',
							updatedAt: '2023-02-26T14:07:09.322Z',
							notificationType: {
								id: 26,
								microService: 'giveconomy-notification-service',
								isGlobal: false,
								isGroupParent: true,
								showOnSettingPage: true,
								isEmailEditable: false,
								isWebEditable: true,
								emailDefaultValue: false,
								webDefaultValue: true,
								categoryGroup: 'givBacks',
								name: 'GIVback is ready to claim',
								description:
									'Notify me when my GIV from GIVbacks is ready to claim.',
								schemaValidator: 'givBackReadyToClaim',
								category: 'givEconomy',
								emailNotifierService: null,
								emailNotificationId: null,
								pushNotifierService: null,
								requiresTemplate: true,
								htmlTemplate: [
									{ type: 'p', content: 'Your GIVback ' },
									{ type: 'b', content: '$amount' },
									{
										type: 'p',
										content: ' GIV is ready to claim! ',
									},
									{ type: 'br' },
									{
										href: '/givbacks',
										type: 'a',
										content: 'Click here',
									},
									{
										type: 'p',
										content: ' to take a shortcut.',
									},
								],
								title: 'GIVbacks',
								icon: 'IconGIVBack',
								content:
									'Your GIVback {amount} GIV is ready to claim! \n[Click here] to take a shortcut.',
								createdAt: '2023-02-26T12:11:37.493Z',
								updatedAt: '2023-02-26T12:11:37.493Z',
							},
							notificationTypeId: 26,
							userAddressId: 1,
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
afterEach(() => server.resetHandlers());
afterAll(() => {
	// Clean up after all tests are done, preventing this
	// interception layer from affecting irrelevant tests.
	server.close();
});

test('show no notifications when we do not have notifications', async () => {
	server.use(
		rest.get<any, any, INotificationsState | [] | undefined>(
			`${config.MICROSERVICES.notification}`,
			async (req, res, ctx) => {
				return res(
					ctx.json({
						count: 1,
						notifications: [],
					}),
				);
			},
		),
	);
	renderWithProviders(<NotificationView />);
	await waitFor(() => {
		// expect(screen.getByTestId('loading')).not.toBeInTheDocument();
		expect(
			screen.getByText(/you don't have any notifications/i),
		).toBeInTheDocument();
	});
});

test('show notifications', async () => {
	renderWithProviders(<NotificationView />);
	await waitFor(() =>
		expect(screen.getByRole('notification')).toBeInTheDocument(),
	);
});
