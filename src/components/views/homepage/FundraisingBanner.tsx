import styled from 'styled-components';
import { brandColors, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';

const FundraisingBanner = () => {
	return (
		<Wrapper>
			<P>Hold an ENS Voting Card?</P>
			<Image
				src='/images/ENSlogoSmall.png'
				alt='ENS-logo'
				width={25}
				height={25}
			/>
			<PStyled>
				<ExternalLink href='https://ensgrants.xyz/rounds/33/proposals/850'>
					<Purple> Support Giveth in ENS Small Grants!</Purple>
				</ExternalLink>
				{/* and{' '} */}
				{/* <ExternalLink href='https://explorer.gitcoin.co/#/round/424/0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29/0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29-127'>
					<Purple>
						<b>donate to our Grant.</b>
					</Purple>
				</ExternalLink> */}
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
	position: sticky;
`;

export default FundraisingBanner;
