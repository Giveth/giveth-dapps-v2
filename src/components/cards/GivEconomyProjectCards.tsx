import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Row, Col } from '@giveth/ui-design-system';
import Routes from '@/lib/constants/Routes';
import config from '@/configuration';
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
						<Link href={Routes.Projects}>
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
					title='GIVgarden'
					button={
						<GsButton
							isExternal
							label={formatMessage({ id: 'label.see_proposals' })}
							linkType='primary'
							size='medium'
							href={config.GARDEN_LINK}
							target='_blank'
						/>
					}
				>
					{formatMessage({
						id: 'label.the_givgarden_is_the_descentralized_gov_platform',
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
