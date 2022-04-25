import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import VerificationBadge from '@/components/badges/VerificationBadge';
import { isNoImg, noImgColor, noImgIcon } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import { P, brandColors, H3, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { addressToUserView } from '@/lib/routeCreators';

const ProjectHeader = (props: { project?: IProject }) => {
	const { project } = props;
	const { title, verified, image, adminUser, traceCampaignId } =
		project || {};
	const [adjustTitle, setAdjustTitle] = useState<boolean>(false);
	const containerRef = useRef(null);

	const name = adminUser?.name;
	const traceable = !!traceCampaignId;

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
						{verified && <VerificationBadge verified />}
						{traceable && <VerificationBadge trace />}
					</BadgeSection>
					<Title fixSize={adjustTitle} weight={700}>
						{title}
					</Title>
					<Link
						href={addressToUserView(adminUser?.walletAddress)}
						passHref
					>
						<Author>{name}</Author>
					</Link>
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

	${mediaQueries.mobileS} {
		padding: 0 16px;
	}

	${mediaQueries.tablet} {
		padding: 0 32px;
	}

	${mediaQueries.laptop} {
		padding: 0 40px;
	}

	${mediaQueries.desktop} {
		max-width: 1280px;
	}
`;

const BadgeSection = styled.div`
	align-self: baseline;
`;

const Title = styled(H3)<{ fixSize: boolean }>`
	color: white;
	max-width: 770px;
	font-size: ${props => (props.fixSize ? '18px' : '')};
	margin: ${props => (props.fixSize ? '8px 0' : '16px 0')};
`;

const Author = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default ProjectHeader;
