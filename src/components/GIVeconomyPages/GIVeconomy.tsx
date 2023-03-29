import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Col, Container, Row } from '@giveth/ui-design-system';
import {
	OverviewBottomContainer,
	VoteCard,
	VoteCardButton,
	VoteCardTitle,
	TabDesc,
	TabTitle,
	DataBlockWithMargin,
	VoteCardQuote,
	DataBlockButton,
	TopSpacer,
} from './GIVeconomy.sc';
import { IconGIV } from '../Icons/GIV';
import config from '@/configuration';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';
import VideoBlock from '@/components/VideoBlock';

export const TabOverview = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<TopSpacer />
			<VideoBlock
				src='/video/giveconomy.mp4'
				poster='/video/giveconomy.webp'
			/>
			<OverviewBottomContainer>
				<Container>
					<TabTitle weight={700}>
						{formatMessage({ id: 'label.the_economy_of_giving' })}
					</TabTitle>
					<Col md={10} lg={8}>
						<TabDesc size='medium'>
							{formatMessage({
								id: 'label.giveth_is_rewarding_and_empowering_those',
							})}
						</TabDesc>
					</Col>
					<Row>
						<Col xs={12} sm={6} md={4}>
							<DataBlockWithMargin
								title='GIV'
								subtitle={formatMessage({
									id: 'label.donate_earn_govern',
								})}
								button={
									<DataBlockButton
										href={config.XDAI_CONFIG.GIV.BUY_LINK}
										isExternal
										label={formatMessage({
											id: 'label.get_giv',
										})}
										linkType='primary'
									/>
								}
								icon={<IconGIV size={32} />}
							>
								{formatMessage({
									id: 'label.giv_fuels_and_directs',
								})}
							</DataBlockWithMargin>
						</Col>
						<Col xs={12} sm={6} md={4}>
							<DataBlockWithMargin
								title='GIVbacks'
								subtitle={formatMessage({
									id: 'label.give_and_receive',
								})}
								button={
									<Link href={Routes.Projects}>
										<DataBlockButton
											label={formatMessage({
												id: 'page.home.bigscreen.see_projects',
											})}
										/>
									</Link>
								}
							>
								{formatMessage({
									id: 'label.giveth_is_a_donor_owned_economy',
								})}
							</DataBlockWithMargin>
						</Col>
						<Col xs={12} sm={6} md={4}>
							<DataBlockWithMargin
								title='GIVpower'
								subtitle={formatMessage({
									id: 'label.boost_projects',
								})}
								button={
									<Link
										href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
									>
										<DataBlockButton
											label={formatMessage({
												id: 'label.stake_for_givpower',
											})}
										/>
									</Link>
								}
							>
								{formatMessage({
									id: 'label.givpower_allows_you_to_boost',
								})}
								<br />
								<br />
							</DataBlockWithMargin>
						</Col>
					</Row>
				</Container>
			</OverviewBottomContainer>
			<VideoBlock
				src='/video/givpower.mp4'
				poster='/video/giv-giv-giv.jpg'
			/>
			<Container>
				<VoteCard>
					<VoteCardTitle weight={900}>
						{formatMessage({ id: 'label.vote_in_giveth_dao' })}
					</VoteCardTitle>
					<VoteCardQuote size='small'>
						{formatMessage({
							id: 'label.use_giv_to_vote',
						})}
					</VoteCardQuote>
					<VoteCardButton
						isExternal
						label={formatMessage({
							id: 'label.see_proposals',
						})}
						linkType='primary'
						href={config.GARDEN_LINK}
						size='large'
					/>
				</VoteCard>
			</Container>
		</>
	);
};
