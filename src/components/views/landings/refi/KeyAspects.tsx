import styled from 'styled-components';
import { H3, neutralColors, Lead } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import KeyAspectsSVG from '@/components/views/landings/refi/KeyAspectsSVG';
import { mediaQueries } from '@/lib/constants/constants';

const KeyAspects = () => {
	return (
		<Wrapper size='large'>
			<FlexStyled gap='60px'>
				<div>
					<H3Styled weight={700}>
						Key aspects of regenerative finance (ReFi)
					</H3Styled>
					<div>
						Although it has a clear mission of using financial
						incentives for the betterment of the planet,
						Regenerative Finance (ReFi) is a complex topic with many
						different aspects to consider. Below are some of the
						ways in which ReFi is changing the way that we design
						crypto systems on the social layer for web3.
					</div>
				</div>
				<KeyAspectsSVG />
			</FlexStyled>
		</Wrapper>
	);
};

const FlexStyled = styled(Flex)`
	padding: 40px 0;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const H3Styled = styled(H3)`
	margin-bottom: 31px;
`;

const Wrapper = styled(Lead)`
	max-width: 1180px;
	padding: 40px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
`;

export default KeyAspects;
