import {
	brandColors,
	Button,
	H3,
	Lead,
	mediaQueries,
	FlexCenter,
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
	right: 3.125rem;
	bottom: 12.5rem;
`;

const Wrapper = styled.div`
	position: relative;
	overflow: hidden;
`;

const Wave2Wrapper = styled.div`
	position: absolute;
	bottom: 18.75rem;
	right: -70px;
`;

const ButtonWrapper = styled(FlexCenter)`
	button {
		padding-right: 3.75rem;
		padding-left: 3.75rem;
	}
`;

const StepsWrapper = styled.div`
	margin: 4rem 0;
	${mediaQueries.laptopS} {
		margin: 4rem;
	}
`;

const WaveWrapper = styled.div`
	position: absolute;
	top: 15rem;
	left: 0;
	opacity: 0.4;
`;

const PlusWrapper = styled.div`
	position: absolute;
	top: 5.625rem;
	right: 3.75rem;
	display: none;
	${mediaQueries.desktop} {
		display: block;
	}
`;

const OnboardingWrapperStyled = styled(OnboardingWrapper)`
	margin: 3.75rem auto 25px;
	position: relative;
	z-index: 1;
	> h3:first-child {
		margin-bottom: 2.5rem;
	}
`;

export default MainContentCreator;
