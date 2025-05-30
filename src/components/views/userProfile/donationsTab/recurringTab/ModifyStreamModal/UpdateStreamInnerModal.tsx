import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { Framework } from '@superfluid-finance/sdk-core';

import styled from 'styled-components';
import { EDonationSteps, IModifyStreamModalProps } from './ModifyStreamModal';
import { ActionButton, Wrapper } from './ModifyStreamInnerModal';
import { Item } from '@/components/views/donate/Recurring/RecurringDonationModal/Item';
import { IToken } from '@/types/superFluid';
import { RunOutInfo } from '@/components/views/donate/Recurring/RunOutInfo';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { isProduction } from '@/configuration';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { showToastError } from '@/lib/helpers';
import {
	ICreateDraftRecurringDonation,
	createDraftRecurringDonation,
	updateRecurringDonation,
	updateRecurringDonationStatus,
} from '@/services/donation';
import { wagmiConfig } from '@/wagmiConfigs';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { TXLink } from './TXLink';
import { useProfileDonateTabData } from '../ProfileDonateTab.context';
import { ERecurringDonationStatus } from '@/apollo/types/types';
import { findAnchorContractAddress } from '@/helpers/superfluid';
import { ensureCorrectNetwork } from '@/helpers/network';

interface IModifyStreamInnerModalProps extends IModifyStreamModalProps {
	step: EDonationSteps;
	setStep: (step: EDonationSteps) => void;
	token: IToken;
	superTokenBalance: bigint;
	flowRatePerMonth: bigint;
	streamFlowRatePerMonth: bigint;
	closeModal: () => void;
	recurringNetworkId: number;
}

export const UpdateStreamInnerModal: FC<IModifyStreamInnerModalProps> = ({
	donation,
	step,
	setStep,
	token,
	superTokenBalance,
	flowRatePerMonth,
	streamFlowRatePerMonth,
	closeModal,
	recurringNetworkId,
}) => {
	const [tx, setTx] = useState('');
	const { formatMessage } = useIntl();
	const tokenPrice = useTokenPrice(token);
	const { address } = useAccount();
	const { refetchTokenStream } = useProfileDonateTabData();

	const onDonate = async () => {
		setStep(EDonationSteps.DONATING);
		try {
			await ensureCorrectNetwork(recurringNetworkId);
			const projectAnchorContract = findAnchorContractAddress(
				donation.project.anchorContracts,
				recurringNetworkId,
			);
			if (!projectAnchorContract) {
				throw new Error('Project anchor address not found');
			}
			if (!address || !token) {
				throw new Error('address not found');
			}
			const provider = await getEthersProvider(wagmiConfig);
			const signer = await getEthersSigner(wagmiConfig);

			if (!provider || !signer)
				throw new Error('Provider or signer not found');

			const _options = {
				chainId: recurringNetworkId,
				provider: provider,
				resolverAddress: isProduction
					? undefined
					: '0x554c06487bEc8c890A0345eb05a5292C1b1017Bd',
			};
			const sf = await Framework.create(_options);

			// ETHx is not a Wrapper Super Token and should load separately
			let superToken;
			if (token.symbol === 'ETHx') {
				superToken = await sf.loadNativeAssetSuperToken(token.id);
			} else {
				superToken = await sf.loadWrapperSuperToken(token.id);
			}

			const _flowRatePerSec = flowRatePerMonth / ONE_MONTH_SECONDS;

			const options = {
				sender: address,
				receiver: projectAnchorContract,
				flowRate: _flowRatePerSec.toString(),
			};

			let projectFlowOp = superToken.updateFlow(options);

			const projectDraftDonationInfo: ICreateDraftRecurringDonation = {
				recurringDonationId: donation.id,
				projectId: +donation.project.id,
				anonymous: donation.anonymous,
				chainId: recurringNetworkId,
				flowRate: _flowRatePerSec,
				superToken: token,
				isForUpdate: true,
			};

			const projectDraftDonationId = await createDraftRecurringDonation(
				projectDraftDonationInfo,
			);

			const tx = await projectFlowOp.exec(signer);
			setTx(tx.hash);

			let projectDonationId = 0;

			// Saving project donation to backend
			try {
				const projectDonationInfo = {
					...projectDraftDonationInfo,
					txHash: tx.hash,
					draftDonationId: projectDraftDonationId,
				};
				console.log('Start Update Project Donation Info');
				projectDonationId =
					await updateRecurringDonation(projectDonationInfo);
				console.log('Project Donation Update Info', projectDonationId);
			} catch (error) {
				showToastError(error);
			}

			const res = await tx.wait();

			if (res.status) {
				if (projectDonationId) {
					try {
						await updateRecurringDonationStatus(
							projectDonationId,
							ERecurringDonationStatus.VERIFIED,
						);
					} catch (error) {
						showToastError(error);
					}
				}
			} else {
				try {
					if (projectDonationId) {
						await updateRecurringDonationStatus(
							projectDonationId,
							ERecurringDonationStatus.FAILED,
						);
					}
				} catch (error) {
					showToastError(error);
				}
				throw new Error('Transaction failed');
			}
			setTimeout(() => {
				refetchTokenStream();
			}, 2000); // make sure that the superfluid subgraph is synced
			setStep(EDonationSteps.SUCCESS);
			if (tx.hash) {
			}
		} catch (error: any) {
			setStep(EDonationSteps.CONFIRM);
			if (error?.code !== 'ACTION_REJECTED') {
				showToastError(error);
			}
			console.error('Error on recurring donation', { error });
		}
	};

	return (
		<Wrapper>
			<Item
				title={`Donate to ${donation.project.title}`}
				subtext={'per month'}
				amount={flowRatePerMonth}
				price={tokenPrice}
				token={token}
			/>
			<RunOutInfo
				superTokenBalance={superTokenBalance}
				streamFlowRatePerMonth={streamFlowRatePerMonth}
				symbol={token.symbol || ''}
			/>
			{step === EDonationSteps.CONFIRM ? (
				<>
					<ActionButton
						label={formatMessage({ id: 'label.confirm' })}
						onClick={() => onDonate()}
					/>
					<ActionButton
						label={formatMessage({ id: 'label.edit' })}
						onClick={() => setStep(EDonationSteps.MODIFY)}
						buttonType='texty-gray'
					/>
				</>
			) : step === EDonationSteps.DONATING ? (
				<>
					<StyledToast
						type={EToastType.Info}
						message={`Your recurring donation to the ${donation.project.title} is being processed.`}
					/>
					{tx && <TXLink tx={tx} />}
					<ActionButton
						label={formatMessage({ id: 'label.donating' })}
						disabled={true}
						loading={true}
					/>
				</>
			) : step === EDonationSteps.SUCCESS ? (
				<>
					<StyledToast
						type={EToastType.Success}
						message={`Your recurring donation to the ${donation.project.title} is now active!`}
					/>
					{tx && <TXLink tx={tx} />}
					<ActionButton
						label={formatMessage({ id: 'label.done' })}
						onClick={() => {
							closeModal();
						}}
					/>
				</>
			) : null}
		</Wrapper>
	);
};

const StyledToast = styled(InlineToast)`
	margin: 0;
`;
