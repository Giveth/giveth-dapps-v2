import {
	brandColors,
	Button,
	H3,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import { Relative } from '@/components/styled-components/Position';
import Plus from '@/components/particles/Plus';
import Wave from '@/components/particles/Wave';
import VerticalNumberedStepsAlt from '@/components/VerticalNumberedStepsAlt';
import projectOwnerSteps from '@/components/views/landings/onboarding/project-owner/projectOwnerSteps';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';

const BecomeProjectOwner = () => {
	return (
		<Relative>
			<OnboardingWrapperStyled>
				<H3 weight={700}>Become a project Owner on Giveth</H3>
				<Lead size='large'>
					We may be biased, but we really believe that Giveth is the
					best donation platform in the world. When you raise funds
					for your project on Giveth, you receive 100% of every cent
					that was donated to you since Giveth takes zero fees. Not
					only that, but you can also earn rewards when you refer
					others to donate on Giveth! Check out our resources below to
					learn how to quickly and easily launch your project on
					Giveth and join us in the Future of Giving
				</Lead>
				<StepsWrapper>
					<VerticalNumberedStepsAlt inputArray={projectOwnerSteps} />
				</StepsWrapper>
				<ButtonWrapper>
					<ExternalLink href={Routes.CreateProject}>
						<Button
							size='large'
							buttonType='primary'
							label='CREATE PROJECT'
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
		</Relative>
	);
};

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

export default BecomeProjectOwner;
