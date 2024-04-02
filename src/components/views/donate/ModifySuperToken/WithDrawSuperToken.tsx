import { useState, type FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Button, Flex } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { GetBalanceReturnType } from 'wagmi/actions';
import { Framework } from '@superfluid-finance/sdk-core';
import { ModifyInfoToast } from './ModifyInfoToast';
import { EModifySectionPlace, ModifySection } from './ModifySection';
import { StreamInfo } from './StreamInfo';
import { IModifySuperTokenInnerModalProps } from './ModifySuperTokenModal';
import { ISuperToken, IToken } from '@/types/superFluid';
import { actionButtonLabel, EModifySuperTokenSteps } from './common';
import { ModifyWrapper, Wrapper } from './common.sc';
import config, { isProduction } from '@/configuration';
import { showToastError } from '@/lib/helpers';
import { Item } from '../RecurringDonationModal/Item';
import { RunOutInfo } from '../RunOutInfo';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { wagmiConfig } from '@/wagmiConfigs';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { EToastType } from '@/components/toasts/InlineToast';

interface IWithDrawSuperTokenProps extends IModifySuperTokenInnerModalProps {
	token?: IToken;
	superToken?: ISuperToken;
}

export const WithDrawSuperToken: FC<IWithDrawSuperTokenProps> = ({
	token,
	superToken,
	tokenStreams,
	step,
	setStep,
	setShowModal,
}) => {
	const [amount, setAmount] = useState(0n);
	const { address } = useAccount();
	const { formatMessage } = useIntl();
	const tokenPrice = useTokenPrice(token);
	const [isWarning, setIsWarning] = useState(false);

	const {
		data: SuperTokenBalance,
		refetch,
		isRefetching,
	} = useBalance({
		token: superToken?.id,
		address: address,
	});
	const totalStreamPerSec =
		tokenStreams?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const totalPerMonth = totalStreamPerSec * BigInt(ONE_MONTH_SECONDS);
	const minRemainingBalance = totalStreamPerSec * BigInt(6 * 60 * 60);

	const onWithdraw = async () => {
		setStep(EModifySuperTokenSteps.WITHDRAWING);
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

			const downgradeOperation = await superTokenAsset.downgrade({
				amount: amount.toString(),
			});

			const tx = await downgradeOperation.exec(signer);
			const res = await tx.wait();
			if (!res.status) {
				throw new Error('Withdraw failed');
			}
			setStep(EModifySuperTokenSteps.WITHDRAW_CONFIRMED);
		} catch (error: any) {
			if (error?.code === 'ACTION_REJECTED') {
				setStep(EModifySuperTokenSteps.MODIFY);
			} else {
				showToastError(error);
				setStep(EModifySuperTokenSteps.WITHDRAW);
			}
			console.log('error', error);
		}
	};

	const onAction = () => {
		if (step === EModifySuperTokenSteps.MODIFY) {
			setStep(EModifySuperTokenSteps.WITHDRAW);
		} else if (step === EModifySuperTokenSteps.WITHDRAW) {
			onWithdraw();
		} else if (step === EModifySuperTokenSteps.WITHDRAW_CONFIRMED) {
			setShowModal(false);
		}
	};

	const isInvalidAmount =
		amount <= 0 ||
		SuperTokenBalance === undefined ||
		amount > SuperTokenBalance.value - minRemainingBalance;

	/// this one needs some thought - we should allow for a buffer of 40 seconds (or more) in the balance we show to the user
	// - this might prevent them from trying to withdraw more than they have and getting an error
	// if the users totalStreamPerSec is 0, then we should allow them to withdraw the full balance
	let modifiedValue: GetBalanceReturnType | undefined = SuperTokenBalance;
	console.log('SuperTokenBalance', SuperTokenBalance);
	if (SuperTokenBalance !== undefined && totalStreamPerSec > 0) {
		modifiedValue = {
			...SuperTokenBalance,
			value: SuperTokenBalance.value - totalStreamPerSec * BigInt(60),
		};
	}

	return (
		<Wrapper>
			{step === EModifySuperTokenSteps.MODIFY ? (
				<>
					<ModifyWrapper>
						<ModifySection
							titleLabel='label.withdraw_from_stream_balance'
							setAmount={setAmount}
							token={superToken}
							// try to put in modified value in place of SuperTokenBalance.value
							refetch={refetch}
							balance={modifiedValue}
							isRefetching={isRefetching}
							error={
								amount !== 0n && isInvalidAmount
									? 'invalid_amount'
									: undefined
							}
							minRemainingBalance={minRemainingBalance}
							tooltipText='tooltip.withdraw_stream_balance'
							modifySectionPlace={EModifySectionPlace.WITHDRAW}
						/>
						<StreamInfo
							tokenStreams={tokenStreams}
							superToken={superToken}
							SuperTokenBalance={SuperTokenBalance}
							inputAmount={amount}
							type='withdraw'
							setIsWarning={setIsWarning}
						/>
					</ModifyWrapper>
					{isWarning == true ? (
						<ModifyInfoToast toastType={EToastType.Warning} />
					) : (
						<ModifyInfoToast toastType={EToastType.Info} />
					)}
				</>
			) : (
				<Flex $flexDirection='column' gap='16px'>
					<Item
						title='Withdraw from this stream balance'
						amount={amount}
						price={tokenPrice}
						token={token!}
					/>
					<RunOutInfo
						superTokenBalance={
							(SuperTokenBalance?.value || 0n) - amount
						}
						streamFlowRatePerMonth={totalPerMonth}
						symbol={token?.symbol || ''}
					/>
				</Flex>
			)}
			<Button
				label={formatMessage({ id: actionButtonLabel[step] })}
				disabled={
					step === EModifySuperTokenSteps.MODIFY && isInvalidAmount
				}
				loading={step === EModifySuperTokenSteps.WITHDRAWING}
				onClick={onAction}
			/>
		</Wrapper>
	);
};
