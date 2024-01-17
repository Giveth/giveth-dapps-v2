import { useState, type FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Button } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Framework } from '@superfluid-finance/sdk-core';
import { ModifyInfoToast } from './ModifyInfoToast';
import { ModifySection } from './ModifySection';
import { StreamInfo } from './StreamInfo';
import { IModifySuperTokenInnerModalProps } from './ModifySuperTokenModal';
import { ITokenStreams } from '@/context/donate.context';
import { ISuperToken, IToken } from '@/types/superFluid';
import { actionButtonLabel, EModifySuperTokenSteps } from './common';
import { ModifyWrapper, Wrapper } from './common.sc';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import config from '@/configuration';
import { showToastError } from '@/lib/helpers';
import { Flex } from '@/components/styled-components/Flex';
import { Item } from '../RecurringDonationModal/Item';
import { RunOutInfo } from '../RunOutInfo';
import { useTokenPrice } from '@/hooks/useTokenPrice';

interface IWithDrawSuperTokenProps extends IModifySuperTokenInnerModalProps {
	tokenStreams: ITokenStreams;
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

	const {
		data: SuperTokenBalance,
		refetch,
		isRefetching,
	} = useBalance({
		token: superToken?.id,
		address: address,
	});

	const tokenStream = tokenStreams[superToken?.id || ''];
	const totalStreamPerSec =
		tokenStream?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const minRemainingBalance = totalStreamPerSec * BigInt(6 * 60 * 60);

	const onWithdraw = async () => {
		setStep(EModifySuperTokenSteps.WITHDRAWING);
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

	return (
		<Wrapper>
			{step === EModifySuperTokenSteps.MODIFY ? (
				<>
					<ModifyWrapper>
						<ModifySection
							titleLabel='label.withdraw_from_stream_balance'
							setAmount={setAmount}
							token={superToken}
							balance={SuperTokenBalance}
							refetch={refetch}
							isRefetching={isRefetching}
						/>
						<StreamInfo
							tokenStreams={tokenStreams}
							superToken={superToken}
							SuperTokenBalance={SuperTokenBalance}
						/>
					</ModifyWrapper>
					<ModifyInfoToast />
				</>
			) : (
				<Flex flexDirection='column' gap='16px'>
					<Item
						title='Withdraw from this stream balance'
						amount={amount}
						price={tokenPrice}
						token={token!}
					/>
					<RunOutInfo
						amount={(SuperTokenBalance?.value || 0n) - amount}
						totalPerMonth={0n}
					/>
				</Flex>
			)}
			<Button
				label={formatMessage({ id: actionButtonLabel[step] })}
				disabled={
					step === EModifySuperTokenSteps.MODIFY &&
					(amount <= 0 ||
						SuperTokenBalance === undefined ||
						amount > SuperTokenBalance.value - minRemainingBalance)
				}
				loading={step === EModifySuperTokenSteps.WITHDRAWING}
				onClick={onAction}
			/>
		</Wrapper>
	);
};
