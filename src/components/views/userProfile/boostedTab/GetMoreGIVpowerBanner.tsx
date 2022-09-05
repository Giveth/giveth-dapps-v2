import {
	brandColors,
	ButtonLink,
	H1,
	mediaQueries,
	OutlineLinkButton,
	QuoteText,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import { Flex } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';
import config from '@/configuration';

const GetMoreGIVpowerBanner = () => {
	return (
		<GetMoreGIVpowerContainer>
			<Background />
			<H1 weight={700}>Get more GIVpower</H1>
			<QuoteText size='small'>
				Stake & lock GIV to get GIVpower to boost projects.
			</QuoteText>
			<Actions gap='16px' wrap={1}>
				<Link
					href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
					passHref
				>
					<ButtonLink
						label='Stake GIV'
						size='small'
						linkType='primary'
					/>
				</Link>
				<OutlineLinkButton
					label='Get GIV'
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
