import styled from 'styled-components';
import Image from 'next/image';
import { brandColors, P, FlexCenter } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import Gitcoin from '/public/images/partnerships/Gitcoin.svg';

const FundraisingBanner = () => {
	return (
		<Wrapper>
			<P>Support Giveth with a donation in Gitcoin Grants round 20!</P>
			<Image src={Gitcoin} alt='Gitcoin Grants' width={24} height={24} />
			<PStyled>
				<ExternalLink href='https://explorer.gitcoin.co/#/round/42161/25/55'>
					<Purple>Check out our grant page here.</Purple>
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
