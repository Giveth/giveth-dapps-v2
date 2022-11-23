import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import NotificationView from './notification.view';

test('show no notifications when we dont have notifications', async () => {
	// jest.mock('@/features/notification/notification.services', () => ({
	// 	fetchNotificationsData: jest.fn().mockImplementation(() => 'ALI'),
	// }));

	// jest.spyOn(foo, 'fetchNotificationsData').mockReturnValue(
	// 	Promise.resolve(undefined),
	// );

	renderWithProviders(<NotificationView />);

	expect(
		screen.getByText(/you don't have any notifications/i),
	).toBeInTheDocument();
});
