import styled from 'styled-components';
import {
	brandColors,
	D2,
	H3,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { Wrapper } from '@/components/views/landings/taketh/common.styled';
import Wave from '@/components/particles/Wave';
import QuarterCircle from '@/components/particles/QuarterCircle';
import CircleArc from '@/components/particles/CircleArc';

const HowDoesItWork = () => {
	return (
		<OuterWrapper>
			<WrapperStyled>
				<H3 weight={700}>How Does it Work?</H3>
				{numberedList.map(item => (
					<NumberedItem key={item.number} {...item} />
				))}
			</WrapperStyled>
			<WavePink>
				<Wave color={brandColors.pinky[200]} />
			</WavePink>
			<WavePurple>
				<Wave color={brandColors.giv[500]} />
			</WavePurple>
		</OuterWrapper>
	);
};

const numberedList = [
	{
		number: 1,
		text: 'Taketh will allow private goods projects to list themselves on our platform (for a small fee of $10,000), and 99% of all fees will go to the Taketh treasury (audited in the Bahamas, fully off-chain).',
	},
	{
		number: 2,
		text: 'Projects can then choose to essentially "pay to play" by buying the algorithmically unstable Taketh token to unlock their "donations".',
	},
	{
		number: 3,
		text: 'Taketh is also planning to launch (in Q4 2034) a metaverse game that will allow you to stake Taketh tokens in our Blackbox™ to hatch NFTs that may or may not double your rewards (think Crypto Zoo mixed with Pixelmon).',
	},
];

const NumberedItem = (props: { number: number; text: string }) => {
	const { number, text } = props;
	return (
		<NumberedItemWrapper>
			<Number>{number}</Number>
			<Text size='large'>{text}</Text>
			{number === 3 && (
				<>
					<QuarterCircleWrapper>
						<QuarterCircle />
					</QuarterCircleWrapper>
					<ArcWrapper>
						<CircleArc />
					</ArcWrapper>
				</>
			)}
		</NumberedItemWrapper>
	);
};

const Number = styled(D2)`
	color: ${brandColors.giv[500]};
	align-self: flex-start;
`;

const Text = styled(Lead)`
	color: ${neutralColors.gray[900]};
`;

const NumberedItemWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 40px 0;
	position: relative;
`;

const WavePink = styled.div`
	position: absolute;
	left: -50px;
	top: 0;
`;

const WavePurple = styled.div`
	position: absolute;
	right: -80px;
	bottom: 0;
`;

const QuarterCircleWrapper = styled.div`
	position: absolute;
	right: 0;
	top: -20px;
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const ArcWrapper = styled.div`
	position: absolute;
	left: 470px;
	bottom: 0;
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const WrapperStyled = styled(Wrapper)`
	margin: 40px auto 0;
`;

const OuterWrapper = styled.div`
	overflow: hidden;
	position: relative;
	margin: 80px 0;
`;

export default HowDoesItWork;
