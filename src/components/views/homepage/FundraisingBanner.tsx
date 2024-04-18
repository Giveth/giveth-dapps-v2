import styled from 'styled-components';
// import Image from 'next/image';
import { brandColors, P } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
// import GitcoinLogo from 'public/images/gitcoin-grants.png';

const FundraisingBanner = () => {
	return (
		<Wrapper>
			<P>
				<b>Got $GLM?</b> The allocation window is open for Octant Epoch
				4, allocate your staking rewards to Giveth to support our
				growth!
			</P>
			{/* <Image
				src={GitcoinLogo}
				alt='Gitcoin Grants'
				width={24}
				height={24}
			/> */}
			<PStyled>
				<ExternalLink href='https://octant.app/project/3/0x6e8873085530406995170Da467010565968C7C62'>
					<Purple>View our project. </Purple>
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
	position: sticky;
`;

export default FundraisingBanner;
