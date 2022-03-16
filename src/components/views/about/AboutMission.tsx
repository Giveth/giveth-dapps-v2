import { H2, Lead, neutralColors, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';

const AboutMission = () => {
	return (
		<>
			<MissionVision>
				<MissionItem>
					<H2>Our Mission</H2>
					<Lead color={neutralColors.gray[900]}>
						To build a culture of giving that rewards and empowers
						those who give - to projects, to society, and to the
						world.
					</Lead>
				</MissionItem>
				<MissionItem>
					<H2>Our Vision</H2>
					<Lead color={neutralColors.gray[900]}>
						Giving is effortless and people all around the world are
						rewarded for creating positive change.
					</Lead>
				</MissionItem>
			</MissionVision>

			<ValuesItem>
				<H2>Our Values</H2>
			</ValuesItem>
			<ValuesItem>
				<H5 className='mb-3'>Giveth encourages Decentralization:</H5>
				<ul>
					<ListItem>
						Giveth offers innovative open-source solutions built on
						blockchain technology, which is inherently
						decentralized.
					</ListItem>
					<ListItem>
						Giveth is pioneering and experimenting with
						decentralized governance and communication techniques
						and supporting their adoption by other communities.
					</ListItem>
				</ul>
			</ValuesItem>
			<ValuesItem>
				<H5 className='mb-3'>Giveth promotes Altruism:</H5>
				<ul>
					<ListItem>
						Giveth is an open, non-hierarchical global initiative
						empowering social, environmental and humanistic impact
						projects with modern technologies.
					</ListItem>
					<ListItem>
						Giveth supports many like-minded initiatives that are
						adding value to the world without necessarily having a
						direct profit motive.
					</ListItem>
					<ListItem>
						Giveth is building a self-sustaining giving economy that
						encourages and rewards altruistic intention.
					</ListItem>
				</ul>
			</ValuesItem>
			<ValuesItem>
				<H5 className='mb-3'>Giveth builds Community:</H5>
				<ul>
					<ListItem>
						Giveth is an inclusive community united around a common
						goal.
					</ListItem>
					<ListItem>
						Giveth is a community-owned platform, building and
						developing our DApps based on feedback from our members.
					</ListItem>
					<ListItem>
						Giveth enables trust within communities by increasing
						transparency and accountability through blockchain.
						technology
					</ListItem>
					<ListItem>
						Giveth proactively reaches out to similar initiatives
						which we see as potential collaborators, as opposed to
						competitors.
					</ListItem>
				</ul>
			</ValuesItem>
		</>
	);
};

const ListItem = styled.li`
	font-size: 20px;
	line-height: 30px;
`;

const ValuesItem = styled.div`
	margin-bottom: 48px;
`;

const MissionItem = styled.div`
	max-width: 400px;
`;

const MissionVision = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 75px 220px;
	margin-bottom: 75px;
`;

export default AboutMission;
