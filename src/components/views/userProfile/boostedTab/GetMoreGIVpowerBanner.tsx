import {
	brandColors,
	ButtonLink,
	H1,
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
			<H1 weight={700}>Get more GIVpower</H1>
			<QuoteText size='small'>
				Stake & lock GIV to get GIVpower to boost projects.
			</QuoteText>
			<Actions>
				<Link
					href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
					passHref
				>
					<ButtonLink
						label='Stake GIV'
						size='large'
						linkType='primary'
					/>
				</Link>
				<OutlineLinkButton
					label='Get GIV'
					size='large'
					linkType='primary'
					href={config.XDAI_CONFIG.GIV.BUY_LINK}
				/>
			</Actions>
		</GetMoreGIVpowerContainer>
	);
};

const GetMoreGIVpowerContainer = styled.div`
	color: ${brandColors.giv[500]};
`;
const Actions = styled(Flex)`
	& > a {
		padding: 24px 72px;
	}
`;

export default GetMoreGIVpowerBanner;
