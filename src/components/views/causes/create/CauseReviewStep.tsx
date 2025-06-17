import styled from 'styled-components';
import {
	useEstimateGas,
	useEstimateFeesPerGas,
	useAccount,
	useBalance,
	useSwitchChain,
} from 'wagmi';
import { formatUnits, Address, Chain, parseUnits } from 'viem';
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
import LaunchCauseModal from '@/components/views/causes/create/LaunchCauseModal';
import {
	approveTokenTransfer,
	checkTokenApproval,
	transferToken,
} from './helpers';

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
	const [showLaunchModal, setShowLaunchModal] = useState(false);
	const [isLaunching, setIsLaunching] = useState(false);
	const [lunchStatus, setLunchStatus] = useState<
		| 'approval'
		| 'approval_success'
		| 'approval_failed'
		| 'transfer_success'
		| 'transfer_failed'
		| null
	>('approval');

	// Contract writing hook
	// const { writeContractAsync } = useWriteContract();

	// // Handle approval confirmation
	// useEffect(() => {
	// 	if (isApprovalSuccess && approvalTxHash) {
	// 		console.log('Approval transaction confirmed:', approvalTxHash);
	// 		// Show transfer modal after approval succeeds
	// 		setShowTransferModal(true);
	// 		setShowLaunchModal(false);
	// 	} else if (isApprovalError && approvalTxHash) {
	// 		console.error('Approval transaction failed:', approvalError);
	// 		setValue('transactionStatus', 'failed');
	// 		setValue(
	// 			'transactionError',
	// 			approvalError?.message || 'Approval transaction failed',
	// 		);
	// 		setIsLaunching(false);
	// 		setShowLaunchModal(false);
	// 	}
	// }, [isApprovalSuccess, isApprovalError, approvalTxHash, approvalError]);

	// // Handle transfer confirmation
	// useEffect(() => {
	// 	if (isTransferSuccess && transferTxHash) {
	// 		console.log('Transfer transaction confirmed:', transferTxHash);
	// 		setValue('transactionStatus', 'success');
	// 		setValue('approvalConfirmed', true);
	// 		setLaunched(true);
	// 		setIsLaunching(false);
	// 		setShowTransferModal(false);
	// 		handleLaunchComplete();
	// 	} else if (isTransferError && transferTxHash) {
	// 		console.error('Transfer transaction failed:', transferError);
	// 		setValue('transactionStatus', 'failed');
	// 		setValue(
	// 			'transactionError',
	// 			transferError?.message || 'Transfer transaction failed',
	// 		);
	// 		setIsLaunching(false);
	// 		setShowTransferModal(false);
	// 	}
	// }, [isTransferSuccess, isTransferError, transferTxHash, transferError]);

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

	// Get current user's token balance
	const { address } = useAccount();

	const { data: balance } = useBalance({
		address: address,
		token: supportedNetwork?.tokenAddress,
	});

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
	const categories = getValues('categories');
	const image = getValues('image');
	const selectedProjects = getValues('selectedProjects');

	// Get transaction status
	const transactionStatus = getValues('transactionStatus'); // 'pending' | 'success' | 'failed'
	const transactionHash = getValues('transactionHash');
	const transactionError = getValues('transactionError');

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
		const tokenBalance =
			balance?.value && balance?.decimals
				? parseFloat(formatUnits(balance.value, balance.decimals))
				: 0;

		console.log('--- handleLastStep checks ---');
		console.log('title:', title);
		console.log('description:', description);
		console.log('categories:', categories);
		console.log('categories.length === 0:', categories?.length === 0);
		console.log('image:', image);
		console.log('selectedProjects:', selectedProjects);
		console.log(
			'selectedProjects.length < min:',
			selectedProjects?.length < config.CAUSES_CONFIG.minSelectedProjects,
		);
		console.log(
			'selectedProjects.length > max:',
			selectedProjects?.length > config.CAUSES_CONFIG.maxSelectedProjects,
		);
		console.log('tokenBalance:', tokenBalance);
		console.log('launchFee:', config.CAUSES_CONFIG.launchFee);
		console.log(
			'tokenBalance < launchFee:',
			tokenBalance < config.CAUSES_CONFIG.launchFee,
		);
		console.log(
			'supportedNetwork?.tokenAddress:',
			supportedNetwork?.tokenAddress,
		);
		console.log('supportedNetwork:', supportedNetwork);
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
			!balance ||
			parseInt(
				formatUnits(balance?.value || 0n, balance?.decimals || 18),
			) < config.CAUSES_CONFIG.launchFee ||
			!supportedNetwork?.tokenAddress ||
			!supportedNetwork
		) {
			return;
		}
		setShowLaunchModal(true);
	};

	const handleApproval = async () => {
		setIsLaunching(true);
		setValue('transactionStatus', 'pending');
		try {
			if (
				!address ||
				!currentChainId ||
				!supportedNetwork?.tokenAddress ||
				!supportedNetwork?.destinationAddress
			) {
				throw new Error('Missing required parameters for approval');
			}

			const checkApproval = await checkTokenApproval({
				tokenAddress: supportedNetwork.tokenAddress,
				owner: address,
				spender: supportedNetwork.destinationAddress,
				requiredAmount: launchFeeAmount,
				chainId: currentChainId,
			});

			console.log('checkApproval', checkApproval);

			// Approval already done
			if (checkApproval) {
				setLunchStatus('approval_success');
				setIsLaunching(false);
				return;
			}
			// Approval not done ask for it
			else {
				const approvalTxHash = await approveTokenTransfer({
					tokenAddress: supportedNetwork.tokenAddress,
					spender: supportedNetwork.destinationAddress,
					amount: launchFeeAmount,
					chainId: currentChainId,
				});

				if (!approvalTxHash) {
					setLunchStatus('approval_failed');
					setIsLaunching(false);
					throw new Error('Token approval transaction failed');
				}

				setLunchStatus('approval_success');
				setIsLaunching(false);
			}
		} catch (error) {
			console.error('Approval failed:', error);
			setLunchStatus('approval_failed');
			setValue(
				'transactionError',
				(error as Error)?.message || 'Approval failed',
			);
			setIsLaunching(false);
		}
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

			if (!txHash) {
				setValue('transactionStatus', 'failed');
				setValue('transactionHash', txHash);
				setValue('transactionError', 'Transfer failed');
				setLunchStatus('transfer_failed');
				setIsLaunching(false);
				throw new Error('Token transfer transaction failed');
			}

			setValue('transactionStatus', 'success');
			setValue('transactionHash', txHash);
			setValue('transactionNetworkId', currentChainId);
			setValue('transactionError', '');
			setLunchStatus('transfer_success');
			setIsLaunching(false);
			handleLaunchComplete();
		} catch (error) {
			console.error('Transfer failed:', error);
			setLunchStatus('transfer_failed');
			setValue(
				'transactionError',
				(error as Error)?.message || 'Transfer failed',
			);
			setIsLaunching(false);
		}
	};

	// Handle launch complete - submit form
	// Added 3 seconds delay to allow for transaction to be confirmed
	const handleLaunchComplete = () => {
		console.log('handleLaunchComplete');
		setTimeout(() => {
			const form = document.querySelector('form');
			if (form) {
				const submitEvent = new Event('submit', {
					bubbles: true,
					cancelable: true,
				});
				form.dispatchEvent(submitEvent);
			}
		}, 3000);
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
					isLaunching={isLaunching}
					lunchStatus={lunchStatus}
					transactionStatus={transactionStatus}
					transactionHash={transactionHash}
					transactionError={transactionError}
					handleApproval={handleApproval}
					handleTransfer={handleTransfer}
					handleLaunchComplete={handleLaunchComplete}
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
