import {
	Subline,
	brandColors,
	P,
	neutralColors,
	mediaQueries,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useCauseContext } from '@/context/cause.context';
import Routes from '@/lib/constants/Routes';
import { ECausePageTabs } from '@/components/views/cause/CauseIndex';
import { Shadow } from '@/components/styled-components/Shadow';

interface ICauseTabs {
	activeTab: number;
	slug: string;
}

const badgeCount = (count?: number) => {
	return count || null;
};

const CauseTabs = (props: ICauseTabs) => {
	const { activeTab, slug } = props;
	const { causeData, totalDonationsCount, boostersData } = useCauseContext();
	const { totalProjectUpdates } = causeData || {};
	const { formatMessage } = useIntl();

	const tabsArray = [
		{ title: 'label.about' },
		{
			title: 'label.projects',
			badge: totalProjectUpdates, // TODO: change to totalProjectsCount
			query: ECausePageTabs.PROJECTS,
		},
		{
			title: 'label.donations',
			badge: totalDonationsCount,
			query: ECausePageTabs.DONATIONS,
		},
	];

	if (causeData?.verified) {
		tabsArray.push({
			title: 'label.givpower',
			badge: boostersData?.powerBoostings.length,
			query: ECausePageTabs.GIVPOWER,
		});
	}

	return (
		<Wrapper>
			<InnerWrapper>
				{tabsArray.map((i, index) => (
					<LinkWrapper
						key={i.title}
						href={`${Routes.Cause}/${slug}${
							i.query ? `?tab=${i.query}` : ''
						}`}
						scroll={false}
					>
						<Tab className={activeTab === index ? 'active' : ''}>
							{formatMessage({ id: i.title })}
							{badgeCount(i.badge) && (
								<Badge
									className={
										activeTab === index ? 'active' : ''
									}
									color='white'
								>
									{i.badge}
								</Badge>
							)}
						</Tab>
					</LinkWrapper>
				))}
			</InnerWrapper>
		</Wrapper>
	);
};

const InnerWrapper = styled(Flex)`
	margin: 0 auto;
	max-width: 1200px;
	align-items: center;
	gap: 24px;
	padding: 0 24px;
	${mediaQueries.desktop} {
		padding: 0;
	}
`;

const Badge = styled(Subline)`
	background: ${neutralColors.gray[800]};
	color: #ffffff;
	border-radius: 40px;
	height: 22px;
	padding: 0 9px;
	display: flex;
	align-items: center;
	margin-left: 6px;
	&.active {
		background: ${brandColors.pinky[500]};
	}
`;

interface TabProps {
	$unverified?: boolean;
}

const TooltipWrapper = styled.div`
	position: absolute;
	bottom: 18%;
	left: 100%;
	background: #1a1a1a;
	color: #fff;
	padding: 8px 12px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 0.2s ease-in-out,
		visibility 0.2s ease-in-out;
	z-index: 500;
`;

const LinkWrapper = styled(Link)`
	position: relative;
	&:hover ${TooltipWrapper} {
		visibility: visible;
		opacity: 1;
	}
`;

const Tab = styled(P)<TabProps>`
	display: flex;
	padding: 9px 24px;
	border-radius: 48px;
	cursor: pointer;
	&.active {
		font-weight: 500;
		color: ${brandColors.pinky[500]};
		background: ${neutralColors.gray[200]};
	}
	opacity: ${({ $unverified }) => ($unverified ? '0.5' : '1')};
`;

const Wrapper = styled.div`
	width: 100%;
	padding: 16px 0;
	color: ${neutralColors.gray[800]};
	height: min-content;
	margin-top: 24px;
	position: relative;
	background-color: white;
	overflow-x: auto;
	box-shadow: ${Shadow.Neutral[400]};
`;

export default CauseTabs;
