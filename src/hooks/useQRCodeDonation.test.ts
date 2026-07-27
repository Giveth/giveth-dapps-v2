import { act, renderHook } from '@testing-library/react';
import {
	clearStoredDraftDonationId,
	getStoredDraftDonationId,
	parseDraftDonationsStorage,
	useQRCodeDonation,
} from './useQRCodeDonation';
import StorageLabel from '@/lib/localStorage';
import { client } from '@/apollo/apolloClient';
import { IProject } from '@/apollo/types/types';

describe('parseDraftDonationsStorage', () => {
	it.each([null, '', 'undefined', '{broken', '[]', '"draft-id"'])(
		'returns an empty map for invalid storage value %p',
		storedValue => {
			expect(parseDraftDonationsStorage(storedValue)).toEqual({});
		},
	);

	it('keeps only finite numeric draft ids', () => {
		expect(
			parseDraftDonationsStorage(
				JSON.stringify({
					'12:GABC': 123,
					GABC: 456,
					stringId: '789',
					nullId: null,
				}),
			),
		).toEqual({
			'12:GABC': 123,
			GABC: 456,
		});
	});
});

describe('getStoredDraftDonationId', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('prefers the project-scoped key', () => {
		localStorage.setItem(
			StorageLabel.DRAFT_DONATIONS,
			JSON.stringify({
				GABC: 100,
				'12:GABC': 200,
			}),
		);

		expect(getStoredDraftDonationId(12, 'gabc')).toBe(200);
	});

	it('supports the legacy address-only key', () => {
		localStorage.setItem(
			StorageLabel.DRAFT_DONATIONS,
			JSON.stringify({ GABC: 100 }),
		);

		expect(getStoredDraftDonationId(12, 'GABC')).toBe(100);
	});

	it('clears the project-scoped key without removing other drafts', () => {
		localStorage.setItem(
			StorageLabel.DRAFT_DONATIONS,
			JSON.stringify({
				'12:GABC': 200,
				'13:GOTHER': 300,
			}),
		);

		clearStoredDraftDonationId(12, 'gabc');

		expect(
			parseDraftDonationsStorage(
				localStorage.getItem(StorageLabel.DRAFT_DONATIONS),
			),
		).toEqual({
			'13:GOTHER': 300,
		});
	});

	it('clears lowercase and uppercase legacy keys without removing other drafts', () => {
		localStorage.setItem(
			StorageLabel.DRAFT_DONATIONS,
			JSON.stringify({
				gabc: 100,
				GABC: 101,
				'13:GOTHER': 300,
			}),
		);

		clearStoredDraftDonationId(12, 'gabc');

		expect(
			parseDraftDonationsStorage(
				localStorage.getItem(StorageLabel.DRAFT_DONATIONS),
			),
		).toEqual({
			'13:GOTHER': 300,
		});
	});
});

describe('retrieveDraftDonation', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns null when the backend reports that the stored draft no longer exists', async () => {
		jest.spyOn(client, 'query').mockResolvedValue({
			data: { getDraftDonationById: null },
		} as any);
		const { result } = renderHook(() => useQRCodeDonation({} as IProject));
		let retrievedDraftDonation;

		await act(async () => {
			retrievedDraftDonation = await result.current.retrieveDraftDonation(
				123,
				{
					throwOnError: true,
				},
			);
		});

		expect(retrievedDraftDonation).toBeNull();
		expect(result.current.draftDonation).toBeNull();
		expect(result.current.loading).toBe(false);
	});
});
