import VerificationBadge from '@/components/badges/VerificationBadge';
import { isNoImg, noImgColor, noImgIcon } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import { P, brandColors, H3 } from '@giveth/ui-design-system';
import styled from 'styled-components';

const ProjectHeader = (props: { project: IProject }) => {
	const { title, verified, image, adminUser, traceCampaignId } =
		props.project;
	const name = adminUser?.name;
	const traceable = !!traceCampaignId;

	return (
		<Wrapper image={image}>
			<BadgeSection>
				{verified && <VerificationBadge verified />}
				{traceable && <VerificationBadge trace />}
			</BadgeSection>
			<TitleSection>
				<Title>{title}</Title>
				<Author>{name}</Author>
			</TitleSection>
		</Wrapper>
	);
};

const Wrapper = styled.div<{ image: string | undefined }>`
	background: ${props => (isNoImg(props.image) ? noImgColor() : 'unset')};
	background-repeat: ${props =>
		isNoImg(props.image) ? 'repeat' : 'no-repeat'};
	background-size: ${props => (isNoImg(props.image) ? 'unset' : 'cover')};
	background-image: ${props =>
		`url(${isNoImg(props.image) ? noImgIcon : props.image})`};
	height: 360px;
	border-radius: 12px;
	overflow: hidden;
`;

const BadgeSection = styled.div`
	height: 50%;
	display: flex;
	padding: 27px;
`;

const Title = styled(H3)`
	color: white;
	max-width: 770px;
`;

const Author = styled(P)`
	color: ${brandColors.pinky[500]};
`;

const TitleSection = styled.div`
	height: 50%;
	padding: 35px 27px;
	display: flex;
	flex-direction: column;
	justify-content: end;
	background: linear-gradient(0deg, #0a1444 4.69%, rgba(29, 30, 31, 0) 100%);
`;

export default ProjectHeader;
