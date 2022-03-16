import Link from 'next/link';
import { Flex } from '../styled-components/Flex';
import router from 'next/router';
import { Button, DataBlock } from '@giveth/ui-design-system';
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
} from './Overview.sc';
import { IconGIV } from '../Icons/GIV';
import config from '@/configuration';
import Routes from '@/lib/constants/Routes';
import { Col, Container, Row } from '@/components/Grid';

export const TabOverviewTop = () => {
	return (
		<OverviewTopContainer>
			<Container>
				<PreTitle as='span'>Welcome to the</PreTitle>
				<OverviewTitle>GIVeconomy</OverviewTitle>
				<Col lg={9}>
					<SubTitle size='medium'>
						The GIVeconomy empowers our collective of projects,
						donors, builders, and community members to build the
						Future of Giving.
					</SubTitle>
				</Col>
			</Container>
		</OverviewTopContainer>
	);
};

export const TabOverviewBottom = () => {
	const goToClaim = () => {
		router.push(Routes.Claim);
	};

	return (
		<OverviewBottomContainer>
			<Container>
				<TabTitle weight={700}>The Economy of Giving</TabTitle>
				<Col md={10} lg={8}>
					<TabDesc size='medium'>
						Giveth is rewarding and empowering those who give to
						projects, to society, and to the world!
					</TabDesc>
				</Col>
				<Row>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title='GIV Token'
							subtitle='Donate, earn, govern'
							button={
								<Button
									label='CLAIM YOUR GIVDROP'
									buttonType='primary'
									onClick={goToClaim}
								/>
							}
							icon={<IconGIV size={32} />}
						>
							GIV fuels and directs the Future of Giving,
							inspiring people to become Givers and participate in
							an ecosystem of collective support, abundance, and
							value-creation.
						</DataBlockWithMargin>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title='GIVbacks'
							subtitle='GIVE AND RECEIVE'
						>
							Giveth is a donor owned and governed economy. With
							GIVbacks, we reward donors to verified projects on
							Giveth with GIV tokens.
						</DataBlockWithMargin>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title='GIVstream'
							subtitle='Get more GIV'
						>
							Welcome to the expanding GIViverse! With the
							GIVstream, our community members become long-term
							stakeholders in the Future of Giving.
						</DataBlockWithMargin>
					</Col>
				</Row>
				<Section2Title>How to participate</Section2Title>
				<Row>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title='Give'
							button={
								<DataBlockButton
									href='https://giveth.io/projects'
									target='_blank'
									label='DONATE TO PROJECTS'
								/>
							}
						>
							Donate to empower change-makers that are working
							hard to make a difference. Get GIVbacks when you
							donate to verified projects.
						</DataBlockWithMargin>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title='Govern'
							button={
								<DataBlockButton
									href={config.GARDEN_LINK}
									target='_blank'
									label='SEE PROPOSALS'
								/>
							}
						>
							The GIVeconomy empowers our collective of projects,
							donors, builders and community members to build the
							Future of Giving.
						</DataBlockWithMargin>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<DataBlockWithMargin
							title='Earn'
							button={
								<Link href={Routes.GIVfarm} passHref>
									<DataBlockButton label='SEE FARMS' />
								</Link>
							}
						>
							Become a liquidity provider and stake tokens in the
							GIVfarm to generate even more GIV in rewards.
						</DataBlockWithMargin>
					</Col>
				</Row>
				<ClaimCard>
					<ClaimCardTitle weight={900}>
						Claim your GIVdrop
					</ClaimCardTitle>
					<ClaimCardQuote size='small'>
						Connect your wallet or check an ethereum address to see
						your rewards.
					</ClaimCardQuote>
					<ClaimCardButton
						label='CLAIM YOUR GIV'
						buttonType='primary'
						onClick={goToClaim}
					/>
				</ClaimCard>
			</Container>
		</OverviewBottomContainer>
	);
};
