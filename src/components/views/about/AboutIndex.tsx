import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {
	H1,
	Lead,
	brandColors,
	P,
	neutralColors,
	D3,
	ButtonLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import links from '@/lib/constants/links';
import { Container } from '@/components/Grid';
import { mediaQueries } from '@/lib/constants/constants';
import Routes from '@/lib/constants/Routes';
import ExternalLink from '@/components/ExternalLink';
import InternalLink from '@/components/InternalLink';
import { Arc } from '@/components/styled-components/Arc';
import FlowerIcon from '/public/images/flower.svg';
import AboutMission from './AboutMission';

const tabTitles = ['Mission & Vision', 'History', 'Team'];

const AboutHistory = dynamic(() => import('./AboutHistory'));
const AboutTeam = dynamic(() => import('./AboutTeam'));

const AboutIndex = () => {
	const [activeTab, setActiveTab] = useState(tabTitles[0]);

	return (
		<>
			<Upper>
				<TeamImageWrapper>
					<Image
						src={'/images/giveth-team-new.png'}
						width='100%'
						height='45vh'
						layout='responsive'
						alt='giveth team'
					/>
				</TeamImageWrapper>
				<Container>
					<UpperTitle>Building the Future of Giving</UpperTitle>
					<UpperCaption>
						Giveth is a community focused on Building the Future of
						Giving using blockchain technology. Our vision is to
						make giving effortless, to reward people all over the
						world for creating positive change.
					</UpperCaption>
					<Link href={links.SUPPORT_US} passHref>
						<UpperButton label='SUPPORT GIVETH' />
					</Link>
				</Container>
			</Upper>

			<Middle>
				<Flower>
					<Image src={FlowerIcon} alt='flower icon' />
				</Flower>
				<MiddleBody>
					<H1>About us</H1>
					<br />
					<Lead>
						Giveth is a community focused on Building the Future of
						Giving using blockchain technology. Our intention is to
						support and reward the funding of public goods by
						creating open, transparent and free access to the
						revolutionary funding opportunities available within the
						Ethereum ecosystem.
					</Lead>
					<br />
					<Lead>
						Giveth is building a culture of giving that empowers and
						rewards those who give -- to projects, to society, and
						to the world. We aim to inspire our community to
						participate in an ecosystem of collective support,
						abundance and value-creation. Check out our{' '}
						<ExternalLink title='Calendar' href={links.CALENDAR} />{' '}
						and{' '}
						<InternalLink href={Routes.Join} title='Join Page' /> to
						get more involved.
					</Lead>
				</MiddleBody>
			</Middle>

			<End>
				<HideContainer>
					<EndMustardArc />
					<EndPurpleArc />
				</HideContainer>
				<Tabs>
					{tabTitles.map(i => (
						<TabItem
							onClick={() => setActiveTab(i)}
							className={activeTab === i ? 'active' : ''}
							key={i}
						>
							{i}
						</TabItem>
					))}
				</Tabs>
				<TabContent>
					{activeTab === tabTitles[0] && <AboutMission />}
				</TabContent>
				<TabContent>
					{activeTab === tabTitles[1] && <AboutHistory />}
				</TabContent>
				<TabContent>
					{activeTab === tabTitles[2] && <AboutTeam />}
				</TabContent>
			</End>
		</>
	);
};

const TeamImageWrapper = styled.div`
	margin-top: 120px;
`;

const TabContent = styled.div`
	margin-top: 90px;
	color: ${brandColors.giv[700]};
`;

const TabItem = styled(P)`
	background: white;
	border-radius: 54px;
	min-width: 200px;
	height: 45px;
	color: ${brandColors.deep[500]};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&.active {
		background: ${brandColors.giv[600]};
		color: white;
	}
`;

const Tabs = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	overflow-x: auto;
	gap: 8px;

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
`;

const EndPurpleArc = styled(Arc)`
	border-width: 40px;
	border-color: ${brandColors.giv[600]} ${brandColors.giv[600]} transparent
		transparent;
	bottom: 0;
	left: -180px;
	width: 260px;
	height: 260px;
	transform: rotate(45deg);
	z-index: 0;
`;

const EndMustardArc = styled(Arc)`
	border-width: 40px;
	border-color: ${`transparent transparent ${brandColors.mustard[500]} ${brandColors.mustard[500]}`};
	top: 300px;
	right: -130px;
	width: 260px;
	height: 260px;
	transform: rotate(45deg);
	z-index: 0;
`;

const End = styled.div`
	background-image: url('/images/curves_about_us.svg');
	overflow: hidden;
	position: relative;
	padding: 72px 18px;

	${mediaQueries.tablet} {
		padding: 90px 150px;
	}
`;

const Flower = styled.div`
	position: absolute;
	margin-top: 5px;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	display: none;

	${mediaQueries.tablet} {
		display: unset;
	}
`;

const MiddleBody = styled.div`
	max-width: 800px;
	position: relative;
	a {
		color: ${brandColors.mustard[500]};
	}
`;

const Middle = styled.div`
	position: relative;
	background: ${brandColors.giv[500]};
	color: white;
	padding: 72px 18px;

	${mediaQueries.tablet} {
		padding: 135px 240px 135px 135px;
	}
`;

const UpperButton = styled(ButtonLink)`
	margin: 50px auto 180px auto;
	width: fit-content;
`;

const UpperCaption = styled(Lead)`
	color: ${neutralColors.gray[900]};
	text-align: center;
	max-width: 950px;
	margin: 0 auto;
`;

const UpperTitle = styled(D3)`
	margin-top: 120px;
	margin-bottom: 32px;
	text-align: center;
	color: ${brandColors.giv[700]};
`;

const Upper = styled.div`
	background-image: url('/images/GIV_light.svg');
	overflow: hidden;
	position: relative;
`;

const HideContainer = styled.div`
	display: none;

	${mediaQueries.laptopS} {
		display: unset;
	}
`;

export default AboutIndex;
