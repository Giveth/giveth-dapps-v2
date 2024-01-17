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
}) => {
	const [amount, setAmount] = useState(0n);
	const { address } = useAccount();
	const { formatMessage } = useIntl();

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

	const onWithDraw = async () => {
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
		} catch (error) {
			setStep(EModifySuperTokenSteps.WITHDRAW);
			showToastError(error);
			console.log('error', error);
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
				<div></div>
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
				onClick={onWithDraw}
			/>
		</Wrapper>
	);
};
