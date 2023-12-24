import { useState, type FC, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import {
	Caption,
	IconHelpFilled16,
	B,
	GLink,
	IconRefresh16,
	neutralColors,
	brandColors,
	Button,
} from '@giveth/ui-design-system';

import { useAccount, useBalance } from 'wagmi';
import { useIntl } from 'react-intl';
import { Framework } from '@superfluid-finance/sdk-core';
import { Flex } from '@/components/styled-components/Flex';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Spinner } from '@/components/Spinner';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { ISuperToken, IToken } from '@/types/superFluid';
import { AddressZero, ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import { findSuperTokenByTokenAddress } from '@/helpers/donate';
import { ITokenStreams } from '@/context/donate.context';
import { ModifyInfoToast } from './ModifyInfoToast';
import {
	EModifySuperTokenSteps,
	IModifySuperTokenInnerModalProps,
	actionButtonLabel,
} from './ModifySuperTokenModal';
import { DepositSteps } from './DepositSuperTokenSteps';
import { Item } from '../RecurringDonationModal/Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { RunOutInfo } from '../RunOutInfo';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config from '@/configuration';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { showToastError } from '@/lib/helpers';

interface IDepositSuperTokenProps extends IModifySuperTokenInnerModalProps {
	tokenStreams: ITokenStreams;
	selectedToken: IToken;
}

export const DepositSuperToken: FC<IDepositSuperTokenProps> = ({
	selectedToken,
	tokenStreams,
	step,
	setStep,
	setShowModal,
}) => {
	const [amount, setAmount] = useState(0n);

	const { address } = useAccount();
	const { formatMessage } = useIntl();

	const [token, superToken] = useMemo(
		() =>
			selectedToken.isSuperToken
				? [selectedToken.underlyingToken, selectedToken as ISuperToken]
				: [
						selectedToken,
						findSuperTokenByTokenAddress(selectedToken.id),
					],
		[selectedToken],
	);

	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token: token?.id === AddressZero ? undefined : token?.id,
		address: address,
	});

	const { data: SuperTokenBalance } = useBalance({
		token: superToken?.id,
		address: address,
	});

	const tokenPrice = useTokenPrice(token);

	useEffect(() => {
		if (!token) return;
		if (step === EModifySuperTokenSteps.APPROVE && token.symbol === 'ETH') {
			setStep(EModifySuperTokenSteps.DEPOSIT);
		}
	}, [token, setStep, step]);

	const tokenStream = tokenStreams[superToken?.id || ''];
	const totalStreamPerSec =
		tokenStream?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const streamRunOutInMonth =
		SuperTokenBalance !== undefined &&
		totalStreamPerSec > 0 &&
		SuperTokenBalance.value > 0n
			? SuperTokenBalance.value / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;

	const onApprove = async () => {
		console.log('Approve', amount, address, superToken, token);
		if (!address || !superToken || !token) return;
		setStep(EModifySuperTokenSteps.APPROVING);
		try {
			const approve = await approveERC20tokenTransfer(
				amount,
				address,
				superToken.id, //superTokenAddress
				token.id, //tokenAddress
				config.OPTIMISM_CONFIG.id,
			);
			if (approve) {
				setStep(EModifySuperTokenSteps.DEPOSIT);
			} else {
				setStep(EModifySuperTokenSteps.APPROVE);
			}
		} catch (error) {
			console.log('error', error);
			setStep(EModifySuperTokenSteps.APPROVE);
		}
	};

	const onDeposit = async () => {
		setStep(EModifySuperTokenSteps.DEPOSITING);
		try {
			const _provider = getEthersProvider({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			const signer = await getEthersSigner({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			if (!_provider || !signer || !address || !superToken)
				throw new Error('Provider or signer not found');

			const sf = await Framework.create({
				chainId: config.OPTIMISM_CONFIG.id,
				provider: _provider,
			});

			// EThx is not a Wrapper Super Token and should load separately
			let superTokenAsset;
			if (superToken.symbol === 'ETHx') {
				superTokenAsset = await sf.loadNativeAssetSuperToken(
					superToken.id,
				);
			} else {
				superTokenAsset = await sf.loadWrapperSuperToken(superToken.id);
			}
			const upgradeOperation = await superTokenAsset.upgrade({
				amount: amount.toString(),
			});

			const tx = await upgradeOperation.exec(signer);
			const res = await tx.wait();
			if (!res.status) {
				throw new Error('Deposit failed');
			}
			setStep(EModifySuperTokenSteps.SUBMITTED);
		} catch (error) {
			setStep(EModifySuperTokenSteps.DEPOSIT);
			showToastError(error);
			console.log('error', error);
		}
	};

	const onAction = () => {
		if (step === EModifySuperTokenSteps.MODIFY) {
			setStep(EModifySuperTokenSteps.APPROVE);
		} else if (step === EModifySuperTokenSteps.APPROVE) {
			onApprove();
		} else if (step === EModifySuperTokenSteps.DEPOSIT) {
			onDeposit();
		} else if (step === EModifySuperTokenSteps.SUBMITTED) {
			setShowModal(false);
		}
	};

	return (
		<Wrapper>
			{step === EModifySuperTokenSteps.MODIFY ? (
				<>
					<TopUpSection flexDirection='column' gap='8px'>
						<Flex gap='8px' alignItems='center'>
							<Caption medium>Top up stream Balance</Caption>
							<IconWithTooltip
								icon={<IconHelpFilled16 />}
								direction='right'
								align='bottom'
							>
								<FlowRateTooltip>PlaceHolder</FlowRateTooltip>
							</IconWithTooltip>
						</Flex>
						<InputWrapper>
							<SelectTokenWrapper
								alignItems='center'
								justifyContent='space-between'
							>
								<Flex gap='8px' alignItems='center'>
									{token?.symbol && (
										<TokenIcon
											symbol={token?.symbol}
											size={24}
										/>
									)}
									<B>{token?.symbol}</B>
								</Flex>
							</SelectTokenWrapper>
							<Input
								setAmount={setAmount}
								disabled={token === undefined}
								decimals={token?.decimals}
							/>
						</InputWrapper>
						<Flex gap='4px'>
							<GLink size='Small'>
								Available: {balance?.formatted}
							</GLink>
							<IconWrapper
								onClick={() => !isRefetching && refetch()}
							>
								{isRefetching ? (
									<Spinner size={16} />
								) : (
									<IconRefresh16 />
								)}
							</IconWrapper>
						</Flex>
						<StreamSection>
							<Flex
								alignItems='center'
								justifyContent='space-between'
							>
								<Caption medium>Stream Balance</Caption>
								<StreamBalanceInfo medium>
									{SuperTokenBalance?.formatted}{' '}
									{superToken?.symbol}
								</StreamBalanceInfo>
							</Flex>
							<Flex
								alignItems='center'
								justifyContent='space-between'
							>
								<Caption>
									Balance runs out in{' '}
									<strong>
										{' '}
										{streamRunOutInMonth.toString()} Month
										{streamRunOutInMonth > 1n ? 's' : ''}
									</strong>
								</Caption>
								<Caption>
									Funding{' '}
									<strong>{tokenStream.length}</strong>{' '}
									Project
									{tokenStream.length > 1 ? 's' : ''}
								</Caption>
							</Flex>
						</StreamSection>
					</TopUpSection>
					<ModifyInfoToast />
				</>
			) : (
				<Flex flexDirection='column' gap='16px'>
					<DepositSteps modifyTokenState={step} />
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={token!}
					/>
					<RunOutInfo
						amount={amount + (SuperTokenBalance?.value || 0n)}
						totalPerMonth={0n}
					/>
				</Flex>
			)}
			<Button
				label={formatMessage({ id: actionButtonLabel[step] })}
				disabled={
					step === EModifySuperTokenSteps.APPROVE &&
					(amount <= 0 ||
						balance === undefined ||
						amount > balance.value)
				}
				onClick={onAction}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 24px;
`;

const TopUpSection = styled(Flex)``;

const SelectTokenWrapper = styled(Flex)`
	min-width: 132px;
	gap: 16px;
`;

const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
`;

const Input = styled(AmountInput)`
	width: 100%;
	border-left: 2px solid ${neutralColors.gray[300]};
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%; /* 24px */
		width: 100%;
	}
`;

const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;

const StreamSection = styled(Flex)`
	flex-direction: column;
	padding: 8px;
	gap: 16px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[200]};
	margin-top: 16px;
	color: ${neutralColors.gray[800]};
`;

const StreamBalanceInfo = styled(Caption)`
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 2px 8px;
`;

const ActionButton = styled(Button)``;
