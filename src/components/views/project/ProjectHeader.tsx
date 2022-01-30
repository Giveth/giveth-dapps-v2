import { useEffect, useRef, useState } from 'react';
import VerificationBadge from '@/components/badges/VerificationBadge';
import { isNoImg, noImgColor, noImgIcon, mediaQueries } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import { P, brandColors, H3, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

const ProjectHeader = (props: { project: IProject }) => {
	const { title, verified, image, adminUser, traceCampaignId } =
		props.project;

	const [adjustTitle, setAdjustTitle] = useState<boolean>(false);
	const name = adminUser?.name;
	const traceable = !!traceCampaignId;

	const containerRef = useRef(null);
	const intersectOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.45,
	};

	const callbackFunction = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		setAdjustTitle(!entry.isIntersecting);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			callbackFunction,
			intersectOptions,
		);

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			if (containerRef.current) observer.unobserve(containerRef.current);
		};
	}, [containerRef, adjustTitle]);

	return (
		<Wrapper image={image} ref={containerRef}>
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
	height: 312px;
	overflow: hidden;

	${mediaQueries['xl']} {
		position: sticky;
		top: -312px;
		z-index: 10;
		height: 512px;
	}
`;

const TitleSection = styled.div`
	height: 100%;
	padding: 35px 150px;
	display: flex;
	flex-direction: column;
	justify-content: end;
	background: linear-gradient(
		${neutralColors.gray[900]}00,
		${brandColors.giv[900]}
	);
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
