import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Row, Col } from '@giveth/ui-design-system';
import Routes, { profileTabs } from '@/lib/constants/Routes';
import {
	IGsDataBox,
	GsButton,
} from '@/components/GIVeconomyPages/GIVstream.sc';

const GivEconomyProjectCards = () => {
	const { formatMessage } = useIntl();
	return (
		<Row>
			<Col xs={12} sm={6} md={4}>
				<IGsDataBox
					title='GIVbacks'
					button={
						<Link href={Routes.AllProjects}>
							<GsButton
								label={formatMessage({
									id: 'page.home.bigscreen.see_projects',
								})}
								linkType='primary'
								size='medium'
								target='_blank'
							/>
						</Link>
					}
				>
					{formatMessage({
						id: 'label.donate_to_verified_projects_on_giveth',
					})}
				</IGsDataBox>
			</Col>
			<Col xs={12} sm={6} md={4}>
				<IGsDataBox
					title='GIVpower'
					button={
						<GsButton
							isExternal
							label={formatMessage({ id: 'label.see_boosts' })}
							linkType='primary'
							size='medium'
							href={`${Routes.MyAccount}/${profileTabs.givpower}`}
						/>
					}
				>
					{formatMessage({
						id: 'label.lock_giv_to_earn_rewards',
					})}
				</IGsDataBox>
			</Col>
			<Col xs={12} sm={6} md={4}>
				<IGsDataBox
					title='GIVfarm'
					button={
						<Link href={Routes.GIVfarm}>
							<GsButton
								label={formatMessage({
									id: 'label.see_opportunities',
								})}
								linkType='primary'
								size='medium'
							/>
						</Link>
					}
				>
					{formatMessage({
						id: 'label.stake_giv_or_become_a_liquidity_provider',
					})}
				</IGsDataBox>
			</Col>
		</Row>
	);
};

export default GivEconomyProjectCards;
