import styled from 'styled-components';
import { brandColors, H4, neutralColors } from '@giveth/ui-design-system';
import Wave from '@/components/particles/Wave';
import QuarterCircle from '@/components/particles/QuarterCircle';
import Plus from '@/components/particles/Plus';

const GivethTheRevolutionary = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<H4>
					<b>Giveth</b>, the revolutionary crypto fundraising
					platform, embodies
					<b> ReFi</b> by leveraging blockchain technology to empower
					changemakers to contribute to a more equitable and
					sustainable financial system.
				</H4>
			</Wrapper>
			<WaveWrapper>
				<Wave color={brandColors.pinky[500]} />
			</WaveWrapper>
			<ArcWrapper>
				<QuarterCircle color={brandColors.ocean[600]} />
			</ArcWrapper>
			<PlusWrapper>
				<Plus color={brandColors.mustard[500]} />
			</PlusWrapper>
		</OuterWrapper>
	);
};

const PlusWrapper = styled.div`
	position: absolute;
	left: 50px;
	bottom: 60px;
	display: none;
`;

const ArcWrapper = styled.div`
	position: absolute;
	top: 45px;
	left: 250px;
`;

const WaveWrapper = styled.div`
	position: absolute;
	right: 0;
	bottom: 120px;
	display: none;
`;

const OuterWrapper = styled.div`
	position: relative;
`;

const Wrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px 80px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
`;

export default GivethTheRevolutionary;
