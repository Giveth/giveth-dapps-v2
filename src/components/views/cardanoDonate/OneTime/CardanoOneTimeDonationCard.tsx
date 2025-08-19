import styled from 'styled-components';
import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	B,
	brandColors,
	Button,
	Flex,
	IconCaretDown16,
	IconWalletOutline24,
	neutralColors,
	OutlineButton,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
// @ts-ignore
import { formatUnits } from 'viem';
import { useWallet } from '@meshsdk/react';

import { InsufficientFundModal } from '@/components/modals/InsufficientFund';

import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { truncateToDecimalPlaces } from '@/lib/helpers';
import { calcDonationShare } from '@/components/views/donate/common/helpers';
import { useDonateData } from '@/context/donate.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import {
	BadgesBase,
	ForEstimatedMatchingAnimation,
	GLinkStyled,
	Input,
	InputWrapper,
	SelectTokenPlaceHolder,
	SelectTokenWrapper,
} from '@/components/views/donate/common/common.styled';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import DonateAnonymously from '@/components/views/donate/common/DonateAnonymously';
import { GIVBACKS_DONATION_QUALIFICATION_VALUE_USD } from '@/lib/constants/constants';
import CardanoDonateModal from '@/components/views/cardanoDonate/CardanoDonateModal';
import { CardanoSelectTokenModal } from '@/components/views/cardanoDonate/OneTime/SelectTokenModal/CardanoSelectTokenModal';
import SaveGasFees from '../../donate/OneTime/SaveGasFees';
import CardanoTotalDonation from '@/components/views/cardanoDonate/OneTime/CardanoTotalDonation';
import CardanoEligibilityBadges from '@/components/views/cardanoDonate/common/CardanoEligibilityBadges';
import { CardanoWalletInfo, ICardanoAcceptedToken } from '../types';
import {
	getAdaBalance,
	getCardanoStoredWalet,
	getCoingeckoADAPrice,
	handleWalletDisconnect,
	hasSufficientBalance,
	toUnits,
} from '../helpers';
import { CardanoConnectWalletModal } from '../CardanoConnectWalletModal';

const CardanoCryptoDonation: FC<{
	acceptedTokens: ICardanoAcceptedToken[] | undefined;
}> = ({ acceptedTokens }) => {
	const [showCardanoConnectWalletModal, setShowCardanoConnectWalletModal] =
		useState(false);
	const [selectedCardanoWallet, setSelectedCardanoWallet] =
		useState<CardanoWalletInfo | null>(null);

	const { connect, connected, disconnect, wallet } = useWallet();

	// Connect user with selected wallet if it's stored in local storage
	useEffect(() => {
		const storedCardanoWallet = getCardanoStoredWalet();
		if (storedCardanoWallet) {
			setSelectedCardanoWallet(storedCardanoWallet);
			connect(storedCardanoWallet.name);
		}
	}, [connect]);

	const { formatMessage } = useIntl();
	const { project, selectedOneTimeToken } = useDonateData();

	const { isGivbackEligible, status, title: projectTitle } = project;

	const isActive = status?.name === EProjectStatus.ACTIVE;
	const [amount, setAmount] = useState(0n);
	const [erc20List, setErc20List] = useState<ICardanoAcceptedToken[]>();
	const [anonymous, setAnonymous] = useState<boolean>(false);
	const [insufficientGasFee, setInsufficientGasFee] =
		useState<boolean>(false);
	const [insufficientAmountFee, setInsufficientAmountFee] =
		useState<boolean>(false);
	const [showDonateModal, setShowDonateModal] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const [selectedTokenBalance, setSelectedTokenBalance] = useState(0);
	const [tokenPrice, setTokenPrice] = useState(0);
	const [selectedTokenCardano, setSelectedTokenCardano] = useState<
		ICardanoAcceptedToken | undefined
	>(undefined);

	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowDonateModal(true),
	);

	const tokenDecimals = selectedOneTimeToken?.decimals || 18;

	// Fetch token ADA price from coingecko
	useEffect(() => {
		const fetchTokenPrice = async () => {
			const price = await getCoingeckoADAPrice();
			setTokenPrice(price);
		};
		fetchTokenPrice();
	}, []);

	// Fetch selected token balance
	useEffect(() => {
		if (selectedOneTimeToken) {
			const cardanoToken = selectedOneTimeToken as ICardanoAcceptedToken;
			setSelectedTokenBalance(cardanoToken.cardano?.quantity || 0);
			setSelectedTokenCardano(cardanoToken);
		}
	}, [selectedOneTimeToken]);

	// Calculate insufficient fee
	useEffect(() => {
		const checkInsufficientFee = async () => {
			if (selectedTokenCardano && wallet) {
				const userWalletAdaBalance = await getAdaBalance(wallet);
				const isInsufficientFee = hasSufficientBalance(
					amount,
					toUnits(userWalletAdaBalance, 6),
				);
				setInsufficientGasFee(!isInsufficientFee);
			}
		};
		checkInsufficientFee();
	}, [selectedTokenCardano, amount, wallet]);

	// Calculate if user donation is more then 1 ADA
	useEffect(() => {
		if (selectedTokenCardano && amount > 0n) {
			// This is amount of ADA user is donating whateever token he selected
			const priceInLovelace = toUnits(
				selectedTokenCardano.cardano?.priceAda || 0,
				selectedTokenCardano.decimals,
			);
			const donatedInLovelace =
				(amount * priceInLovelace) / 10n ** BigInt(tokenDecimals);
			if (donatedInLovelace < BigInt(1_000_000)) {
				setInsufficientAmountFee(true);
			} else {
				setInsufficientAmountFee(false);
			}
		} else {
			setInsufficientAmountFee(false);
		}
	}, [amount, selectedTokenCardano, tokenDecimals]);

	// Handle donate
	const handleDonate = () => {
		const userWalletBalance = toUnits(selectedTokenBalance, tokenDecimals);
		if (amount > userWalletBalance) {
			return setShowInsufficientModal(true);
		}
		if (!connected) {
			signInThenDonate();
		} else {
			setShowDonateModal(true);
		}
	};

	// Donation is disabled if:
	// - Project is not active
	// - Amount is not set
	// - Selected token is not set
	// - Insufficient gas fee
	// - Insufficient amount fee
	const donationDisabled =
		!isActive ||
		!amount ||
		!selectedOneTimeToken ||
		insufficientGasFee ||
		insufficientAmountFee;

	const gasFee = 0n;

	const { projectDonation: projectDonationAmount } = calcDonationShare(
		amount,
		0,
		selectedOneTimeToken?.decimals ?? 18,
	);

	const decimals = selectedOneTimeToken?.decimals || 18;

	const donationUsdValue = selectedTokenCardano?.cardano?.priceAda
		? truncateToDecimalPlaces(
				String(
					Number(selectedTokenCardano.cardano.priceAda) *
						Number(tokenPrice) *
						Number(formatUnits(amount, decimals)),
				),
				2,
			)
		: 0;

	const selectTokenDisabled = !connected;

	return (
		<MainContainer>
			{showInsufficientModal && (
				<InsufficientFundModal
					setShowModal={setShowInsufficientModal}
				/>
			)}
			{showDonateModal && selectedOneTimeToken && amount && (
				<CardanoDonateModal
					setShowModal={setShowDonateModal}
					token={selectedOneTimeToken}
					amount={amount}
					anonymous={anonymous}
					givBackEligible={
						isGivbackEligible &&
						selectedOneTimeToken.isGivbackEligible &&
						tokenPrice !== undefined &&
						tokenPrice * projectDonationAmount >=
							GIVBACKS_DONATION_QUALIFICATION_VALUE_USD
					}
				/>
			)}
			<SaveGasFees acceptedChains={[]} />
			{!connected && (
				<ConnectWallet>
					<IconWalletOutline24 color={neutralColors.gray[700]} />
					{formatMessage({
						id: 'label.please_connect_your_wallet',
					})}
				</ConnectWallet>
			)}
			{!selectTokenDisabled && (
				<CardanoEligibilityBadges
					token={selectedOneTimeToken}
					amount={amount}
					tokenPrice={tokenPrice}
					style={{ margin: '12px 0 24px' }}
				/>
			)}
			<ForEstimatedMatchingAnimation showEstimatedMatching={false}>
				<FlexStyled
					$flexDirection='column'
					gap='8px'
					disabled={selectTokenDisabled}
				>
					<InputWrapper>
						<SelectTokenWrapper
							$alignItems='center'
							$justifyContent='space-between'
							onClick={() =>
								!selectTokenDisabled &&
								setShowSelectTokenModal(true)
							}
							disabled={selectTokenDisabled}
							style={{
								color:
									selectedOneTimeToken || selectTokenDisabled
										? 'inherit'
										: brandColors.giv[500],
							}}
						>
							{selectedOneTimeToken ? (
								<Flex gap='8px' $alignItems='center'>
									<TokenIcon
										symbol={selectedOneTimeToken.symbol}
										size={24}
									/>
									<TokenSymbol>
										{selectedOneTimeToken.symbol}
									</TokenSymbol>
								</Flex>
							) : (
								<SelectTokenPlaceHolder>
									{formatMessage({
										id: 'label.select_token',
									})}
								</SelectTokenPlaceHolder>
							)}
							<IconCaretDown16 />
						</SelectTokenWrapper>
						<Input
							amount={amount}
							setAmount={setAmount}
							disabled={selectedOneTimeToken === undefined}
							decimals={selectedOneTimeToken?.decimals}
						/>
						<DonationPrice
							disabled={!selectedOneTimeToken || !connected}
						>
							{'$ ' + donationUsdValue.toFixed(2)}
						</DonationPrice>
					</InputWrapper>
					{selectedOneTimeToken ? (
						<FlexStyled
							gap='4px'
							$alignItems='center'
							disabled={!selectedOneTimeToken}
						>
							<GLinkStyled
								size='Small'
								onClick={() =>
									setAmount(
										toUnits(
											selectedTokenBalance,
											tokenDecimals,
										) - gasFee,
									)
								}
							>
								{formatMessage({
									id: 'label.available',
								})}
								:{' '}
								{selectedOneTimeToken
									? tokenDecimals === 8
										? truncateToDecimalPlaces(
												formatUnits(
													toUnits(
														selectedTokenBalance,
														tokenDecimals,
													),
													tokenDecimals,
												),
												18 / 3,
											)
										: truncateToDecimalPlaces(
												formatUnits(
													toUnits(
														selectedTokenBalance,
														tokenDecimals,
													),
													tokenDecimals,
												),
												tokenDecimals / 3,
											)
									: 0.0}
							</GLinkStyled>
							{insufficientGasFee && (
								<WarnError>
									Your wallet balance is insufficient to cover
									the gas fees. Please add more ADA to your
									wallet.
								</WarnError>
							)}
							{insufficientAmountFee && (
								<WarnError>
									Your donation amount is insufficient. Please
									donate at least 1 ADA if paying with ADA, or
									the equivalent of 1 ADA when donating with
									another token.
								</WarnError>
							)}
						</FlexStyled>
					) : (
						<div style={{ height: '21.5px' }} />
					)}
				</FlexStyled>
				<CardanoTotalDonation
					totalDonation={amount}
					projectTitle={projectTitle}
					token={selectedOneTimeToken}
					isActive={!donationDisabled}
				/>
				{!isActive && (
					<InlineToast
						type={EToastType.Warning}
						message={formatMessage({
							id: 'label.this_project_is_not_active',
						})}
					/>
				)}
				{connected &&
					(donationDisabled ? (
						<OutlineButtonStyled
							label={formatMessage({ id: 'label.donate' })}
							disabled
							size='medium'
						/>
					) : (
						<MainButton
							id='Donate_Final'
							label={formatMessage({ id: 'label.donate' })}
							size='medium'
							onClick={handleDonate}
						/>
					))}
				{!connected && (
					<MainButton
						label='Connect Cardano Wallet'
						onClick={() => setShowCardanoConnectWalletModal(true)}
					/>
				)}
				<DonateAnonymously
					anonymous={anonymous}
					setAnonymous={setAnonymous}
					selectedToken={selectedOneTimeToken}
				/>
				{connected && (
					<DisconnectButton
						label='Disconnect Cardano Wallet'
						onClick={() =>
							handleWalletDisconnect(disconnect, () =>
								setSelectedCardanoWallet(null),
							)
						}
					/>
				)}
				{showSelectTokenModal && (
					<CardanoSelectTokenModal
						setShowModal={setShowSelectTokenModal}
						tokens={erc20List}
						acceptCustomToken={
							project.organization?.supportCustomTokens
						}
					/>
				)}
				{showCardanoConnectWalletModal && (
					<CardanoConnectWalletModal
						setShowCardanoConnectWalletModal={
							setShowCardanoConnectWalletModal
						}
						setSelectedCardanoWallet={setSelectedCardanoWallet}
					/>
				)}
			</ForEstimatedMatchingAnimation>
		</MainContainer>
	);
};

const OutlineButtonStyled = styled(OutlineButton)`
	width: 100%;
`;

const DonationPrice = styled(SublineBold)<{ disabled?: boolean }>`
	position: absolute;
	right: 16px;
	border-radius: 4px;
	background: ${neutralColors.gray[300]};
	padding: 2px 8px !important;
	margin: 16px 0px;
	color: ${neutralColors.gray[700]} !important;
	opacity: ${props => (props.disabled ? 0.4 : 1)};
	height: 22px;
`;

const FlexStyled = styled(Flex)<{ disabled: boolean }>`
	border-radius: 8px;
	background-color: white;
	${props =>
		props.disabled &&
		`
		opacity: 0.5;
		pointer-events: none;
	`}
`;

const ConnectWallet = styled(BadgesBase)`
	margin: 12px 0 54px 0;
`;

const WarnError = styled.div`
	color: ${semanticColors.punch[500]};
	font-size: 11px;
	padding: 12px;
`;

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 60%;
	justify-content: space-between;
	text-align: left;
`;

const TokenSymbol = styled(B)`
	white-space: nowrap;
`;

const MainButton = styled(Button)`
	width: 100%;
	background-color: ${props =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};
	color: white;
	text-transform: uppercase;
`;

const DisconnectButton = styled(Button)`
	width: 100%;
	margin-top: 12px;
	background-color: ${brandColors.giv[500]};
	color: white;
	text-transform: uppercase;
`;

export default CardanoCryptoDonation;
