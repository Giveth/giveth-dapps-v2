import { useState } from 'react';
import { FlexCenter } from '../../styled-components/Flex';
import styled from 'styled-components';
import {
	brandColors,
	ButtonLink,
	H3,
	H4,
	Lead,
} from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import links from '@/lib/constants/links';

const AboutHistory = () => {
	const [sliderSection, setSliderSection] = useState<number>(0);

	return (
		<>
			<Upper>
				<Rect>
					<span>Giveth</span> was founded in 2016 and provided value
					to the Blockchain4Good ecosystem for 5 years, funded solely
					by donations.
				</Rect>
				<UpperText>
					The launch of the <span>GIVeconomy</span> in December 2021
					provided a new way to fund our initiatives to evolve
					philanthropy.
				</UpperText>
			</Upper>
			<End>
				{sliderContent.map((elem, index) => (
					<SliderTextSection
						key={`slider-content-${index}`}
						active={sliderSection === index}
					>
						<Title>{elem.title}</Title>
						<Lead>{elem.body}</Lead>
					</SliderTextSection>
				))}

				<SliderButtons>
					{sliderContent.map((elem, index) => (
						<SliderButton
							key={`slider-button-${index}`}
							active={sliderSection === index}
							onClick={() => setSliderSection(index)}
						/>
					))}
				</SliderButtons>
			</End>
		</>
	);
};

const SliderButton = styled.div<{ active: boolean }>`
	border-radius: 50%;
	width: 23px;
	height: 23px;
	cursor: pointer;
	border: 2px solid ${brandColors.giv[500]};
	background: ${props =>
		props.active ? brandColors.giv[500] : 'transparent'};
`;

const SliderButtons = styled(FlexCenter)`
	gap: 13px;
	margin: 66px auto 0 auto;
`;

const SliderTextSection = styled.div<{ active: boolean }>`
	display: ${props => (props.active ? 'flex' : 'none')};
	flex-direction: column;
	place-items: center;
	min-height: 170px;

	${mediaQueries.mobileS} {
		min-height: 390px;
	}
`;

const ReadMoreButton = styled(ButtonLink)`
	background-color: ${brandColors.pinky[500]};
	margin-top: 32px;

	&:hover {
		background-color: ${brandColors.pinky[500]}80;
	}
`;

const Title = styled(H3)`
	margin-bottom: 24px;
`;

const End = styled.div`
	text-align: center;
	max-width: 840px;
	margin: 134px auto 0 auto;

	${mediaQueries.mobileS} {
		margin-top: 72px;
	}
`;

const Rect = styled(H4)`
	padding: 48px;
	background: ${brandColors.giv[500]};
	color: white;
	max-width: 530px;
	border-radius: 12px;

	span {
		color: ${brandColors.mustard[500]};
	}
`;

const UpperText = styled(Rect)`
	color: ${brandColors.giv[900]};
	background: ${brandColors.mustard[500]};
	position: relative;

	span {
		color: ${brandColors.giv[500]};
	}
`;

const Upper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 25px 50px;
`;

const sliderContent = [
	{
		title: 'Rising out of the ashes of TheDAO',
		body: 'The Giveth founding team was a group of altruistic whitehat hackers who set out to build systems to turn non-profits into DAOs of their own, starting with platforms for P2P giving on the blockchain.',
	},
	{
		title: 'Starting with traceable donations',
		body: 'After writing and open-sourcing innovative smart contracts like the MiniMe token, the team launched the first Giveth DApp, now called Giveth TRACE, to enable a traceable & accountable donations to for-good Campaigns.',
	},
	{
		title: 'And now... the GIVeconomy',
		body: 'Building on that foundation and heaven-bent on using blockchain to fund public goods regeneratively, we created the GIVeconomy. Fueled by GIV, the GIVeconomy is rewarding & empowering all who give.',
	},
	{
		title: 'Take a dive into the History of Giveth',
		body: (
			<ReadMoreButton
				href={links.HISTORY}
				target='_blank'
				label='READ MORE'
			/>
		),
	},
];

export default AboutHistory;
