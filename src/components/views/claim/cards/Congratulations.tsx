import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { H2, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { Container } from '@giveth/ui-design-system';
import useClaim from '@/context/claim.context';
import { formatWeiHelper } from '@/helpers/number';
import SparkleBurstAnimation from '@/animations/sparkle-burst.json';
import SparkleAnimation from '@/animations/sparkle.json';
import BlowingAnimation from '@/animations/blowing.json';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { AddTokenButton } from '@/components/AddTokenButton';
import { Flex } from '@/components/styled-components/Flex';
import { Button } from '@/components/styled-components/Button';
import LottieControl from '@/components/LottieControl';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const SmileImage = styled.div`
	position: absolute;
	height: 0;
	left: -264px;
	top: -92px;
	@media only screen and (max-width: 990px) {
		display: none;
	}
`;

const ClaimedSubtitleA = styled(Flex)`
	gap: 12px;
	margin-top: 24px;
	position: relative;
`;

const ClaimedSubtitleB = styled(Lead)``;

const SocialButtonsContainer = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	margin: 32px 0;
`;

const SocialButton = styled(Button)`
	font-family: 'Red Hat Text';
	font-size: 14px;
	font-weight: bold;
	text-transform: uppercase;
	background-color: transparent;
	border: 2px solid white;
	height: 50px;
	width: 265px;
	margin-top: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
`;

const ExploreButton = styled(SocialButton)`
	background-color: #e1458d;
	border: none;
	width: 285px;
`;

const ClaimFromAnother = styled.div`
	cursor: pointer;
	color: #fed670;
	margin-top: 16px;
`;

const CongratulationsView = styled.div`
	min-height: 100vh;
	background-color: #3c14c5;
	background-image: url('/images/bgCong.png');
	background-size: cover;
`;

const CongratulationsContainer = styled(Container)`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const CongHeader = styled(H2)`
	text-align: center;
	position: relative;
`;

const CongContent = styled(Flex)`
	flex-direction: column;
	padding-left: 200px;
	@media only screen and (max-width: 990px) {
		padding-left: 0;
		align-items: center;
	}
`;

const SparkleContainer = styled.div`
	position: absolute;
	right: -75px;
	top: -48px;
`;

const SparkleBurstContainer = styled.div`
	position: absolute;
	left: -44px;
	top: -37px;
	@media only screen and (max-width: 1360px) {
	}
	@media only screen and (max-width: 990px) {
		display: none;
	}
`;

const ExploreRow = styled.div`
	position: relative;
`;

const BlowingContainer = styled.div`
	position: absolute;
	right: -75px;
	top: -15px;
	@media only screen and (max-width: 1360px) {
	}
	@media only screen and (max-width: 990px) {
		display: none;
	}
`;

export const CongratulationsCard = () => {
	const { formatMessage } = useIntl();
	const [streamValue, setStreamValue] = useState<string>('0');
	const { totalAmount, resetWallet } = useClaim();
	const { library } = useWeb3React();
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();

	useEffect(() => {
		setStreamValue(
			formatWeiHelper(
				givTokenDistroHelper.getStreamPartTokenPerWeek(totalAmount),
			),
		);
	}, [totalAmount, givTokenDistroHelper]);
	return (
		<CongratulationsView>
			<CongratulationsContainer>
				<CongHeader weight={700}>
					{formatMessage({ id: 'label.congratulations' })}!
					<SparkleContainer>
						<LottieControl
							animationData={SparkleAnimation}
							size={100}
							speed={0.8}
						/>
					</SparkleContainer>
				</CongHeader>
				<CongContent>
					<ClaimedSubtitleA>
						<Lead>
							{formatMessage({
								id: 'label.you_have_successfuly_claimed',
							})}
						</Lead>
						<Lead>
							{formatWeiHelper(totalAmount.div(10))} GIV.{' '}
						</Lead>
						<AddTokenButton provider={library} showText={false} />
						<SmileImage>
							<SparkleBurstContainer>
								<LottieControl
									animationData={SparkleBurstAnimation}
									size={200}
									speed={0.8}
								/>
							</SparkleBurstContainer>
							<Image
								src='/images/congratulation.png'
								height='226'
								width='252'
								alt='union'
							/>
						</SmileImage>
					</ClaimedSubtitleA>

					<ClaimedSubtitleB>
						{formatMessage({
							id: 'label.plus_you_are_getting_an_additional',
						})}{' '}
						<span style={{ color: '#FED670' }}>
							{streamValue} GIV
						</span>{' '}
						{formatMessage({ id: 'label.per_week' })}.
					</ClaimedSubtitleB>
				</CongContent>

				<SocialButtonsContainer>
					<a
						href='https://twitter.com/intent/tweet?text=The%20%23GIVeconomy%20is%20here!%20Excited%20to%20be%20part%20of%20the%20Future%20of%20Giving%20with%20$GIV%20%26%20%40giveth%20%23blockchain4good%20%23defi4good%20%23givethlove%20%23givdrop'
						target='_blank'
						rel='noreferrer'
					>
						<SocialButton>
							{formatMessage({ id: 'label.share_on_twitter' })}
							<Image
								src='/images/icons/twitter.svg'
								height='15'
								width='15'
								alt='Twitter logo.'
							/>
						</SocialButton>
					</a>
					<ExternalLink href={links.SWAG}>
						<SocialButton>
							{formatMessage({
								id: 'label.claim_your_free_swag',
							})}
							<Image
								src='/images/icons/tshirt.svg'
								height='15'
								width='15'
								alt='T shirt.'
							/>
						</SocialButton>
					</ExternalLink>
					<ExternalLink href={links.DISCORD}>
						<SocialButton>
							{formatMessage({ id: 'label.join_our_discord' })}
							<Image
								src='/images/icons/discord.svg'
								height='15'
								width='15'
								alt='discord logo.'
							/>
						</SocialButton>
					</ExternalLink>
				</SocialButtonsContainer>
				<ExploreRow>
					<a href='/' target='_blank'>
						<ExploreButton>
							{formatMessage({
								id: 'label.explore_the_giveconomy',
							})}
						</ExploreButton>
					</a>
					<BlowingContainer>
						<LottieControl
							animationData={BlowingAnimation}
							size={100}
							speed={0.8}
						/>
					</BlowingContainer>
				</ExploreRow>
				<ClaimFromAnother
					onClick={() => {
						resetWallet();
					}}
				>
					{formatMessage({ id: 'label.check_another_address' })}
				</ClaimFromAnother>
			</CongratulationsContainer>
		</CongratulationsView>
	);
};
