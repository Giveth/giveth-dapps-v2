import {
	B,
	brandColors,
	Caption,
	Flex,
	GLink,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';

import { useAppSelector } from '@/features/hooks';
import { HighlightSection } from './common';
import { Item } from './Item';
import Routes from '@/lib/constants/Routes';
import { ETheme } from '@/features/general/general.slice';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { getNowUnixMS } from '@/helpers/time';

interface ICausesItems {
	inSidebar?: boolean;
}

export const projectsItems = {
	explore: [
		{
			name: 'All Causes',
			url: Routes.AllCauses,
			label: 'label.cause.causes_all',
		},
		{
			name: 'Recently Updated',
			url: Routes.AllCauses + '?sort=' + EProjectsSortBy.RECENTLY_UPDATED,
			label: 'label.recently_updated',
		},
		{
			name: 'Just Launched',
			url: Routes.AllCauses + '?sort=' + EProjectsSortBy.NEWEST,
			label: 'label.just_launched',
		},
	],
};

const QFItem = {
	name: 'Quadratic Funding',
	url: Routes.QFProjects,
	label: 'label.eligible_for_matching',
};

export const CausesItems: FC<ICausesItems> = ({ inSidebar = false }) => {
	const { theme, mainCategories, activeQFRound } = useAppSelector(
		state => state.general,
	);
	const { formatMessage } = useIntl();

	const now = getNowUnixMS();
	const _startDate = new Date(activeQFRound?.beginDate || 0).getTime();
	const _endDate = new Date(activeQFRound?.endDate || 0).getTime();
	const showQFLink = activeQFRound && now > _startDate && now < _endDate;

	return (
		<>
			<HighlightSection $baseTheme={theme}>
				<Label $medium>
					{formatMessage({ id: 'label.explore_by' })}
				</Label>
				<ExploreByRow
					gap='16px'
					$flexDirection={inSidebar ? 'column' : undefined}
					$flexWrap={inSidebar ? false : true}
				>
					{projectsItems.explore.map((explore, idx) => (
						<Link key={idx} href={explore.url}>
							<ExploreItem baseTheme={theme} isHighlighted>
								<B>{formatMessage({ id: explore.label })}</B>
							</ExploreItem>
						</Link>
					))}
					{showQFLink && (
						<Link href={QFItem.url}>
							<ExploreItem
								className='qf-item'
								baseTheme={theme}
								isHighlighted
							>
								<B>{formatMessage({ id: QFItem.label })}</B>
							</ExploreItem>
						</Link>
					)}
					<Link href={Routes.CreateCause}>
						<ExploreItemCreate
							className='qf-item'
							baseTheme={theme}
							isHighlighted
						>
							<B>
								{formatMessage({
									id: 'label.cause.create_cause',
								})}
							</B>
						</ExploreItemCreate>
					</Link>
				</ExploreByRow>
			</HighlightSection>
			<NormalSection $inSidebar={inSidebar}>
				<Label $medium>{formatMessage({ id: 'label.category' })}</Label>
				<CategoriesGrid $inSidebar={inSidebar} $baseTheme={theme}>
					{mainCategories.map((category, idx) => (
						<Link
							key={idx}
							href={`${Routes.Causes}/${category.slug}`}
						>
							<CategoryItem $theme={theme}>
								<GLink size='Big'>
									{formatMessage({
										id: 'projects_' + category.slug,
									})}
								</GLink>
							</CategoryItem>
						</Link>
					))}
				</CategoriesGrid>
			</NormalSection>
		</>
	);
};

const ExploreByRow = styled(Flex)`
	margin-top: 16px;
	flex-wrap: ${props => (props.$flexWrap ? 'wrap' : 'nowrap')};
`;

const ExploreItem = styled(Item)`
	padding: 2px 8px;
	&.qf-item {
		background: ${brandColors.cyan[600]};
		border-radius: 16px;
		color: white;
	}
`;

const ExploreItemCreate = styled(Item)`
	padding: 2px 8px;
	font-size: 14px;
	color: ${brandColors.pinky[500]};
	text-transform: uppercase;
`;

const NormalSection = styled.div<{ $inSidebar?: boolean }>`
	margin-top: 16px;
	padding: 8px 8px 0;
	border-radius: 16px;
`;

const CategoriesGrid = styled.div<{ $inSidebar?: boolean; $baseTheme: ETheme }>`
	display: grid;
	grid-template: ${props =>
		props.$inSidebar ? 'auto' : 'auto auto auto auto / auto auto auto'};
	margin-top: 8px;
`;

const CategoryItem = styled(Item)<{ $theme: ETheme }>`
	padding: 8px;
	&:hover {
		background: transparent;
		color: ${({ $theme }) =>
			$theme === ETheme.Dark
				? brandColors.giv[200]
				: brandColors.giv[500]};
	}
`;

const Label = styled(Caption)`
	padding-left: 8px;
	text-transform: uppercase;
	color: ${neutralColors.gray[600]};
`;
