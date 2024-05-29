import {
	ButtonLink,
	Flex,
	Lead,
	OutlineLinkButton,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Link from 'next/link';
import { Box, BigArc, Title, Caption } from './common.sc';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';

export const QFNoResultBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<StyledBox $flexDirection='column' gap='24px'>
			<BigArc color={semanticColors.jade[200]} />
			<Title weight={700} color={semanticColors.jade[700]}>
				{formatMessage({
					id: 'label.no_active_qf_round',
				})}
			</Title>
			<Caption>
				{formatMessage({
					id: 'label.support_upcoming_qf_round',
				})}
			</Caption>
			<Actions>
				<Link href={links.GIVETH_MATCHING}>
					<DonateButton
						label={formatMessage({
							id: 'label.donate',
						})}
						size='large'
						linkType='primary'
					/>
				</Link>
				<Lead color={neutralColors.gray[800]}>or</Lead>
				<Link href={Routes.Projects}>
					<ExploreButton
						label={formatMessage({
							id: 'label.explore_projects',
						})}
						size='large'
						linkType='primary'
					/>
				</Link>
			</Actions>
		</StyledBox>
	);
};

const StyledBox = styled(Box)`
	margin-top: 96px;
	margin-bottom: 96px;
`;

const Actions = styled(Flex)`
	gap: 24px;
	flex-direction: column;
	align-items: center;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const DonateButton = styled(ButtonLink)`
	min-width: 300px;
`;

const ExploreButton = styled(OutlineLinkButton)`
	min-width: 300px;
`;
