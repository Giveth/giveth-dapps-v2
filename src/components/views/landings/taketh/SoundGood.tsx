import { brandColors, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	H3Styled,
	Wrapper,
} from '@/components/views/landings/taketh/common.styled';
import QuarterArc from '@/components/particles/QuarterArc';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';

const SoundGood = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<H3Styled weight={700}>Sound Good?</H3Styled>
				<Lead size='large'>
					If this doesn’t sound like the world you want to live in,
					then you’re always welcome to go back to{' '}
					<ExternalLink
						color={brandColors.pinky[500]}
						href={Routes.Projects}
						title='Giveth'
					/>{' '}
					and support the mission to Build the Future of Giving while
					donating to projects with zero fees and actually getting
					rewarded for it with GIV tokens. The choice is yours.
				</Lead>
				<ArcWrapper>
					<QuarterArc color={brandColors.mustard[500]} />
				</ArcWrapper>
			</InnerWrapper>
		</Wrapper>
	);
};

const ArcWrapper = styled.div`
	position: absolute;
	left: -15px;
	top: -5px;
`;

const InnerWrapper = styled.div`
	position: relative;
	padding: 10px;
`;

export default SoundGood;
