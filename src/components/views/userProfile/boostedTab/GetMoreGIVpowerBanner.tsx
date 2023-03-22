import {
	brandColors,
	ButtonLink,
	H1,
	mediaQueries,
	OutlineLinkButton,
	QuoteText,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { Flex } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';
import config from '@/configuration';

const GetMoreGIVpowerBanner = () => {
	const { formatMessage } = useIntl();

	return (
		<GetMoreGIVpowerContainer>
			<Background />
			<H1 weight={700}>
				{formatMessage({ id: 'label.get_more_givpower' })}
			</H1>
			<QuoteText size='small'>
				{formatMessage({
					id: 'label.stake_and_lock_giv_to_get_givpower_to_boost_projects',
				})}
				.
			</QuoteText>
			<Actions gap='16px' flexWrap>
				<Link
					href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
				>
					<ButtonLink
						label={formatMessage({ id: 'label.stake_giv' })}
						size='small'
						linkType='primary'
					/>
				</Link>
				<OutlineLinkButton
					isExternal
					label={formatMessage({ id: 'label.get_giv' })}
					size='small'
					linkType='primary'
					href={config.XDAI_CONFIG.GIV.BUY_LINK}
					target='_blank'
				/>
			</Actions>
		</GetMoreGIVpowerContainer>
	);
};

const GetMoreGIVpowerContainer = styled.div`
	position: relative;
	background-color: ${brandColors.giv['000']};
	color: ${brandColors.giv[500]};
	padding: 51px 59px;
	border-radius: 8px;
`;

const Background = styled.div`
	background-image: url('/images/backgrounds/giv-outline.svg');
	opacity: 0.18;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	position: absolute;
`;

const Actions = styled(Flex)`
	margin-top: 40px;
	justify-content: center;
	& > a {
		width: 251px;
		z-index: 1;
	}
	${mediaQueries.tablet} {
		justify-content: flex-start;
		& > a {
			width: 220px;
		}
	}
`;

export default GetMoreGIVpowerBanner;
