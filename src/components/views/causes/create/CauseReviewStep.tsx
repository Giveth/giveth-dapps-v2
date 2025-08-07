import styled from 'styled-components';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import {
	brandColors,
	P,
	H3,
	neutralColors,
	H6,
	Col,
	Row,
	H4,
	Button,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import toast from 'react-hot-toast';
import config from '@/configuration';
import { CauseCreateProjectCard } from '@/components/views/causes/create/CauseCreateProjectCard';
import { formatDonation } from '@/helpers/number';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import {
	BackButton,
	ButtonContainer,
	PreviousButtonContainer,
	NextDescription,
	StyledContainer,
	Title,
	Desc,
} from '@/components/views/causes/create/Create.sc';
import { transferToken } from './helpers';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { formatTxLink } from '@/lib/helpers';
import { gToast, ToastType } from '@/components/toasts';

interface IProps {
	onPrevious: () => void;
	isSubmitting?: boolean;
	handleLaunchComplete: () => void;
}

export const CauseReviewStep = ({
	onPrevious,
	isSubmitting = false,
	handleLaunchComplete,
}: IProps) => {
	const { formatMessage } = useIntl();
	const {
		getValues,
		setValue,
		formState: { isValid },
	} = useFormContext();
	const { switchChain } = useSwitchChain();
	const { open: openConnectModal } = useWeb3Modal();

	// Check previus form states - return to second step if not valid
	if (
		!getValues('title') ||
		!getValues('description') ||
		!getValues('categories') ||
		!getValues('selectedProjects')
	) {
		onPrevious();
	}

	// Get current account and chain for gas estimation
	const { chain } = useAccount();
	const currentChainId = chain?.id;

	// Check if current network supports cause creation
	const supportedNetwork = config.CAUSES_CONFIG.launchNetworks.find(
		network => network.network === currentChainId,
	);

	// Get launch token for current network
	const launchToken = supportedNetwork?.token || '';

	// Get token price using CoinGecko
	const launchTokenPrice = useTokenPrice({
		symbol: supportedNetwork?.symbol || '',
		coingeckoId: supportedNetwork?.coingeckoId || '',
	});

	// Modal states
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const [isLaunching, setIsLaunching] = useState(false);
	const [lunchStatus, setLunchStatus] = useState<
		'transfer' | 'transfer_success' | 'transfer_failed' | null
	>('transfer');

	// Get current user's token balance
	const { address } = useAccount();

	const { data: balance } = useBalance({
		address: address,
		token: supportedNetwork?.tokenAddress,
	});

	// Check token balance
	const [haveTokenBalance, setHaveTokenBalance] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const formatted = formatUnits(
				balance?.value || 0n,
				balance?.decimals || 18,
			);
			setHaveTokenBalance(
				Boolean(
					balance &&
						Number(formatted) > config.CAUSES_CONFIG.launchFee,
				),
			);
		}, 1000); // 1 second delay

		return () => clearTimeout(timeout);
	}, [balance]);

	const tokenBalanceFormatted = useMemo(() => {
		if (!supportedNetwork) return '0.00';
		if (!supportedNetwork.tokenAddress) {
			// Token not available on this network
			return 'N/A';
		}
		if (!balance) return '0.00';
		return formatDonation(
			parseFloat(formatUnits(balance.value, balance.decimals)),
			'',
		);
	}, [balance, supportedNetwork]);

	// Get value from previous step
	const title = getValues('title');
	const description = getValues('description');
	const image = getValues('image');
	const categories = getValues('categories');
	const selectedProjects = getValues('selectedProjects');

	// Get transaction status
	const transactionStatus = getValues('transactionStatus'); // 'pending' | 'success' | 'failed'
	const transactionHash = getValues('transactionHash');

	const handleTxLink = (txHash?: string) => {
		return formatTxLink({
			txHash,
			networkId: currentChainId,
		});
	};

	// Get launch fee amount in wei
	const launchFeeAmount = parseUnits(
		config.CAUSES_CONFIG.launchFee.toString(),
		18,
	);

	// Calculate USD value of launch fee
	const launchFeeUSD = launchTokenPrice
		? (launchTokenPrice * config.CAUSES_CONFIG.launchFee).toFixed(2)
		: '0.00';

	// If someone skipped first step return to first step
	useEffect(() => {
		if (
			!title ||
			!description ||
			!categories ||
			categories.length === 0 ||
			!selectedProjects ||
			selectedProjects.length <
				config.CAUSES_CONFIG.minSelectedProjects ||
			selectedProjects.length > config.CAUSES_CONFIG.maxSelectedProjects
		) {
			onPrevious();
		}
	}, [title, description, categories, selectedProjects, onPrevious]);

	const changeUserWalletNetwork = (networkId: number) => {
		switchChain({ chainId: networkId });
	};

	const handleLastStep = () => {
		// Check are all data provided and valid
		if (
			!title ||
			!description ||
			!categories ||
			categories.length === 0 ||
			!selectedProjects ||
			selectedProjects.length <
				config.CAUSES_CONFIG.minSelectedProjects ||
			selectedProjects.length >
				config.CAUSES_CONFIG.maxSelectedProjects ||
			!balance ||
			parseInt(
				formatUnits(balance?.value || 0n, balance?.decimals || 18),
			) < config.CAUSES_CONFIG.launchFee ||
			!supportedNetwork?.tokenAddress ||
			!supportedNetwork
		) {
			// Check supproted networks - load switch network modal
			if (!supportedNetwork?.tokenAddress) {
				// call modal for switching network
				openConnectModal({ view: 'Networks' });
				return;
			}

			return;
		}

		// Reset transaction error
		setValue('transactionError', '');

		handleLaunch();
	};

	const handleTransfer = async () => {
		setIsLaunching(true);
		setValue('transactionStatus', 'pending');
		try {
			if (
				!address ||
				!currentChainId ||
				!supportedNetwork?.tokenAddress
			) {
				throw new Error('Missing required parameters for transfer');
			}

			const txHash = await transferToken({
				tokenAddress: supportedNetwork.tokenAddress,
				to: supportedNetwork.destinationAddress,
				amount: launchFeeAmount,
				chainId: currentChainId,
			});

			gToast(
				formatMessage({
					id: 'label.transaction_submitted_processing',
				}),
				{
					type: ToastType.INFO_PRIMARY,
					position: 'top-right',
					returnID: true,
					duration: Infinity,
				},
			);

			if (!txHash) {
				setValue('transactionStatus', 'failed');
				setValue('transactionHash', txHash);
				setValue('transactionError', 'Transfer failed');
				setLunchStatus('transfer_failed');
				setIsLaunching(false);
				setFailedModalType(EDonationFailedType.FAILED);
				toast.remove();
				throw new Error('Token transfer transaction failed');
			}

			setValue('transactionStatus', 'success');
			setValue('transactionHash', txHash);
			setValue('transactionNetworkId', currentChainId);
			setValue('transactionError', '');
			setLunchStatus('transfer_success');
			setIsLaunching(false);

			// Show toast success
			if (txHash) {
				toast.remove();

				gToast(
					formatMessage({
						id: 'label.transaction_successful',
					}),
					{
						type: ToastType.SUCCESS,
						position: 'top-right',
						duration: 8000,
					},
				);
			}

			handleLaunchComplete();
		} catch (error) {
			toast.remove(); // Remove all toast notifications
			console.error('Transfer failed:', error);
			setLunchStatus('transfer_failed');
			setValue(
				'transactionError',
				(error as Error)?.message || 'Transfer failed',
			);
			setFailedModalType(EDonationFailedType.FAILED);
			setIsLaunching(false);
		}
	};

	// Handle launch flow
	const handleLaunch = () => {
		// First try to transfer the token
		if (lunchStatus === 'transfer_failed' || lunchStatus === 'transfer') {
			toast.remove();
			handleTransfer?.();
		}

		// Finally try to launch the cause
		if (
			lunchStatus === 'transfer_success' &&
			transactionHash &&
			transactionStatus === 'success'
		) {
			handleLaunchComplete?.();
		}
	};

	return (
		<StyledContainer>
			<Title>
				{formatMessage({ id: 'label.cause.review_and_launch' })}
			</Title>
			<Desc>
				{formatMessage({
					id: 'label.cause.review_and_launch_desc',
				})}
			</Desc>
			<CauseInfo>
				<InfoTitle>
					{formatMessage({
						id: 'label.cause.cause_information',
					})}
				</InfoTitle>
				<Row>
					<Col lg={8} md={12}>
						<TitleLable>
							{formatMessage({
								id: 'label.cause.title',
							})}
						</TitleLable>
						<TitleValue>{title}</TitleValue>
						<TitleLable>
							{formatMessage({
								id: 'label.cause.create_description',
							})}
						</TitleLable>
						<DescriptionValue
							dangerouslySetInnerHTML={{
								__html: description || 'No description',
							}}
						/>
					</Col>
					{image && (
						<Col lg={4} md={12}>
							<CauseImage>
								<Image
									src={image}
									alt='cause image'
									width={380}
									height={220}
								/>
							</CauseImage>
						</Col>
					)}
				</Row>
			</CauseInfo>
			<CauseProjects>
				<InfoTitle>
					{formatMessage({
						id: 'label.cause.selected_projects',
					})}{' '}
					({selectedProjects?.length})
				</InfoTitle>
				<Row>
					{selectedProjects &&
						selectedProjects.map((project: any) => (
							<Col lg={4} md={12} key={project.id}>
								<CauseCreateProjectCard
									project={project}
									showOptions={false}
								/>
							</Col>
						))}
				</Row>
			</CauseProjects>
			<CauseLaunch>
				<InfoTitle>
					{formatMessage({
						id: 'label.cause.launch_fee',
					})}
				</InfoTitle>
				<LaunchFeeInfo>
					<TokenAmount>
						{formatDonation(config.CAUSES_CONFIG.launchFee, '')}{' '}
						{launchToken}
					</TokenAmount>
					<UsdAmount>
						<span>≈ ${launchFeeUSD}</span>
					</UsdAmount>
				</LaunchFeeInfo>
				<LaunchInfo>
					<Row style={{ gap: '64px' }}>
						<Col lg={5} md={12}>
							<InfoRow>
								<InfoLabel>
									{formatMessage({
										id: 'label.cause.deposit_amount',
									})}
								</InfoLabel>
								<InfoValue>
									{formatDonation(
										config.CAUSES_CONFIG.launchFee,
										'',
									)}{' '}
									{launchToken}
								</InfoValue>
							</InfoRow>
							<InfoRow>
								<InfoLabel>
									{formatMessage({
										id: 'label.cause.balance',
									})}{' '}
									{supportedNetwork?.tokenAddress ? (
										<>
											{tokenBalanceFormatted}{' '}
											{launchToken}
										</>
									) : (
										<span style={{ color: '#666' }}>
											{formatMessage({
												id: 'label.cause.giv_not_available',
											})}
										</span>
									)}
								</InfoLabel>
								<InfoText>
									{formatMessage({
										id: 'label.cause.check_network',
									})}{' '}
									<NetworkLink
										onClick={() =>
											changeUserWalletNetwork(
												config.CAUSES_CONFIG
													.launchNetworks[0].network,
											)
										}
									>
										{
											config.CAUSES_CONFIG
												.launchNetworks[0].name
										}
									</NetworkLink>
									,{' '}
									<NetworkLink
										onClick={() =>
											changeUserWalletNetwork(
												config.CAUSES_CONFIG
													.launchNetworks[1].network,
											)
										}
									>
										{
											config.CAUSES_CONFIG
												.launchNetworks[1].name
										}
									</NetworkLink>{' '}
									{formatMessage({
										id: 'label.or',
									})}{' '}
									<NetworkLink
										onClick={() =>
											changeUserWalletNetwork(
												config.CAUSES_CONFIG
													.launchNetworks[2].network,
											)
										}
									>
										{
											config.CAUSES_CONFIG
												.launchNetworks[2].name
										}
									</NetworkLink>
									?
								</InfoText>
							</InfoRow>
							{!haveTokenBalance && (
								<InlineToast
									type={EToastType.Warning}
									message={formatMessage({
										id: 'label.cause.insufficient_giv_for_launch_fee',
									})}
								/>
							)}
						</Col>
						<Col lg={6} md={12}>
							<InfoTextRight>
								{formatMessage({
									id: 'label.cause.one_time_fee',
								})}
							</InfoTextRight>
							<InfoTextRight>
								{formatMessage({
									id: 'label.cause.dont_have_giv_tokens',
								})}{' '}
								<SwapLink
									href='https://jumper.exchange/?fromChain=1&fromToken=0x0000000000000000000000000000000000000000&toChain=10&toToken=0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98'
									target='_blank'
								>
									{formatMessage({
										id: 'label.cause.swap_link',
									})}
								</SwapLink>
							</InfoTextRight>
						</Col>
					</Row>
				</LaunchInfo>
			</CauseLaunch>
			<NextDescription>
				<H4>
					{formatMessage({
						id: 'label.cause.all_set',
					})}
				</H4>
				<P>
					{formatMessage({
						id: 'label.cause.all_set_desc',
					})}
				</P>
			</NextDescription>
			<ButtonContainer>
				<PreviousButtonContainer>
					<BackButton onClick={onPrevious}>
						{formatMessage({ id: 'label.cause.back' })}
					</BackButton>
				</PreviousButtonContainer>
				<ButtonWrapper
					buttonType='primary'
					size='large'
					onClick={handleLastStep}
					disabled={
						!title?.trim() ||
						!isValid ||
						!description?.trim() ||
						!categories ||
						categories.length === 0 ||
						selectedProjects?.length <
							config.CAUSES_CONFIG.minSelectedProjects ||
						selectedProjects?.length >
							config.CAUSES_CONFIG.maxSelectedProjects ||
						!haveTokenBalance ||
						isLaunching ||
						isSubmitting
					}
					label={formatMessage({ id: 'label.cause.launch_cause' })}
				/>
			</ButtonContainer>
			{lunchStatus === 'transfer_failed' && (
				<FailedDonation
					title={formatMessage({
						id: 'label.cause.launch_cause_failed',
					})}
					txUrl={handleTxLink(transactionHash)}
					setShowModal={() => {
						setFailedModalType(undefined);
						setLunchStatus('transfer');
					}}
					type={failedModalType || EDonationFailedType.FAILED}
				/>
			)}
		</StyledContainer>
	);
};

const CauseInfo = styled.div`
	padding: 24px;
	border-radius: 16px;
	background-color: ${neutralColors.gray[100]};
`;

const InfoTitle = styled(H6)`
	margin-bottom: 24px;
	font-weight: 400;
	font-size: 25px;
	color: ${brandColors.deep[600]};
`;

const CauseImage = styled.div`
	width: 100%;
	height: 100%;

	img {
		width: 100%;
		border-radius: 16px;
	}
`;

const TitleLable = styled.div`
	margin-bottom: 12px;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[600]};
	text-transform: uppercase;
`;

const TitleValue = styled.div`
	margin-bottom: 20px;
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 150%;
	color: ${neutralColors.gray[900]};
`;

const DescriptionValue = styled.div`
	font-weight: 400;
	font-size: 16px;
	line-height: 150%;
	color: ${neutralColors.gray[900]};

	p {
		margin: 0;
	}
`;

const CauseProjects = styled.div`
	margin-top: 36px;
	padding: 24px;
	border-radius: 16px;
	background-color: ${neutralColors.gray[100]};
`;

const CauseLaunch = styled.div`
	margin-top: 36px;
	padding: 24px 24px 0 24px;
	border-radius: 16px;
	background-color: ${neutralColors.gray[100]};
`;

const LaunchFeeInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const TokenAmount = styled(H3)`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: 700;
	font-size: 25px;
	line-height: 38px;
	letter-spacing: -0.005em;
	color: ${neutralColors.gray[900]};
`;

const UsdAmount = styled(P)`
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	line-height: 150%;
	color: ${neutralColors.gray[700]};

	span {
		display: inline-block;
		padding: 2px 4px;
		border-radius: 4px;
		background: #ebecf2;
		color: ${neutralColors.gray[900]};
	}
`;

const LaunchInfo = styled.div`
	margin-top: 24px;
	padding: 20px 0;
`;

const InfoRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12px;
`;

const InfoLabel = styled.div`
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[700]};
`;

const InfoValue = styled.div`
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[800]};
`;

const InfoText = styled.div`
	display: inline-block;
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const InfoTextRight = styled.div`
	display: block;
	width: 100%;
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const SwapLink = styled.a`
	color: ${brandColors.pinky[500]};
	text-decoration: none;
	font-weight: 500;

	&:hover {
		color: ${brandColors.pinky[700]};
		text-decoration: underline;
	}
`;

const NetworkLink = styled.a`
	color: ${brandColors.pinky[500]};
	text-decoration: none;
	font-weight: 500;
	cursor: pointer;

	&:hover {
		color: ${brandColors.pinky[700]};
		text-decoration: underline;
	}
`;

const ButtonWrapper = styled(Button)`
	&:disabled {
		background-color: ${neutralColors.gray[300]} !important;
		border-color: ${neutralColors.gray[300]} !important;
		span {
			color: ${neutralColors.gray[100]};
		}
	}
`;
