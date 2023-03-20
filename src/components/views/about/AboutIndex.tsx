import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useIntl } from 'react-intl';
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

import { Container } from '@giveth/ui-design-system';
import links from '@/lib/constants/links';
import { mediaQueries } from '@/lib/constants/constants';
import Routes from '@/lib/constants/Routes';
import ExternalLink from '@/components/ExternalLink';
import InternalLink from '@/components/InternalLink';
import { Arc } from '@/components/styled-components/Arc';
import FlowerIcon from '/public/images/flower.svg';
import AboutMission from './AboutMission';

const AboutHistory = dynamic(() => import('./AboutHistory'));
const AboutTeam = dynamic(() => import('./AboutTeam'));

const AboutIndex = () => {
	const { formatMessage } = useIntl();
	const tabTitles = [
		formatMessage({ id: 'label.mission_vission' }),
		formatMessage({ id: 'label.history' }),
		formatMessage({ id: 'label.team' }),
	];
	const [activeTab, setActiveTab] = useState(tabTitles[0]);
	return (
		<>
			<Upper>
				<TeamImageWrapper>
					<img
						src={'/images/giveth-team-new.webp'}
						alt='giveth team'
						style={{ width: '100%' }}
					/>
				</TeamImageWrapper>
				<Container>
					<UpperTitle>
						{formatMessage({
							id: 'label.building_the_future_of_giving',
						})}
					</UpperTitle>
					<UpperCaption>
						{formatMessage({ id: 'page.about.desc' })}
					</UpperCaption>
					<Link href={links.SUPPORT_US}>
						<SupportGivethButton
							linkType='primary'
							label={formatMessage({
								id: 'label.support_giveth',
							})}
							size='large'
						/>
					</Link>
				</Container>
			</Upper>

			<Middle>
				<Flower>
					<Image src={FlowerIcon} alt='flower icon' />
				</Flower>
				<MiddleBody>
					<H1>{formatMessage({ id: 'component.title.about_us' })}</H1>
					<br />
					<Lead>
						{formatMessage({ id: 'page.about_us.desc.one' })}
					</Lead>
					<br />
					<Lead>
						{formatMessage({ id: 'page.about_us.desc.two' })}{' '}
						<ExternalLink
							title={formatMessage({ id: 'label.calendar' })}
							href={links.CALENDAR}
						/>{' '}
						{formatMessage({ id: 'label.and' })}{' '}
						<InternalLink
							href={Routes.Join}
							title={formatMessage({ id: 'label.join_page' })}
						/>{' '}
						{formatMessage({ id: 'label.to_get_more_involved' })}
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

const SupportGivethButton = styled(ButtonLink)`
	margin: 50px auto 180px;
	width: 290px;
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
