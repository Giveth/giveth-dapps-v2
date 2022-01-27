import { useEffect, useState } from 'react';
import VerificationBadge from '@/components/badges/VerificationBadge';
import { isNoImg, noImgColor, noImgIcon } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import { P, brandColors, H3 } from '@giveth/ui-design-system';
import styled from 'styled-components';

const ProjectHeader = (props: { project: IProject }) => {
	const { title, verified, image, adminUser, traceCampaignId } =
		props.project;

	const [adjustTitle, setAdjustTitle] = useState<boolean>(false);
	const name = adminUser?.name;
	const traceable = !!traceCampaignId;

	useEffect(() => {
		const threshold = 280;
		const updateScrollDir = () => {
			const scrollY = window.pageYOffset;

			if (scrollY > threshold && !adjustTitle) {
				setAdjustTitle(true);
			}
			if (scrollY < threshold) {
				setAdjustTitle(false);
			}
		};

		const onScroll = () => {
			window.requestAnimationFrame(updateScrollDir);
		};

		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, [adjustTitle]);

	return (
		<Wrapper image={image}>
			<TitleSection>
				<BadgeSection>
					{verified && <VerificationBadge verified />}
					{traceable && <VerificationBadge trace />}
				</BadgeSection>
				<Title fixSize={adjustTitle} weight={700}>
					{title}
				</Title>
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
	height: 512px;
	overflow: hidden;
	position: sticky;
	top: -312px;
	z-index: 10;
`;

const TitleSection = styled.div`
	height: 100%;
	padding: 35px 150px;
	display: flex;
	flex-direction: column;
	justify-content: end;
	background: linear-gradient(#1d1e1f00, #0a1444);
`;

const BadgeSection = styled.div`
	align-self: baseline;
`;

const Title = styled(H3)<{ fixSize: boolean }>`
	color: white;
	max-width: 770px;
	font-size: ${props => (props.fixSize ? '18px' : '')};
	margin: ${props => (props.fixSize ? '8px 0px' : '16px 0px')};
`;

const Author = styled(P)`
	color: ${brandColors.pinky[500]};
`;

export default ProjectHeader;
