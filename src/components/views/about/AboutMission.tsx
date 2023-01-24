import { H2, Lead, neutralColors, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

const AboutMission = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<MissionVision>
				<MissionItem>
					<H2>{formatMessage({ id: 'label.our_mission' })}</H2>
					<Lead color={neutralColors.gray[900]}>
						{formatMessage({ id: 'label.our_mission.desc' })}
					</Lead>
				</MissionItem>
				<MissionItem>
					<H2>{formatMessage({ id: 'label.our_vision' })}</H2>
					<Lead color={neutralColors.gray[900]}>
						{formatMessage({ id: 'label.our_vision.desc' })}
					</Lead>
				</MissionItem>
			</MissionVision>

			<ValuesItem>
				<H2>{formatMessage({ id: 'label.our_values' })}</H2>
			</ValuesItem>
			<ValuesItem>
				<H5 className='mb-3'>
					{formatMessage({
						id: 'label.giveth_encourages_decentralization',
					})}
					:
				</H5>
				<ul>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_encourages_decentralization.bullet.one',
						})}
					</ListItem>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_encourages_decentralization.bullet.two',
						})}
					</ListItem>
				</ul>
			</ValuesItem>
			<ValuesItem>
				<H5 className='mb-3'>
					{formatMessage({
						id: 'label.giveth_promotes_altruism',
					})}
					:
				</H5>
				<ul>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_promotes_altruism.bullet.one',
						})}
					</ListItem>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_promotes_altruism.bullet.two',
						})}
					</ListItem>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_promotes_altruism.bullet.three',
						})}
					</ListItem>
				</ul>
			</ValuesItem>
			<ValuesItem>
				<H5 className='mb-3'>
					{formatMessage({ id: 'label.giveth_builds_community' })}:
				</H5>
				<ul>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_builds_community.bullet.one',
						})}
					</ListItem>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_builds_community.bullet.two',
						})}
					</ListItem>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_builds_community.bullet.three',
						})}
					</ListItem>
					<ListItem>
						{formatMessage({
							id: 'label.giveth_builds_community.bullet.four',
						})}
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
