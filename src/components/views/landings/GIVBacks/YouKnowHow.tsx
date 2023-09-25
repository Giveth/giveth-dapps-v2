import styled from 'styled-components';
import {
	brandColors,
	H4,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import Wave from '@/components/particles/Wave';
import QuarterCircle from '@/components/particles/QuarterCircle';
import Plus from '@/components/particles/Plus';

const YouKnowHow = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<H4>
					You know how charities usually have these amazing projects,
					but they're always struggling to get funds? And donors,
					well, they mostly just get a pat on the back. Doesn't that
					feel a bit off to you? We think it's high time we shake
					things up a bit!
					<br />
					<br />
					In a world where acts of kindness often go unnoticed, Giveth
					introduces GIVbacks - where your generosity doesn’t just
					create impact, but rewards you in return. The Giveth mission
					is to reward & empower those who give — to projects, to
					society, and to the world. With GIVbacks, we’re rewarding
					givers by giving GIV to donors to verified projects on
					Giveth.
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
	${mediaQueries.laptopL} {
		display: block;
	}
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
	${mediaQueries.laptopL} {
		display: block;
	}
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

export default YouKnowHow;
