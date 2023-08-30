import styled from 'styled-components';
import {
	H3,
	IconBulbOutline32,
	IconGift32,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common.styled';
import Routes from '@/lib/constants/Routes';
import OnboardingCard from '@/components/OnboardingCard';
import { FlexCenter } from '@/components/styled-components/Flex';

const ExploringMore = () => {
	return (
		<OnboardingWrapperStyled>
			<H3 weight={700}>Exploring more as a</H3>
			<Cards>
				{cardsArray.map(i => (
					<OnboardingCard key={i.title} {...i} />
				))}
			</Cards>
		</OnboardingWrapperStyled>
	);
};

const cardsArray = [
	{
		icon: <IconBulbOutline32 />,
		title: 'Project Owner',
		description:
			'Learn how to create a project, promote it and raise donations.',
		buttonText: 'Learn how you can start',
		buttonLink: Routes.OnboardingProjects,
	},
	{
		icon: <IconGift32 />,
		title: 'Donor',
		description: 'See how Giveth works for donors and it’s benefits.',
		buttonText: 'See how it works',
		buttonLink: Routes.OnboardingDonors,
	},
];

const Cards = styled(FlexCenter)`
	margin: 60px 0 0;
	gap: 32px;
	${mediaQueries.tablet} {
		gap: 16px;
	}
	${mediaQueries.laptopS} {
		gap: 80px;
	}
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const OnboardingWrapperStyled = styled(OnboardingWrapper)`
	padding-top: 48px;
	padding-bottom: 93px;
	text-align: center;
	> h3:first-child {
		color: ${neutralColors.gray[700]};
	}
`;

export default ExploringMore;
