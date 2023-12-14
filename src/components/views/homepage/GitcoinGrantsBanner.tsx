import styled from 'styled-components';
import { brandColors, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';

const GitcoinGrantsBanner = () => {
	return (
		<Wrapper>
			<P>Support Giveth in Gitcoin Grants 19</P>
			<Image
				src='/images/gitcoin-grants.png'
				alt='gitcoin-grants'
				width={24.2}
				height={25}
			/>
			<PStyled>
				|{' '}
				<ExternalLink href='https://www.layerswap.io/app'>
					<Purple>Bridge your funds to PGN network</Purple>
				</ExternalLink>
				and{' '}
				<ExternalLink href='https://explorer.gitcoin.co/#/round/424/0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29/0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29-127'>
					<Purple>
						<b>donate to our Grant.</b>
					</Purple>
				</ExternalLink>
			</PStyled>
		</Wrapper>
	);
};

const PStyled = styled.div`
	display: flex;
	gap: 4px;
`;

const Purple = styled.div`
	color: ${brandColors.giv[500]};
`;

const Wrapper = styled(FlexCenter)`
	flex-wrap: wrap;
	padding: 16px;
	text-align: center;
	gap: 4px;
	background: ${brandColors.giv[100]};
	z-index: 99;
	top: 92px;
	position: sticky;
`;

export default GitcoinGrantsBanner;
