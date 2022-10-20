import styled from 'styled-components';
import Link from 'next/link';
import { D3, GLink, Lead, brandColors } from '@giveth/ui-design-system';
import { Arc } from '@/components/styled-components/Arc';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

import { useIntl } from 'react-intl';
import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { mediaQueries } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import { Col, Container } from '@/components/Grid';

const HomePurpleSection = () => {
	const { formatMessage } = useIntl();
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
					<GLink href={links.NICE_DOC} target='_blank'>
						<span>
							{formatMessage({ id: 'page.home.nice_learn' })}
						</span>
					</GLink>
					<Link href={Routes.GivethProject} passHref>
						{formatMessage({ id: 'page.home.nice_donate' })}
					</Link>
					<PurpleLink href={links.SWAG} target='_blank'>
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
		background-image: url('/images/backgrounds/GIVGIVGIV.png');
		opacity: 0.1;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		position: absolute;
		z-index: -1;
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
