import Image from 'next/image';
import { H4, P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { IPartner } from '@/content/Partnerships';
import { mediaQueries } from '@/lib/constants/constants';

const PartnershipsCard = ({ icon, title, description, link }: IPartner) => {
	return (
		<Wrapper href={link} target='_blank' rel='noreferrer'>
			<IconContainer>
				<Image
					src={icon}
					objectFit='contain'
					width={100}
					height={100}
					alt={`${title} logo`}
				/>
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
	max-height: 110px;
`;

const Wrapper = styled.a`
	display: flex;
	flex-direction: column;
	height: 393px;
	color: ${brandColors.deep[800]};
	background: white;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[500]};
	padding: 70px 35px 40px 35px;
	cursor: pointer;
	width: 100%;

	${mediaQueries.tablet} {
		width: 326px;
	}
`;

export default PartnershipsCard;
