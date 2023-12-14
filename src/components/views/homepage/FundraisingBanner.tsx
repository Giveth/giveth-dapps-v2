import styled from 'styled-components';
import { brandColors, P } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';

const FundraisingBanner = () => {
	return (
		<Wrapper>
			<P>
				<b>ATTENTION:</b>
			</P>
			<PStyled>
				<ExternalLink href='https://twitter.com/MatthewLilley/status/1735275960662921638'>
					<Purple>
						{' '}
						There is an exploit affecting many Ethereum websites and
						applications.{' '}
					</Purple>
				</ExternalLink>
				<P>
					The Giveth team has updated our website to prevent the
					exploit,
					<b> the Giveth Dapp is SAFE to use.</b> ✅
				</P>
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
