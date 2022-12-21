import Link from 'next/link';
import router from 'next/router';
import {
	Button,
	ButtonLink,
	IconExternalLink,
	P,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import {
	OverviewTopContainer,
	PreTitle,
	OverviewTitle,
	OverviewBottomContainer,
	ClaimCard,
	ClaimCardButton,
	ClaimCardTitle,
	Section2Title,
	TabDesc,
	TabTitle,
	SubTitle,
	DataBlockWithMargin,
	ClaimCardQuote,
	DataBlockButton,
	ClaimRow,
} from './Overview.sc';
import { IconGIV } from '../Icons/GIV';
import config from '@/configuration';
import Routes from '@/lib/constants/Routes';
import { Col, Container, Row } from '@/components/Grid';
import GivEconomyProjectCards from '../cards/GivEconomyProjectCards';
import { Flex } from '../styled-components/Flex';
import { ExtLinkCyan } from './commons';
import { StakingType } from '@/types/config';

export const TabOverviewTop = () => {
	const { formatMessage } = useIntl();
	return (
		<OverviewTopContainer>
			<Container>
				<PreTitle as='span'>
					{formatMessage({ id: 'label.welcome_to_the' })}
				</PreTitle>
				<OverviewTitle>GIVeconomy</OverviewTitle>
				<Col lg={9}>
					<SubTitle size='medium'>
						{formatMessage({ id: 'label.the_giveconomy_empowers' })}
					</SubTitle>
				</Col>
			</Container>
		</OverviewTopContainer>
	);
};

export const TabOverviewBottom = () => {
	const { chainId } = useWeb3React();
	const { formatMessage } = useIntl();

	const goToClaim = () => {
		router.push(Routes.Claim);
	};

	return (
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
							title='GIV Token'
							subtitle={formatMessage({
								id: 'label.donate_earn_govern',
							})}
							button={
								<Button
									label={formatMessage({
										id: 'label.claim_your_givdrop',
									})}
									buttonType='primary'
									onClick={goToClaim}
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
									<ButtonLink
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
									<ButtonLink
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
				<Section2Title>
					{formatMessage({ id: 'label.how_to_participate' })}
				</Section2Title>
				<Row>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title={formatMessage({ id: 'label.give' })}
							button={
								<Link href={Routes.Projects}>
									<DataBlockButton
										label={formatMessage({
											id: 'label.donate_to_projects',
										})}
									/>
								</Link>
							}
						>
							{formatMessage({
								id: 'label.donate_to_empower_changemakers',
							})}
						</DataBlockWithMargin>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title={formatMessage({ id: 'label.govern' })}
							button={
								<DataBlockButton
									isExternal
									href={config.GARDEN_LINK}
									target='_blank'
									label={formatMessage({
										id: 'label.see_proposals',
									})}
								/>
							}
						>
							{formatMessage({
								id: 'label.the_giveconomy_empowers_our_collective',
							})}
						</DataBlockWithMargin>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title={formatMessage({ id: 'label.earn' })}
							button={
								<Link href={Routes.GIVfarm} passHref>
									<DataBlockButton
										label={formatMessage({
											id: 'label.see_farms',
										})}
									/>
								</Link>
							}
						>
							{formatMessage({
								id: 'label.become_a_liquidity_provider',
							})}
						</DataBlockWithMargin>
					</Col>
				</Row>
				<ClaimCard>
					<ClaimCardTitle weight={900}>
						{formatMessage({ id: 'label.claim_your_givdrop' })}
					</ClaimCardTitle>
					<ClaimCardQuote size='small'>
						{formatMessage({
							id: 'label.connect_your_wallet_or_check_an_eth_address',
						})}
					</ClaimCardQuote>
					<ClaimRow alignItems='center'>
						<ClaimCardButton
							label={formatMessage({
								id: 'label.claim_your_giv',
							})}
							buttonType='primary'
							onClick={goToClaim}
						/>
						<Flex gap='8px'>
							<P>
								{formatMessage({
									id: 'label.didnt_get_the_givdrop',
								})}
							</P>
							<ExtLinkCyan
								as='a'
								size='Big'
								target='_blank'
								rel='noreferrer'
								href={
									chainId === config.XDAI_NETWORK_NUMBER
										? config.XDAI_CONFIG.GIV.BUY_LINK
										: config.MAINNET_CONFIG.GIV.BUY_LINK
								}
							>
								{formatMessage({ id: 'label.buy_giv_token' })}{' '}
								<IconExternalLink />
							</ExtLinkCyan>
						</Flex>
					</ClaimRow>
				</ClaimCard>
				<GivEconomyProjectCards />
			</Container>
		</OverviewBottomContainer>
	);
};
