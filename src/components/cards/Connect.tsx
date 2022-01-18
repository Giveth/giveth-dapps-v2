import { FC, useContext } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { ArrowButton, Card } from './common';
import { UserContext, GiveDropStateType } from '../../context/user.context';
import { IClaimViewCardProps } from '../views/claim/Claim.view';
import { formatWeiHelper } from '@/helpers/number';
import {
	ButtonLink,
	GLink,
	H2,
	Lead,
	OulineLinkButton,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
interface IConnectCardContainerProps {
	data: any;
}

const ConnectCardContainer = styled(Card)<IConnectCardContainerProps>`
	padding-top: 96px;
	::before {
		content: '';
		background-image: url('${props => props.data.bg}');
		position: absolute;
		width: ${props => props.data.width};
		height: ${props => props.data.height};
		top: ${props => props.data.top};
		right: ${props => props.data.right};
		z-index: -1;
	}
	// @media only screen and (max-width: 1360px) {}
	// @media only screen and (max-width: 1120px) {}
	@media only screen and (max-width: 1120px) {
		padding: 32px;
		::before {
			background-image: none;
		}
	}
`;

export const Header = styled.div`
	margin-bottom: 92px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 32px;
	}
`;

const Title = styled(H2)`
	width: 800px;
	@media only screen and (max-width: 1360px) {
		width: 700px;
	}
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

const Desc = styled(Lead)`
	margin-top: 22px;
`;

const ConnectRow = styled(Row)`
	flex-direction: row;
	gap: 16px;
	align-items: flex-start;
	// @media only screen and (max-width: 1360px) {}
	@media only screen and (max-width: 1120px) {
		flex-direction: column;
		align-items: center;
	}
`;

const ConnectButton = styled(Button)`
	width: 300px;
	@media only screen and (max-width: 1360px) {
		width: 257px;
	}
`;

const Span = styled.div`
	display: inline-block;
	font-size: 20px;
	line-height: 26px;
	text-transform: uppercase;
`;

const InputWithButtonContainer = styled.div`
	width: 588px;
`;

const ClickableStrong = styled.strong`
	cursor: pointer;
`;

const ClaimedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
	@media only screen and (max-width: 1120px) {
		margin-top: 64px;
	}
`;

const SunImage = styled.div`
	position: relative;
	height: 0px;
	@media only screen and (max-width: 1120px) {
		display: none;
	}
`;

const StarsImage = styled(SunImage)`
	left: 75%;
	top: -50px;
`;

const ClaimedTitle = styled.div`
	font-family: 'Red Hat Text';
	font-size: 64px;
	font-weight: 700;
	text-align: center;
`;

const ClaimedSubtitleContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
`;

const ClaimedSubtitleA = styled.div`
	font-family: 'Red Hat Text';
	font-size: 21px;
	text-align: center;
	display: flex;
	gap: 12px;
`;

const AddGivButton = styled.div`
	cursor: pointer;
`;

const SocialButton = styled(OulineLinkButton)`
	width: 265px;
`;

const ExploreButton = styled(ButtonLink)`
	width: 285px;
`;

const ClaimFromAnother = styled.span`
	cursor: pointer;
	color: #fed670;
	margin-top: 4px;
`;

const WalletLink = styled(GLink)`
	color: #fed670;
	text-decoration: underline;
`;

const WalletDisplayer = styled(Row)`
	flex-direction: column;
	align-items: center;
	gap: 16px;
`;

const WalletDisplayerInputContainer = styled.div`
	position: relative;
`;

const WalletDisplayerInput = styled.input`
	width: 588px;
	height: 68px;

	font-family: Red Hat Text;
	font-style: normal;
	font-weight: normal;
	font-size: 18px;
	line-height: 28px;
	text-align: center;

	color: #ffffff;
	background: #310bb5;

	border: 0;
	border-radius: 88px;

	padding: 20px 120px 20px 20px;
`;

const WalletCheckButton = styled.button`
	position: absolute;
	right: 10px;
	top: 10px;
	width: 114px;
	height: 48.62px;
	color: white;
	background: #1b1657;
	border: 0;
	border-radius: 88px;
	cursor: pointer;
`;

export const ConnectCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { account, activate } = useWeb3React();
	const {
		totalAmount,
		giveDropState,
		step,
		isloading,
		setStep,
		goNextStep,
		getClaimData,
	} = useContext(UserContext);

	let title;
	let desc;
	let btnLabel;
	let bg = {
		width: '473px',
		height: '210px',
		top: '0',
		right: '0',
		bg: '/images/connectbg.png',
	};

	switch (giveDropState) {
		case GiveDropStateType.notConnected:
			title = 'Claim your GIVdrop';
			desc =
				'Connect your wallet or check an Ethereum address to see your rewards.';
			btnLabel = isloading ? 'Loading Data' : 'CONNECT WALLET';
			bg = {
				width: '473px',
				height: '210px',
				top: '0',
				right: '0',
				bg: '/images/connectbg.png',
			};
			break;
		case GiveDropStateType.Success:
			title = `You have ${formatWeiHelper(
				totalAmount.div(10),
			)} GIV to claim.`;
			desc = 'Congrats, your GIVdrop awaits. Go claim it!';
			bg = {
				width: '856px',
				height: '582px',
				top: '0',
				right: '0',
				bg: '/images/connectSuccbg.png',
			};
			break;
		case GiveDropStateType.Missed:
			title = 'You missed the GIVdrop';
			desc = (
				<span>
					But there are more ways to get GIV! Try another address or
					donate to verified projects to qualify for{' '}
					<Link href='/givbacks' passHref>
						<ClickableStrong>GIVbacks</ClickableStrong>
					</Link>
					.
				</span>
			);
			btnLabel = 'CHANGE WALLET';
			bg = {
				width: '622px',
				height: '245px',
				top: '337px',
				right: '300px',
				bg: '/images/connectMissbg.png',
			};
			break;
		case GiveDropStateType.Claimed:
			setStep(6);
		default:
			break;
	}

	return (
		<ConnectCardContainer activeIndex={step} index={index} data={bg}>
			{giveDropState !== GiveDropStateType.Claimed && (
				<Header>
					<Title as='h1' weight={700}>
						{title}
					</Title>
					<Desc>{desc}</Desc>
				</Header>
			)}
			{giveDropState !== GiveDropStateType.Success &&
				giveDropState !== GiveDropStateType.Claimed && (
					<>
						<ConnectRow
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<WalletDisplayer>
								<ConnectButton
									secondary
									onClick={async () => {
										const res = await activate(
											new InjectedConnector({}),
										);
										if (account) {
											getClaimData();
										}
									}}
								>
									{btnLabel}
								</ConnectButton>
								{giveDropState === GiveDropStateType.Missed && (
									<Link href='/' passHref>
										<WalletLink>
											Go to GIVeconomy
										</WalletLink>
									</Link>
								)}
							</WalletDisplayer>
							<WalletDisplayer>
								<WalletDisplayerInputContainer>
									<WalletDisplayerInput
										disabled
										value={account || ''}
										placeholder='Please connect your wallet'
									/>
									<WalletCheckButton onClick={getClaimData}>
										Check
									</WalletCheckButton>
								</WalletDisplayerInputContainer>
								<WalletLink
									href='https://docs.giveth.io/giveconomy/givdrop/#if-you-get-stuck-in-the-givdrop-claim'
									target='_blank'
								>
									What if this address doesn&apos;t match the
									address in my wallet?
								</WalletLink>
							</WalletDisplayer>
						</ConnectRow>
					</>
				)}
			{giveDropState === GiveDropStateType.Success && step === index && (
				<ArrowButton onClick={goNextStep} />
			)}
		</ConnectCardContainer>
	);
};

export default ConnectCard;
