import {
	brandColors,
	Button,
	H3,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import Plus from '@/components/particles/Plus';
import Wave from '@/components/particles/Wave';
import VerticalNumberedStepsAlt, {
	IStepsArray,
} from '@/components/VerticalNumberedStepsAlt';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';
import QuarterCircle from '@/components/particles/QuarterCircle';

interface IMainContentCreator {
	title: string;
	description: string;
	steps: IStepsArray[];
	buttonText: string;
	buttonLink: string;
	firstTitleOnRight?: boolean;
}

const MainContentCreator: FC<IMainContentCreator> = props => {
	const {
		title,
		description,
		steps,
		buttonLink,
		buttonText,
		firstTitleOnRight,
	} = props;
	return (
		<Wrapper>
			<OnboardingWrapperStyled>
				<H3 weight={700}>{title}</H3>
				<Lead size='large'>{description}</Lead>
				<StepsWrapper>
					<VerticalNumberedStepsAlt
						firstTitleOnRight={firstTitleOnRight}
						inputArray={steps}
					/>
				</StepsWrapper>
				<ButtonWrapper>
					<ExternalLink href={buttonLink}>
						<Button
							size='large'
							buttonType='primary'
							label={buttonText}
						/>
					</ExternalLink>
				</ButtonWrapper>
			</OnboardingWrapperStyled>
			<PlusWrapper>
				<Plus color={brandColors.pinky[500]} />
			</PlusWrapper>
			<WaveWrapper>
				<Wave color={brandColors.giv[100]} />
			</WaveWrapper>
			<Wave2Wrapper>
				<Wave color={brandColors.giv[500]} />
			</Wave2Wrapper>
			<ArcWrapper>
				<QuarterCircle color={brandColors.pinky[500]} />
			</ArcWrapper>
		</Wrapper>
	);
};

const ArcWrapper = styled.div`
	position: absolute;
	right: 50px;
	bottom: 200px;
`;

const Wrapper = styled.div`
	position: relative;
	overflow: hidden;
`;

const Wave2Wrapper = styled.div`
	position: absolute;
	bottom: 300px;
	right: -70px;
`;

const ButtonWrapper = styled(FlexCenter)`
	button {
		padding-right: 60px;
		padding-left: 60px;
	}
`;

const StepsWrapper = styled.div`
	margin: 64px 0;
	${mediaQueries.laptopS} {
		margin: 64px;
	}
`;

const WaveWrapper = styled.div`
	position: absolute;
	top: 240px;
	left: 0;
	opacity: 0.4;
`;

const PlusWrapper = styled.div`
	position: absolute;
	top: 90px;
	right: 60px;
	display: none;
	${mediaQueries.desktop} {
		display: block;
	}
`;

const OnboardingWrapperStyled = styled(OnboardingWrapper)`
	margin: 60px auto 25px;
	position: relative;
	z-index: 1;
	> h3:first-child {
		margin-bottom: 40px;
	}
`;

export default MainContentCreator;
