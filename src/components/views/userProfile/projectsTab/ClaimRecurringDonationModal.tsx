import { B, P, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { IProject } from '@/apollo/types/types';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	ITokenWithBalance,
	useProjectClaimableDonations,
} from '@/hooks/useProjectClaimableDonations';

import { WrappedSpinner } from '@/components/Spinner';
import ClaimWithdrawalModal from './ClaimWithdrawalModal';
import { ClaimRecurringItem } from './ClaimRecurringItem';
import { formatDonation } from '@/helpers/number';
import { findAnchorContractAddress } from '@/helpers/superfluid';

interface IClaimRecurringDonationModal extends IModal {
	project: IProject;
}

export interface IAllTokensUsd {
	[key: string]: number; //key is token name and value is usd value
}

const ClaimRecurringDonationModal = ({
	setShowModal,
	project,
}: IClaimRecurringDonationModal) => {
	const anchorContractAddress = findAnchorContractAddress(
		project?.anchorContracts,
	);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { balances, isLoading, refetch } = useProjectClaimableDonations(
		anchorContractAddress,
	);
	const [showClaimWithdrawalModal, setShowClaimWithdrawalModal] =
		useState(false);
	const [selectedStream, setSelectedStream] = useState<ITokenWithBalance>();
	const [allTokensUsd, setAllTokensUsd] = useState<IAllTokensUsd>({});

	const sumAllTokensUsd = useMemo(() => {
		let sum = 0;
		for (const key in allTokensUsd) {
			sum += allTokensUsd[key];
		}
		return sum;
	}, [allTokensUsd]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Claimable Donations'
			headerTitlePosition='left'
		>
			<ModalContainer>
				{isLoading ? (
					<WrappedSpinner size={300} />
				) : balances.length === 0 ? (
					<P>You have no streams yet!</P>
				) : (
					<Flex $flexDirection='column' gap='32px'>
						{balances.map(tokenWithBalance => (
							<ClaimRecurringItem
								key={tokenWithBalance.token.symbol}
								tokenWithBalance={tokenWithBalance}
								onSelectStream={selectedItem => {
									setSelectedStream(selectedItem);
									setShowClaimWithdrawalModal(true);
								}}
								setAllTokensUsd={setAllTokensUsd}
								allTokensUsd={allTokensUsd}
							/>
						))}
						<TotalAmountContainer>
							<Flex $justifyContent='space-between'>
								<B>Total amount claimable </B>
								<B>~ {formatDonation(sumAllTokensUsd)} USD</B>
							</Flex>
						</TotalAmountContainer>
					</Flex>
				)}

				<SuperfluidLogoContainer gap='15px'>
					<P>Streams powered by </P>{' '}
					<Image
						src='/images/logo/superfluid-logo.svg'
						width={120}
						height={30}
						alt='Superfluid logo'
					/>
				</SuperfluidLogoContainer>
				{showClaimWithdrawalModal &&
					selectedStream &&
					anchorContractAddress && (
						<ClaimWithdrawalModal
							setShowModal={setShowClaimWithdrawalModal}
							selectedStream={selectedStream}
							project={project}
							anchorContractAddress={anchorContractAddress}
							refetch={refetch}
							balanceInUsd={
								allTokensUsd[
									selectedStream.token.underlyingToken
										?.symbol!
								]
							}
						/>
					)}
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	min-width: 650px;
`;

const TotalAmountContainer = styled.div`
	padding: 8px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
`;

const SuperfluidLogoContainer = styled(Flex)`
	margin-top: 32px;
`;

export default ClaimRecurringDonationModal;
