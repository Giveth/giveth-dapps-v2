import styled from 'styled-components';
import Image from 'next/image';
import { brandColors, P } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import GitcoinLogo from 'public/images/gitcoin-grants.png';

const FundraisingBanner = () => {
	return (
		<Wrapper>
			<P>
				Support Giveth's growth by donating to us on the Glo Dollar x
				Arbitrum DAO round on Gitcoin.
			</P>
			<Image
				src={GitcoinLogo}
				alt='Gitcoin Grants'
				width={24}
				height={24}
			/>
			<PStyled>
				<ExternalLink href='https://explorer.gitcoin.co/#/round/42161/0xc5262fc451a72f68f83563e30126d9c1d5d77659/0xc5262fc451a72f68f83563e30126d9c1d5d77659-12'>
					<Purple> Click here to view our grant. </Purple>
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
