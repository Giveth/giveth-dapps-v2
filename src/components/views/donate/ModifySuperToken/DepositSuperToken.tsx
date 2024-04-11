import { useState, type FC, useEffect } from 'react';
import { Button, Flex } from '@giveth/ui-design-system';
import { useAccount, useBalance } from 'wagmi';
import { useIntl } from 'react-intl';
import { Framework } from '@superfluid-finance/sdk-core';
import { ISuperToken, IToken } from '@/types/superFluid';
import { AddressZero } from '@/lib/constants/constants';
import { ModifyInfoToast } from './ModifyInfoToast';
import { IModifySuperTokenInnerModalProps } from './ModifySuperTokenModal';
import { DepositSteps } from './DepositSuperTokenSteps';
import { Item } from '../RecurringDonationModal/Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { RunOutInfo } from '../RunOutInfo';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config, { isProduction } from '@/configuration';
import { showToastError } from '@/lib/helpers';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { StreamInfo } from './StreamInfo';
import { EModifySectionPlace, ModifySection } from './ModifySection';
import { ModifyWrapper, Wrapper } from './common.sc';
import { EModifySuperTokenSteps, actionButtonLabel } from './common';
import { wagmiConfig } from '@/wagmiConfigs';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { EToastType } from '@/components/toasts/InlineToast';

interface IDepositSuperTokenProps extends IModifySuperTokenInnerModalProps {
	token?: IToken;
	superToken?: ISuperToken;
}

export const DepositSuperToken: FC<IDepositSuperTokenProps> = ({
	token,
	superToken,
	tokenStreams,
	step,
	setStep,
	closeModal,
	refreshBalance,
}) => {
	const [amount, setAmount] = useState(0n);

	const { address } = useAccount();
	const { formatMessage } = useIntl();

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
	const isSafeEnv = useIsSafeEnvironment();

	useEffect(() => {
		if (!token) return;
		if (step === EModifySuperTokenSteps.APPROVE && token.symbol === 'ETH') {
			setStep(EModifySuperTokenSteps.DEPOSIT);
		}
	}, [token, setStep, step]);

	const isLoading =
		step === EModifySuperTokenSteps.APPROVING ||
		step === EModifySuperTokenSteps.DEPOSITING;

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
				isSafeEnv,
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
			if (!address) {
				throw new Error('address not found1');
			}

			if (!superToken) {
				throw new Error('SuperToken not found');
			}

			const provider = await getEthersProvider(wagmiConfig);
			const signer = await getEthersSigner(wagmiConfig);

			if (!provider || !signer)
				throw new Error('Provider or signer not found');

			const _options = {
				chainId: config.OPTIMISM_CONFIG.id,
				provider: provider,
				resolverAddress: isProduction
					? undefined
					: '0x554c06487bEc8c890A0345eb05a5292C1b1017Bd',
			};
			const sf = await Framework.create(_options);

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
			refreshBalance();
			setStep(EModifySuperTokenSteps.DEPOSIT_CONFIRMED);
		} catch (error: any) {
			if (error?.code === 'ACTION_REJECTED') {
				setStep(EModifySuperTokenSteps.MODIFY);
			} else {
				showToastError(error);
				setStep(EModifySuperTokenSteps.DEPOSIT);
			}
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
		} else if (step === EModifySuperTokenSteps.DEPOSIT_CONFIRMED) {
			closeModal();
		}
	};

	return (
		<Wrapper>
			{step === EModifySuperTokenSteps.MODIFY ? (
				<>
					<ModifyWrapper>
						<ModifySection
							titleLabel='label.top_up_stream_balance'
							setAmount={setAmount}
							token={token}
							balance={balance}
							refetch={refetch}
							isRefetching={isRefetching}
							tooltipText='tooltip.deposit_stream_balance'
							modifySectionPlace={EModifySectionPlace.DEPOSIT}
						/>
						<StreamInfo
							tokenStreams={tokenStreams}
							superToken={superToken}
							SuperTokenBalance={SuperTokenBalance}
							inputAmount={amount}
							type='deposit'
						/>
					</ModifyWrapper>
					<ModifyInfoToast toastType={EToastType.Info} />
				</>
			) : (
				<Flex $flexDirection='column' gap='16px'>
					<DepositSteps modifyTokenState={step} />
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={token!}
					/>
					<RunOutInfo
						superTokenBalance={
							amount + (SuperTokenBalance?.value || 0n)
						}
						streamFlowRatePerMonth={0n}
						symbol={token?.symbol || ''}
					/>
				</Flex>
			)}
			<Button
				label={formatMessage({ id: actionButtonLabel[step] })}
				disabled={
					step === EModifySuperTokenSteps.MODIFY &&
					(amount <= 0 ||
						balance === undefined ||
						amount > balance.value)
				}
				loading={isLoading}
				onClick={onAction}
			/>
		</Wrapper>
	);
};
