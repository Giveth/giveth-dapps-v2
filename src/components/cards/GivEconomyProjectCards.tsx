import Link from 'next/link';
import { Row, Col } from '@/components/Grid';
import Routes from '@/lib/constants/Routes';
import { GsButton, IGsDataBox } from '../homeTabs/GIVstream.sc';
import config from '@/configuration';

const GivEconomyProjectCards = () => {
	return (
		<Row>
			<Col xs={12} sm={6} md={4}>
				<IGsDataBox
					title='GIVbacks'
					button={
						<GsButton
							label='SEE PROJECTS'
							linkType='primary'
							size='medium'
							href={Routes.Projects}
							target='_blank'
						/>
					}
				>
					Donate to verified projects on Giveth. Get GIV and increase
					your GIVstream with the GIVbacks program.
				</IGsDataBox>
			</Col>
			<Col xs={12} sm={6} md={4}>
				<IGsDataBox
					title='GIVgarden'
					button={
						<GsButton
							label='SEE PROPOSALS'
							linkType='primary'
							size='medium'
							href={config.GARDEN_LINK}
							target='_blank'
						/>
					}
				>
					The GIVgarden is the decentralized governance platform for
					the GIVeconomy. Increase your GIVstream when you wrap GIV to
					vote.
				</IGsDataBox>
			</Col>
			<Col xs={12} sm={6} md={4}>
				<IGsDataBox
					title='GIVfarm'
					button={
						<Link href={Routes.GIVfarm} passHref>
							<GsButton
								label='SEE OPPORTUNITIES'
								linkType='primary'
								size='medium'
							/>
						</Link>
					}
				>
					Stake GIV, or become a liquidity provider and stake LP
					tokens in the GIVfarm. Get GIV rewards and increase your
					GIVstream.
				</IGsDataBox>
			</Col>
		</Row>
	);
};

export default GivEconomyProjectCards;
