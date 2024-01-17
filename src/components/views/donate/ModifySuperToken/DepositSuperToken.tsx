import { useState, type FC, useEffect } from 'react';
import { Button } from '@giveth/ui-design-system';
import { useAccount, useBalance } from 'wagmi';
import { useIntl } from 'react-intl';
import { Framework } from '@superfluid-finance/sdk-core';
import { Flex } from '@/components/styled-components/Flex';
import { ISuperToken, IToken } from '@/types/superFluid';
import { AddressZero } from '@/lib/constants/constants';
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
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { StreamInfo } from './StreamInfo';
import { ModifySection } from './ModifySection';
import { Wrapper } from './common.sc';

interface IDepositSuperTokenProps extends IModifySuperTokenInnerModalProps {
	tokenStreams: ITokenStreams;
	token?: IToken;
	superToken?: ISuperToken;
}

export const DepositSuperToken: FC<IDepositSuperTokenProps> = ({
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
					<ModifySection
						setAmount={setAmount}
						token={token}
						balance={balance}
						refetch={refetch}
						isRefetching={isRefetching}
					/>
					<StreamInfo
						tokenStreams={tokenStreams}
						superToken={superToken}
						SuperTokenBalance={SuperTokenBalance}
					/>
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
