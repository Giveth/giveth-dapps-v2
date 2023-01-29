import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { D3, GLink, Lead, brandColors } from '@giveth/ui-design-system';
import { Arc } from '@/components/styled-components/Arc';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { mediaQueries } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import { Col, Container } from '@/components/Grid';
import useDetectDevice from '@/hooks/useDetectDevice';

const HomePurpleSection = () => {
	const { formatMessage } = useIntl();

	// replacing this by the gitcoin alpha round for now
	const { isMobile } = useDetectDevice();
	const gitcoinGrantAlpha =
		'https://grant-explorer.gitcoin.co/#/round/1/0xd95a1969c41112cee9a2c931e849bcef36a16f4c/0xb746c0f648f9b930ea4568cf8741067a7fc7eb3928ac13cced8076212cf3cf37-0xd95a1969c41112cee9a2c931e849bcef36a16f4c';
	return (
		<GitcoinContainer>
			<Link href={'/gitcoingrants'}>
				<img
					alt='gitcoin alpha is here'
					src={
						isMobile
							? '/images/banners/gitcoin-alpha-banner_2_mobile.png'
							: '/images/banners/gitcoin-alpha-banner_3.png'
					}
				/>
			</Link>
		</GitcoinContainer>
	);

	return (
		<Wrapper>
			<Arcs>
				<ArcPurple />
				<ArcMustard />
				<DotMustard />
			</Arcs>
			<Container>
				<BigTitle>
					Feeling $nice?{' '}
					<NiceImg
						src='/images/$nice.svg'
						alt='nice icon'
						width={101.71}
						height={101.71}
					/>
				</BigTitle>
				<Desc>{formatMessage({ id: 'page.home.nice_desc' })}</Desc>
				<Links xs={12} sm={7} md={8}>
					<GLink as='a' href={links.NICE_DOC} target='_blank'>
						<span>
							{formatMessage({ id: 'page.home.nice_learn' })}
						</span>
					</GLink>
					<Link href={Routes.GivethProject}>
						{formatMessage({ id: 'page.home.nice_donate' })}
					</Link>
					<PurpleLink as='a' href={links.SWAG} target='_blank'>
						<span>
							{formatMessage({ id: 'page.home.nice_swag' })}
						</span>
					</PurpleLink>
				</Links>
			</Container>
		</Wrapper>
	);
};

const Wrapper = styled(HomeContainer)`
	min-height: 600px;
	margin: 0 32px;
	border-radius: 12px;
	background: white;
	padding-top: 90px;
	position: relative;
	z-index: 2;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	top: -50px;
	::after {
		content: '';
		background-image: url('/images/banners/gitcoin-alpha-bannerV.png');
		opacity: 0.1;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		position: absolute;
		z-index: -1;
	}
`;

const GitcoinContainer = styled.div`
	display: flex;
	position: relative;
	cursor: pointer;
	border-radius: 12px;
	flex-direction: column;
	align-items: center;
	margin: 64px 32px;

	img {
		max-width: 100%;
		border-radius: 12px;
	}

	${mediaQueries.laptopS} {
		img {
			max-width: 1080px;
		}
	}
`;

const BigTitle = styled(D3)`
	color: ${brandColors.giv[500]};
	margin: 0 0 40px 0;
`;

const NiceImg = styled.img`
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const Desc = styled(Lead)`
	font-size: 24px;
	max-width: 788px;
	color: ${brandColors.giv[500]};
`;

const ArcPurple = styled(Arc)`
	border-width: 132px;
	border-color: transparent transparent ${brandColors.giv[500]} transparent;
	transform: rotate(222deg);
	width: 675px;
	height: 675px;
	bottom: -360px;
	left: -200px;
	opacity: 0.1;
`;

const ArcMustard = styled(Arc)`
	border-width: 132px;
	border-color: transparent transparent ${brandColors.mustard[500]}
		transparent;
	top: -150px;
	right: -300px;
	width: 675px;
	height: 675px;
	transform: rotate(31deg);
`;

const DotMustard = styled(Arc)`
	border-width: 71px;
	border-color: ${brandColors.mustard[500]};
	top: 60px;
	right: 250px;
	width: 142px;
	height: 142px;
`;

const Arcs = styled.div`
	display: none;

	${mediaQueries.tablet} {
		display: unset;
	}
`;

const Links = styled(Col)`
	display: flex;
	flex-direction: column;
	margin: 24px 0 0 0;
	* {
		font-size: 16px;
		line-height: 21px;
		font-weight: 400;
		cursor: pointer;
		color: ${brandColors.pinky[500]};
		margin: 0 0 16px 0;
	}
`;

const PurpleLink = styled(GLink)`
	* {
		color: ${brandColors.giv[300]};
	}
`;

export default HomePurpleSection;
