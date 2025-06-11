import styled from 'styled-components';
import {
	useEstimateGas,
	useEstimateFeesPerGas,
	useAccount,
	useBalance,
	useSwitchChain,
	useWriteContract,
	useWaitForTransactionReceipt,
} from 'wagmi';
import {
	formatUnits,
	Address,
	Chain,
	zeroAddress,
	parseUnits,
	erc20Abi,
} from 'viem';
import {
	brandColors,
	P,
	Container,
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
import config from '@/configuration';
import { CauseCreateProjectCard } from '@/components/views/causes/create/CauseCreateProjectCard';
import { formatDonation } from '@/helpers/number';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useNetworkId } from '@/hooks/useNetworkId';
import {
	BackButton,
	ButtonContainer,
	PreviousButtonContainer,
	NextDescription,
} from '@/components/views/causes/create/Create.sc';
import LaunchCauseModal from '@/components/views/causes/create/LaunchCauseModal';

export const CauseReviewStep = ({ onPrevious }: { onPrevious: () => void }) => {
	const { formatMessage } = useIntl();
	const {
		getValues,
		setValue,
		formState: { isValid },
	} = useFormContext();
	const { switchChain } = useSwitchChain();

	// Check previus form states - return to second step if not valid
	if (
		!getValues('title') ||
		!getValues('description') ||
		!getValues('categories') ||
		!getValues('image') ||
		!getValues('selectedProjects')
	) {
		onPrevious();
	}

	// Modal states
	const [showLaunchModal, setShowLaunchModal] = useState(false);
	const [isLaunching, setIsLaunching] = useState(false);
	const [launched, setLaunched] = useState(false);

	// Contract writing hook
	const { writeContractAsync } = useWriteContract();

	// Transaction state
	const [approvalTxHash, setApprovalTxHash] = useState<
		`0x${string}` | undefined
	>();

	// Wait for transaction receipt
	const {
		isSuccess: isApprovalSuccess,
		isLoading: isApprovalPending,
		isError: isApprovalError,
		error: approvalError,
	} = useWaitForTransactionReceipt({
		hash: approvalTxHash,
	});

	// Handle transaction confirmation
	useEffect(() => {
		if (isApprovalSuccess && approvalTxHash) {
			console.log('Approval transaction confirmed:', approvalTxHash);
			setValue('transactionStatus', 'success');
			setValue('approvalConfirmed', true);
			setLaunched(true);
			setIsLaunching(false);
		} else if (isApprovalError && approvalTxHash) {
			console.error('Approval transaction failed:', approvalError);
			setValue('transactionStatus', 'failed');
			setValue(
				'transactionError',
				approvalError?.message || 'Transaction failed',
			);
			setIsLaunching(false);
		}
	}, [
		isApprovalSuccess,
		isApprovalError,
		approvalTxHash,
		approvalError,
		setValue,
	]);

	// Get GIV token price using CoinGecko
	const givTokenPrice = useTokenPrice({
		symbol: 'GIV',
		coingeckoId: 'giveth',
	});

	// Get current account and chain for gas estimation
	const { chain } = useAccount();
	const currentChainId = chain?.id;

	// Use network ID hook
	const currentNetworkId = useNetworkId();

	// Check if current network supports cause creation
	const supportedNetwork = config.CAUSES_CONFIG.launchNetworks.find(
		network => network.network === currentChainId,
	);
	
	// Get launch token for current network
	const launchToken = supportedNetwork?.token || 'GIV';

	// Get native token info for current network
	const nativeTokenInfo = useMemo(() => {
		switch (currentChainId) {
			case config.MAINNET_NETWORK_NUMBER:
				return { symbol: 'ETH', coingeckoId: 'ethereum' };
			case config.GNOSIS_NETWORK_NUMBER:
				return { symbol: 'xDAI', coingeckoId: 'xdai' };
			case config.POLYGON_NETWORK_NUMBER:
				return { symbol: 'MATIC', coingeckoId: 'matic-network' };
			case config.OPTIMISM_NETWORK_NUMBER:
				return { symbol: 'ETH', coingeckoId: 'ethereum' };
			case config.BASE_NETWORK_NUMBER:
				return { symbol: 'ETH', coingeckoId: 'ethereum' };
			case config.ARBITRUM_NETWORK_NUMBER:
				return { symbol: 'ETH', coingeckoId: 'ethereum' };
			default:
				return { symbol: 'ETH', coingeckoId: 'ethereum' };
		}
	}, [currentChainId]);

	// Estimate gas for a typical transaction (placeholder address for estimation)
	const estimatedGasFeeObj = useMemo(() => {
		if (!supportedNetwork || !chain) return null;

		const selectedChain = chain as Chain;
		// Using GIV token address for the current network as placeholder
		const tokenAddress =
			currentChainId === config.GNOSIS_NETWORK_NUMBER
				? config.GNOSIS_CONFIG.GIV_TOKEN_ADDRESS
				: currentChainId === config.POLYGON_NETWORK_NUMBER
					? config.POLYGON_CONFIG.GIV_TOKEN_ADDRESS
					: currentChainId === config.OPTIMISM_NETWORK_NUMBER
						? config.OPTIMISM_CONFIG.GIV_TOKEN_ADDRESS
						: '0x0000000000000000000000000000000000000000';

		return {
			chainId: selectedChain?.id,
			to: tokenAddress as Address,
			value: 0n,
		};
	}, [chain, supportedNetwork, currentChainId]);

	const { data: estimatedGas } = useEstimateGas(
		estimatedGasFeeObj || undefined,
	);
	const { data: estimatedGasPrice } = useEstimateFeesPerGas(
		estimatedGasFeeObj || undefined,
	);

	// Calculate gas fee in native token
	const gasFee = useMemo((): bigint => {
		if (
			!supportedNetwork ||
			!estimatedGas ||
			!estimatedGasPrice?.maxFeePerGas
		) {
			return 0n;
		}
		return estimatedGas * estimatedGasPrice.maxFeePerGas;
	}, [supportedNetwork, estimatedGas, estimatedGasPrice?.maxFeePerGas]);

	// Format gas fee for display
	const gaseFeeFormatted = useMemo(() => {
		if (gasFee === 0n || !supportedNetwork)
			return `0.000000${nativeTokenInfo.symbol}`;
		return `${parseFloat(formatUnits(gasFee, 18)).toFixed(6)}${nativeTokenInfo.symbol}`;
	}, [gasFee, supportedNetwork, nativeTokenInfo.symbol]);

	// Calculate USD value of gas fee using native token price
	const nativeTokenPrice = useTokenPrice({
		symbol: nativeTokenInfo.symbol,
		coingeckoId: nativeTokenInfo.coingeckoId,
	});

	const gasFeeUSD = useMemo(() => {
		if (!nativeTokenPrice || gasFee === 0n || !supportedNetwork)
			return '0.00';
		const tokenAmount = parseFloat(formatUnits(gasFee, 18));
		return (nativeTokenPrice * tokenAmount).toFixed(2);
	}, [nativeTokenPrice, gasFee, supportedNetwork]);

	// Get current user's GIV token balance
	const { address } = useAccount();
	const givTokenAddress = useMemo(() => {
		if (!supportedNetwork) return undefined;
		const address =
			currentChainId === config.GNOSIS_NETWORK_NUMBER
				? config.GNOSIS_CONFIG.GIV_TOKEN_ADDRESS
				: currentChainId === config.POLYGON_NETWORK_NUMBER
					? config.POLYGON_CONFIG.GIV_TOKEN_ADDRESS
					: currentChainId === config.OPTIMISM_NETWORK_NUMBER
						? config.OPTIMISM_CONFIG.GIV_TOKEN_ADDRESS
						: undefined;

		console.log('Token address debug:', {
			currentChainId,
			supportedNetwork,
			polygonGivAddress: config.POLYGON_CONFIG?.GIV_TOKEN_ADDRESS,
			resolvedAddress: address,
		});

		return address;
	}, [supportedNetwork, currentChainId]);

	const { data: givBalance } = useBalance({
		address: address,
		token:
			givTokenAddress && givTokenAddress !== zeroAddress
				? (givTokenAddress as Address)
				: undefined,
	});

	const givBalanceFormatted = useMemo(() => {
		if (!supportedNetwork) return '0.00';
		if (!givTokenAddress) {
			// GIV token not available on this network
			return 'N/A';
		}
		if (!givBalance) return '0.00';
		return formatDonation(
			parseFloat(formatUnits(givBalance.value, givBalance.decimals)),
			'',
		);
	}, [givBalance, supportedNetwork, givTokenAddress]);

	// Get value from previous step
	const title = getValues('title');
	const description = getValues('description');
	const categories = getValues('categories');
	const image = getValues('image');
	const selectedProjects = getValues('selectedProjects');

	// Get transaction status
	const transactionStatus = getValues('transactionStatus'); // 'pending' | 'success' | 'failed'
	const transactionHash = getValues('transactionHash');
	const transactionError = getValues('transactionError');

	// Calculate USD value of launch fee
	const launchFeeUSD = givTokenPrice
		? (givTokenPrice * config.CAUSES_CONFIG.launchFee).toFixed(2)
		: '0.00';

	// If someone skipped first step return to first step
	useEffect(() => {
		if (
			!title ||
			!description ||
			!categories ||
			categories.length === 0 ||
			!image ||
			!selectedProjects ||
			selectedProjects.length <
				config.CAUSES_CONFIG.minSelectedProjects ||
			selectedProjects.length > config.CAUSES_CONFIG.maxSelectedProjects
		) {
			onPrevious();
		}
	}, [title, description, categories, image, selectedProjects, onPrevious]);

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
			!image ||
			!selectedProjects ||
			selectedProjects.length <
				config.CAUSES_CONFIG.minSelectedProjects ||
			selectedProjects.length >
				config.CAUSES_CONFIG.maxSelectedProjects ||
			!givBalance ||
			parseFloat(givBalanceFormatted) < config.CAUSES_CONFIG.launchFee ||
			!givTokenAddress ||
			!supportedNetwork
		) {
			return;
		}
		setShowLaunchModal(true);
	};

	const handleLaunchComplete = () => {
		console.log('handleLaunchComplete');
		setTimeout(() => {
			const form = document.querySelector('form');
			console.log('form', form);
			if (form) {
				const submitEvent = new Event('submit', {
					bubbles: true,
					cancelable: true,
				});
				form.dispatchEvent(submitEvent);
			}
		}, 3000);
	};

	// Handle launch cause transaction - approve GIV token transfer and submit form
	const handleLaunch = async () => {
		setIsLaunching(true);
		try {
			// Approve GIV token transaction
			if (
				!address ||
				!currentChainId ||
				!givTokenAddress ||
				!supportedNetwork
			) {
				throw new Error('Missing required parameters for approval');
			}

			// Get the destination address for the current network
			const destinationAddress = supportedNetwork.destinationAddress;

			// Convert launch fee to wei (18 decimals for GIV token)
			const launchFeeAmount = parseUnits(
				config.CAUSES_CONFIG.launchFee.toString(),
				18,
			);

			// Approve GIV token transfer using writeContract to get transaction hash
			const txHash = await writeContractAsync({
				address: givTokenAddress as Address,
				abi: erc20Abi,
				functionName: 'approve',
				args: [destinationAddress, launchFeeAmount],
				chainId: currentChainId,
			});

			// Set transaction hash to trigger useWaitForTransactionReceipt
			setApprovalTxHash(txHash);

			// Save transaction details to form
			setValue('transactionNetworkId', currentChainId);
			setValue('transactionHash', txHash);

			if (txHash) {
				setValue('transactionStatus', 'success');
			}

			setIsLaunching(false);
			handleLaunchComplete();
		} catch (error) {
			setValue('transactionStatus', 'failed');
			setValue(
				'transactionError',
				(error as Error)?.message || 'Transaction failed',
			);
			setIsLaunching(false);
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
				</Row>
			</CauseInfo>
			<CauseProjects>
				<InfoTitle>
					{formatMessage({
						id: 'label.cause.selected_projects',
					})}{' '}
					({selectedProjects.length})
				</InfoTitle>
				<Row>
					{selectedProjects.map((project: any) => (
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
										id: 'label.cause.transaction_fee',
									})}
								</InfoLabel>
								<InfoValueColumn>
									<InfoValue>{gaseFeeFormatted}</InfoValue>
									<InfoSubValue>${gasFeeUSD}USD</InfoSubValue>
								</InfoValueColumn>
							</InfoRow>
							<InfoRow>
								<InfoLabel>
									{formatMessage({
										id: 'label.cause.balance',
									})}{' '}
									{givTokenAddress ? (
										<>
											{givBalanceFormatted}{' '}
											{launchToken}
										</>
									) : (
										<span style={{ color: '#666' }}>
											{formatMessage({
												id: 'label.cause.giv_not_available',
											})}
										</span>
									)}
									<InfoText>
										{formatMessage({
											id: 'label.cause.check_network',
										})}{' '}
										<NetworkLink
											onClick={() =>
												changeUserWalletNetwork(
													config.CAUSES_CONFIG
														.launchNetworks[0]
														.network,
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
														.launchNetworks[1]
														.network,
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
														.launchNetworks[2]
														.network,
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
								</InfoLabel>
							</InfoRow>
						</Col>
						<Col lg={6} md={12}>
							<InfoText>
								{formatMessage({
									id: 'label.cause.one_time_fee',
								})}
							</InfoText>
							<InfoText>
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
							</InfoText>
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
				<Button
					buttonType='primary'
					size='large'
					onClick={handleLastStep}
					disabled={
						!title?.trim() ||
						!isValid ||
						!description?.trim() ||
						!categories ||
						categories.length === 0 ||
						!image ||
						selectedProjects?.length <
							config.CAUSES_CONFIG.minSelectedProjects ||
						selectedProjects?.length >
							config.CAUSES_CONFIG.maxSelectedProjects
					}
					label={formatMessage({ id: 'label.cause.launch_cause' })}
				/>
			</ButtonContainer>
			{showLaunchModal && (
				<LaunchCauseModal
					setShowModal={setShowLaunchModal}
					onLaunch={handleLaunch}
					isLaunching={isLaunching}
					launched={launched}
					transactionStatus={transactionStatus}
					transactionHash={transactionHash}
					transactionError={transactionError}
					isApprovalPending={isApprovalPending}
					handleLaunchComplete={handleLaunchComplete}
				/>
			)}
		</StyledContainer>
	);
};

const StyledContainer = styled(Container)`
	margin-top: 56px;
`;

const Title = styled(H3)`
	margin-bottom: 12px;
	color: ${brandColors.deep[600]};
	font-weight: bold;
`;

const Desc = styled(P)`
	margin-bottom: 48px;
	color: ${brandColors.deep[600]};
`;

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

const InfoValueColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const InfoSubValue = styled.div`
	font-weight: 400;
	font-size: 12px;
	line-height: 150%;
	color: ${neutralColors.gray[600]};
`;

const InfoText = styled.div`
	display: inline-block;
	padding-left: 40px;
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
