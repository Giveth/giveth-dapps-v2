import Image from 'next/image';
import { Shadow } from '@/components/styled-components/Shadow';
import { H4, P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

const PartnershipsCard = (props: {
	content: { icon: string; title: string; description: string };
}) => {
	const { icon, title, description } = props.content;
	return (
		<Wrapper>
			<IconContainer>
				<Image src={icon} alt={title} />
			</IconContainer>
			<Title>{title}</Title>
			<Caption>{description}</Caption>
		</Wrapper>
	);
};

const Title = styled(H4)`
	line-height: 35px;
`;

const Caption = styled(P)`
	color: ${brandColors.giv[800]};
	margin-top: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
`;

const IconContainer = styled.div`
	margin-bottom: 35px;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 326px;
	height: 393px;
	color: ${brandColors.deep[800]};
	background: white;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[500]};
	padding: 70px 35px 40px 35px;
`;

export default PartnershipsCard;
