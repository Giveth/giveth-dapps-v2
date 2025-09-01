'use client';

import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { neutralColors } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';
import { ETabs } from '@/components/views/donate/DonationCard';

export const DonationCardTabs = ({
	tab,
	setTab,
	recurringEnabled,
}: {
	tab: ETabs;
	setTab: (tab: ETabs) => void;
	recurringEnabled: boolean;
}) => {
	const { formatMessage } = useIntl();
	const router = useRouter();

	return (
		<TabsHolder>
			<TabLink
				$active={tab === ETabs.ONE_TIME}
				onClick={() => {
					setTab(ETabs.ONE_TIME);
					router.push(
						{
							query: {
								...router.query,
								tab: ETabs.ONE_TIME,
							},
						},
						undefined,
						{ shallow: true },
					);
				}}
			>
				<span>
					{tab === ETabs.ONE_TIME && '> '}
					{formatMessage({
						id: 'label.one_time_donation',
					})}
				</span>
			</TabLink>
			{recurringEnabled && (
				<TabLink
					$active={tab === ETabs.RECURRING}
					onClick={() => {
						setTab(ETabs.RECURRING);
						router.push(
							{
								query: {
									...router.query,
									tab: ETabs.RECURRING,
								},
							},
							undefined,
							{ shallow: true },
						);
					}}
				>
					<span>
						{tab === ETabs.RECURRING && '> '}
						{formatMessage({
							id: 'label.recurring_donation',
						})}
					</span>
				</TabLink>
			)}
		</TabsHolder>
	);
};

const TabsHolder = styled.div`
	display: flex;
	padding: 0 36px 0 56px;
	background: ${neutralColors.gray[200]};
`;

const TabLink = styled.div<{ $active?: boolean }>`
	position: relative;
	cursor: pointer;
	margin-left: -30px;
	padding: 10px 18px;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	text-decoration: none;
	background: ${({ $active }) =>
		$active ? neutralColors.gray[100] : neutralColors.gray[200]};
	box-shadow: ${Shadow.Neutral[400]};
	transition:
		background 160ms ease,
		box-shadow 160ms ease,
		color 160ms ease;
	z-index: ${({ $active }) => ($active ? '3' : '2')};

	--r: 1em;

	border-inline: var(--r) solid #0000;
	border-radius: calc(2 * var(--r)) calc(2 * var(--r)) 0 0 / var(--r);
	mask:
		radial-gradient(var(--r) at var(--r) 0, #0000 98%, #000 101%)
			calc(-1 * var(--r)) 100%/100% var(--r) repeat-x,
		conic-gradient(#000 0 0) padding-box;

	span {
		display: inline-block;
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 150%;
		color: ${neutralColors.gray[900]};
	}

	&:hover {
		span {
			color: ${neutralColors.gray[700]};
		}
	}
`;
