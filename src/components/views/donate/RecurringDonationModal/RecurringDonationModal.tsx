import { FC, useEffect, useState } from 'react';
import {
	B,
	Button,
	IconDonation32,
	P,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Framework } from '@superfluid-finance/sdk-core';
import { useAccount } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { ITokenStreams } from '../RecurringDonationCard';
import { useDonateData } from '@/context/donate.context';
import { Item } from './Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatDate } from '@/lib/helpers';
import { DonateSteps } from './DonateSteps';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config from '@/configuration';

interface IRecurringDonationModalProps extends IModal {
	tokenStreams: ITokenStreams;
	donationToGiveth: number;
	amount: bigint;
	percentage: number;
}

export enum EDonationSteps {
	APPROVE,
	APPROVING,
	DONATE,
	DONATING,
	SUBMITTED,
}

const headerTitleGenerator = (step: EDonationSteps) => {
	switch (step) {
		case EDonationSteps.APPROVE:
		case EDonationSteps.APPROVING:
		case EDonationSteps.DONATE:
			return 'Confirm your donation';
		case EDonationSteps.DONATING:
			return 'Donating';
		case EDonationSteps.SUBMITTED:
			return 'Donation Submitted';
	}
};

export const RecurringDonationModal: FC<IRecurringDonationModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EDonationSteps.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={headerTitleGenerator(step)}
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
		>
			<RecurringDonationInnerModal
				setShowModal={setShowModal}
				step={step}
				setStep={setStep}
				{...props}
			/>
		</Modal>
	);
};

interface IRecurringDonationInnerModalProps
	extends IRecurringDonationModalProps {
	step: EDonationSteps;
	setStep: (step: EDonationSteps) => void;
}

const RecurringDonationInnerModal: FC<IRecurringDonationInnerModalProps> = ({
	step,
	setStep,
	amount,
	percentage,
	donationToGiveth,
}) => {
	const { project, selectedToken } = useDonateData();
	const { address } = useAccount();
	const tokenPrice = useTokenPrice(selectedToken?.token);

	console.log('tokenPrice', tokenPrice);

	useEffect(() => {
		if (!selectedToken) return;
		if (
			selectedToken.token.isSuperToken ||
			selectedToken.token.symbol === 'ETH'
		) {
			setStep(EDonationSteps.DONATE);
		}
	}, [selectedToken, setStep]);

	const onApprove = async () => {
		console.log('amount', amount);
		setStep(EDonationSteps.APPROVING);
		if (!address) return;
		try {
			const approve = await approveERC20tokenTransfer(
				amount,
				address,
				'0x34cf77c14f39c81adbdad922af538f05633fa07e',
				'0xc916ce4025cb479d9ba9d798a80094a449667f5d',
				config.OPTIMISM_CONFIG.id,
			);
			if (approve) {
				setStep(EDonationSteps.DONATE);
			} else {
				setStep(EDonationSteps.APPROVE);
			}
		} catch (error) {
			setStep(EDonationSteps.APPROVE);
		}
	};

	const onDonate = async () => {
		try {
			console.log('config.OPTIMISM_CONFIG.id', config.OPTIMISM_CONFIG.id);
			const _provider = getEthersProvider({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			const signer = await getEthersSigner({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			if (!_provider || !signer || !address) return;

			const approve = await approveERC20tokenTransfer(
				1000000000000000000n,
				address,
				'0x34cf77c14f39c81adbdad922af538f05633fa07e',
				'0xc916ce4025cb479d9ba9d798a80094a449667f5d',
				config.OPTIMISM_CONFIG.id,
			);

			console.log('approve', approve);
			if (!approve) return;

			const sf = await Framework.create({
				chainId: config.OPTIMISM_CONFIG.id,
				provider: _provider,
			});
			console.log('sf', sf);

			const givx = await sf.loadWrapperSuperToken(
				'0x34cf77c14f39c81adbdad922af538f05633fa07e',
			);

			// const approve = await givx.approve({
			// 	amount: '1000000000000000000',
			// 	receiver: '0x34cf77c14f39c81adbdad922af538f05633fa07e',
			// });

			// await approve.exec(signer);

			const upgradeOperation = await givx.upgrade({
				amount: '1000000000000000000',
			});

			// const res = await upgradeOperation.exec(signer);
			// console.log('res', res);

			let createFlowOp = givx.createFlow({
				sender: address, // Alice's address
				receiver: '0x871Cd6353B803CECeB090Bb827Ecb2F361Db81AB',
				flowRate: '380517503',
			});

			// await createFlowOp.exec(signer);
			const sfSigner = sf.createSigner({
				signer: signer,
			});
			const batchOp = sf.batchCall([upgradeOperation, createFlowOp]);
			const res = await batchOp.exec(signer);
			console.log('res', res);
		} catch (error) {
			console.log('error', error);
		}
	};

	const totalPerMonth = ((amount || 0n) * BigInt(percentage)) / 100n;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;
	const totalPerSecond = totalPerMonth / BigInt(30 * 24 * 60 * 60);
	const secondsUntilRunOut = amount / totalPerSecond;
	const date = new Date();
	date.setSeconds(date.getSeconds() + Number(secondsUntilRunOut.toString()));

	return (
		<Wrapper>
			<DonateSteps donateState={step} />
			<Items flexDirection='column' gap='16px'>
				{!selectedToken?.token.isSuperToken && (
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
				<Item
					title={`Donate Monthly to ${project.title}`}
					amount={projectPerMonth}
					price={tokenPrice}
					token={selectedToken?.token!}
				/>
				{donationToGiveth > 0 && (
					<Item
						title='Donate Monthly to the Giveth DAO'
						amount={givethPerMonth}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
			</Items>
			<RunOutSection>
				<P>Your stream balance will run out funds on </P>
				<B>{formatDate(date)}</B>
				<P>Top-up before then!</P>
			</RunOutSection>
			<ApproveButton
				label={'Approve'}
				onClick={onApprove}
				loading={step === EDonationSteps.APPROVING}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 430px;
	}
`;

const Items = styled(Flex)`
	max-width: 100%;
`;

const RunOutSection = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	border-top: 1px solid ${neutralColors.gray[600]};
	padding-top: 16px;
	align-items: flex-start;
`;

const ApproveButton = styled(Button)`
	width: 100%;
`;
