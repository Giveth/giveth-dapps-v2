import styled from 'styled-components';
import { brandColors, P } from '@giveth/ui-design-system';
import { FlexCenter } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
const FundraisingBanner = () => {
	return (
		<Wrapper>
			<P>
				<b>Got $GLM?</b> Octant Epoch 2 allocation for GLM stakers is
				open until January 31st! Support Giveth with your rewards
				allocation via the{' '}
			</P>
			<PStyled>
				<ExternalLink href='https://octant.app/projects'>
					<Purple> Octant App. </Purple>
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
