import { brandColors, H5, IconRocketInSpace32 } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import {
	ApproveButton,
	CancelButton,
	ConfirmButton,
	StakeInnerModal,
	StakeModalContainer,
} from './Stake';
import { AmountInput } from '@/components/AmountInput';
import LockSlider from './LockSlider';
import LockInfo from './LockInfo';
import LockingBrief from './LockingBrief';
import { lockToken } from '@/lib/stakingPool';
import config from '@/configuration';
import type { PoolStakingConfig, RegenStreamConfig } from '@/types/config';

interface ILockModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
}

export enum ELockState {
	LOCK,
	CONFIRM,
	LOCKING,
	BOOST,
	ERROR,
}

const LockModal: FC<ILockModalProps> = ({
	poolStakingConfig,
	maxAmount,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [round, setRound] = useState(2);
	const [txHash, setTxHash] = useState('');
	const [lockState, setLockState] = useState<ELockState>(ELockState.LOCK);
	const { chainId, library } = useWeb3React();

	const onLock = async () => {
		const contractAddress = config.XDAI_CONFIG.GIV.LM_ADDRESS;
		setLockState(ELockState.LOCKING);
		try {
			const txResponse = await lockToken(
				amount,
				round,
				contractAddress,
				library,
			);
			if (txResponse) {
				setTxHash(txResponse.hash);
				if (txResponse) {
					const { status } = await txResponse.wait();
					setLockState(status ? ELockState.BOOST : ELockState.ERROR);
				}
			} else {
				setLockState(ELockState.LOCK);
			}
		} catch (err: any) {
			setLockState(
				err?.code === 4001 ? ELockState.LOCK : ELockState.ERROR,
			);
			captureException(err, {
				tags: {
					section: 'onWrap',
				},
			});
		}
	};

	return (
		<Modal
			setShowModal={setShowModal}
			headerTitlePosition={'left'}
			headerTitle={'Stake for GIVpower'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<StakeModalContainer>
				<StakeInnerModal>
					{lockState === ELockState.LOCK && (
						<>
							<SectionTitle weight={700}>
								Lock your staked GIV
							</SectionTitle>
							<AmountInput
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							<SectionTitle weight={700}>Rounds</SectionTitle>
							<LockSlider setRound={setRound} round={round} />
							<LockInfo round={round} amount={amount} />
							<ApproveButton
								buttonType='primary'
								size='small'
								label={'Lock to increase your multiplier'}
								onClick={() => {
									setLockState(ELockState.CONFIRM);
								}}
								disabled={amount == '0' || maxAmount.lt(amount)}
							/>
						</>
					)}
					{(lockState === ELockState.CONFIRM ||
						lockState === ELockState.LOCKING) && (
						<>
							<LockingBrief round={round} amount={amount} />
							<LockInfo round={round} amount={amount} />
							<ConfirmButton
								buttonType='primary'
								label={'Lock your tokens'}
								onClick={onLock}
								disabled={
									amount == '0' ||
									maxAmount.lt(amount) ||
									lockState === ELockState.LOCKING
								}
								loading={lockState === ELockState.LOCKING}
							/>
						</>
					)}
					<CancelButton
						buttonType='texty'
						size='small'
						label='CANCEL'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</StakeInnerModal>
			</StakeModalContainer>
		</Modal>
	);
};

const SectionTitle = styled(H5)`
	text-align: left;
	color: ${brandColors.giv[300]};
	padding-bottom: 8px;
	border-bottom: 1px solid ${brandColors.giv[500]};
	margin: 16px 0 8px;
`;

export default LockModal;
