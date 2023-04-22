import { useEffect, useRef, useState } from 'react';
import { brandColors, H3, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import VerificationBadge from '@/components/badges/VerificationBadge';
import { isNoImg, noImgColor, noImgIcon } from '@/lib/helpers';
import { mediaQueries } from '@/lib/constants/constants';
import { useProjectContext } from '@/context/project.context';
import { ProjectOwnerWithPfp } from './ProjectOwnerWithPfp';

const ProjectHeader = () => {
	const { projectData } = useProjectContext();
	const { title, verified, image, adminUser } = projectData || {};
	const [adjustTitle, setAdjustTitle] = useState<boolean>(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const observerHandler = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			setAdjustTitle(!entry.isIntersecting);
		};
		const observer = new IntersectionObserver(observerHandler, {
			root: null,
			rootMargin: '0px',
			threshold: 0.45,
		});

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			if (observer) observer.disconnect();
		};
	}, [containerRef, adjustTitle]);

	return (
		<Wrapper image={image} ref={containerRef}>
			<TitleSection>
				<TitleContainer>
					<BadgeSection>
						{verified && <VerificationBadge />}
					</BadgeSection>
					<Title fixSize={adjustTitle} weight={700}>
						{title}
					</Title>
					<ProjectOwnerWithPfp user={adminUser} />
				</TitleContainer>
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

	${mediaQueries.tablet} {
		position: sticky;
		top: -312px;
		z-index: 10;
		height: 512px;
	}
`;

const TitleSection = styled.div`
	height: 100%;
	padding: 35px 0;
	display: flex;
	background: linear-gradient(
		${neutralColors.gray[900]}00,
		${brandColors.giv[900]}
	);
`;

const TitleContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: end;
	width: 100%;
	margin: 0 auto;
	padding: 0 16px;

	${mediaQueries.tablet} {
		padding: 0 32px;
	}

	${mediaQueries.laptopS} {
		padding: 0 40px;
	}

	${mediaQueries.desktop} {
		max-width: 1280px;
	}
`;

const BadgeSection = styled.div`
	align-self: baseline;
	> :first-child {
		margin-bottom: 3px;
	}
`;

const Title = styled(H3)<{ fixSize: boolean }>`
	color: white;
	max-width: 770px;
	font-size: ${props => (props.fixSize ? '18px' : '')};
	margin: ${props => (props.fixSize ? '8px 0' : '16px 0')};
`;

export default ProjectHeader;
