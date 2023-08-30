import styled from 'styled-components';
import {
	brandColors,
	Button,
	H3,
	IconArrowRight32,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';
import Divider from '@/components/Divider';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IOnboardingCard {
	icon: JSX.Element;
	title: string;
	description: string;
	buttonText: string;
	buttonLink: string;
}

const OnboardingCard = (props: IOnboardingCard) => {
	const { icon, title, description, buttonText, buttonLink } = props;
	return (
		<Wrapper>
			{icon}
			<H3 weight={700}>{title}</H3>
			<Divider color={neutralColors.gray[300]} height='1px' />
			<Lead size='medium'>{description}</Lead>
			<ExternalLink href={buttonLink} color={brandColors.pinky[500]}>
				<ButtonStyled
					label={buttonText}
					buttonType='texty-primary'
					icon={<IconArrowRight32 />}
				/>
			</ExternalLink>
		</Wrapper>
	);
};

const ButtonStyled = styled(Button)`
	padding-left: 0;
	padding-right: 0;
`;

const Wrapper = styled(FlexCenter)`
	box-shadow: ${Shadow.Neutral[400]};
	border-radius: 12px;
	background: ${neutralColors.gray[100]};
	padding: 32px 16px;
	flex-direction: column;
	text-align: center;
	gap: 16px;
	max-width: 450px;
	flex: 1 1 0px;
	${mediaQueries.tablet} {
		padding: 32px;
	}
`;

export default OnboardingCard;
