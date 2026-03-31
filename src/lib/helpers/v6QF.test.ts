jest.mock('@/helpers/time', () => ({
	getNowUnixMS: () => new Date('2026-03-30T12:00:00.000Z').getTime(),
}));

import {
	buildV6ProjectUrl,
	getActiveV6QfRound,
	isV6QfRoundCurrentlyActive,
} from '@/lib/helpers/v6QF';

describe('v6QF helpers', () => {
	test('detects an active round only when it is within the round window', () => {
		expect(
			isV6QfRoundCurrentlyActive({
				id: 1,
				isActive: true,
				beginDate: '2026-03-29T12:00:00.000Z',
				endDate: '2026-03-31T12:00:00.000Z',
			}),
		).toBe(true);

		expect(
			isV6QfRoundCurrentlyActive({
				id: 2,
				isActive: true,
				beginDate: '2026-03-31T12:00:00.000Z',
				endDate: '2026-04-01T12:00:00.000Z',
			}),
		).toBe(false);

		expect(
			isV6QfRoundCurrentlyActive({
				id: 3,
				isActive: true,
				beginDate: '2026-03-28T12:00:00.000Z',
				endDate: '2026-03-29T12:00:00.000Z',
			}),
		).toBe(false);
	});

	test('returns the active round for a v6 project', () => {
		expect(
			getActiveV6QfRound({
				id: 1,
				slug: 'solar-aid',
				title: 'Solar Aid',
				qfRounds: [
					{
						id: 1,
						isActive: false,
						beginDate: '2026-03-29T12:00:00.000Z',
						endDate: '2026-03-31T12:00:00.000Z',
					},
					{
						id: 2,
						isActive: true,
						beginDate: '2026-03-29T12:00:00.000Z',
						endDate: '2026-03-31T12:00:00.000Z',
					},
				],
			}),
		).toEqual({
			id: 2,
			isActive: true,
			beginDate: '2026-03-29T12:00:00.000Z',
			endDate: '2026-03-31T12:00:00.000Z',
		});
	});

	test('builds a stable v6 project url', () => {
		expect(buildV6ProjectUrl('https://v6.giveth.io', 'solar-aid')).toBe(
			'https://v6.giveth.io/project/solar-aid',
		);
		expect(buildV6ProjectUrl('https://v6.giveth.io/', 'solar-aid')).toBe(
			'https://v6.giveth.io/project/solar-aid',
		);
	});
});
