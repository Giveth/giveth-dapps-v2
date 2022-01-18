import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { useContext, useEffect, useState } from 'react';
import useUser from '../../context/user.context';
import { Container, H2, Lead } from '@giveth/ui-design-system';
import Lottie from 'react-lottie';
import { formatWeiHelper } from '@/helpers/number';
import { addGIVToken } from '@/lib/metamask';
import Image from 'next/image';
import SparkleBurstAnimation from '../../animations/sparkle-burst.json';
import SparkleAnimation from '../../animations/sparkle.json';
import BlowingAnimation from '../../animations/blowing.json';
import config from '@/configuration';
import Link from 'next/link';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { Row } from '../styled-components/Grid';
import { AddGIVTokenButton } from '../AddGIVTokenButton';
import { useWeb3React } from '@web3-react/core';

const SmileImage = styled.div`
	position: absolute;
	height: 0px;
	left: -264px;
	top: -92px;
	@media only screen and (max-width: 990px) {
		display: none;
	}
`;

const ClaimedSubtitleA = styled(Row)`
	gap: 12px;
	margin-top: 24px;
	position: relative;
`;

const AddGivButton = styled.div`
	cursor: pointer;
`;

const ClaimedSubtitleB = styled(Lead)``;

const SocialButtonsContainer = styled(Row)`
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

const CongContent = styled(Row)`
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

const SparkleAnimationOptions = {
	// loop: false,
	animationData: SparkleAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const SparkleBurstAnimationOptions = {
	// loop: false,
	animationData: SparkleBurstAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const BlowingAnimationOptions = {
	// loop: false,
	animationData: BlowingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

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
	const [streamValue, setStreamValue] = useState<string>('0');
	const { tokenDistroHelper } = useTokenDistro();
	const { totalAmount, resetWallet } = useUser();
	const { library } = useWeb3React();

	useEffect(() => {
		setStreamValue(
			formatWeiHelper(
				tokenDistroHelper.getStreamPartTokenPerWeek(totalAmount),
			),
		);
	}, [totalAmount, tokenDistroHelper]);
	return (
		<CongratulationsView>
			<CongratulationsContainer>
				<CongHeader weight={700}>
					Congratulations!
					<SparkleContainer>
						<Lottie
							options={SparkleAnimationOptions}
							height={100}
							width={100}
							speed={0.8}
						/>
					</SparkleContainer>
				</CongHeader>
				<CongContent>
					<ClaimedSubtitleA>
						<Lead>You have successfully claimed </Lead>
						<Lead>
							{formatWeiHelper(totalAmount.div(10))} GIV.{' '}
						</Lead>
						<AddGIVTokenButton
							provider={library}
							showText={false}
						/>
						<SmileImage>
							<SparkleBurstContainer>
								<Lottie
									options={SparkleBurstAnimationOptions}
									height={200}
									width={200}
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
						Plus you&apos;re getting an additional{' '}
						<span style={{ color: '#FED670' }}>
							{streamValue} GIV
						</span>{' '}
						per week.
					</ClaimedSubtitleB>
				</CongContent>

				<SocialButtonsContainer>
					<a
						href='https://twitter.com/intent/tweet?text=The%20%23GIVeconomy%20is%20here!%20Excited%20to%20be%20part%20of%20the%20Future%20of%20Giving%20with%20$GIV%20%26%20%40givethio%20%23blockchain4good%20%23defi4good%20%23givethlove%20%23givdrop'
						target='_blank'
						rel='noreferrer'
					>
						<SocialButton>
							share on twitter
							<Image
								src='/images/icons/twitter.svg'
								height='15'
								width='15'
								alt='Twitter logo.'
							/>
						</SocialButton>
					</a>
					<a
						href='https://swag.giveth.io/'
						target='_blank'
						rel='noreferrer'
					>
						<SocialButton>
							claim your free swag
							<Image
								src='/images/icons/tshirt.svg'
								height='15'
								width='15'
								alt='T shirt.'
							/>
						</SocialButton>
					</a>
					<a
						href='https://discord.giveth.io/'
						target='_blank'
						rel='noreferrer'
					>
						<SocialButton>
							join our discord
							<Image
								src='/images/icons/discord.svg'
								height='15'
								width='15'
								alt='discord logo.'
							/>
						</SocialButton>
					</a>
				</SocialButtonsContainer>
				<ExploreRow>
					<a href='/' target='_blank'>
						<ExploreButton>explore the giveconomy</ExploreButton>
					</a>
					<BlowingContainer>
						<Lottie
							options={BlowingAnimationOptions}
							height={100}
							width={80}
							speed={0.8}
						/>
					</BlowingContainer>
				</ExploreRow>
				<ClaimFromAnother
					onClick={() => {
						resetWallet();
					}}
				>
					Claim from another address!
				</ClaimFromAnother>
			</CongratulationsContainer>
		</CongratulationsView>
	);
};
