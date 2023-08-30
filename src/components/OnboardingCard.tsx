import styled from 'styled-components';
import {
	brandColors,
	Button,
	H3,
	IconArrowRight32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';
import Divider from '@/components/Divider';
import ExternalLink from '@/components/ExternalLink';

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
				<Button
					label={buttonText}
					buttonType='texty-primary'
					icon={<IconArrowRight32 />}
				/>
			</ExternalLink>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	box-shadow: ${Shadow.Neutral[400]};
	border-radius: 12px;
	background: ${neutralColors.gray[100]};
	padding: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	max-width: 450px;
	flex: 1 1 0px;
`;

export default OnboardingCard;
