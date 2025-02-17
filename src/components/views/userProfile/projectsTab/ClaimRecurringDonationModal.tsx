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
import config from '@/configuration';
import NetworkLogo from '@/components/NetworkLogo';

interface IClaimRecurringDonationModal extends IModal {
	project: IProject;
}

interface TabProps {
	$unverified?: boolean;
}

export interface IAllTokensUsd {
	[key: string]: number; //key is token name and value is usd value
}

const ClaimRecurringDonationModal = ({
	setShowModal,
	project,
}: IClaimRecurringDonationModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [showClaimWithdrawalModal, setShowClaimWithdrawalModal] =
		useState(false);
	const [selectedStream, setSelectedStream] = useState<ITokenWithBalance>();
	const [activeTab, setActiveTab] = useState(0);
	const [allTokensUsd, setAllTokensUsd] = useState<IAllTokensUsd>({});
	const [fetchFunction, setFetchFunction] = useState<() => Promise<void>>(
		() => Promise.resolve(),
	);
	const [selectedAnchorContractAddress, setSelectedAnchorContractAddress] =
		useState('');

	const recurringChains = [
		{
			name: 'Optimism',
			chainId: config.OPTIMISM_NETWORK_NUMBER,
			anchorContractAddress: findAnchorContractAddress(
				project?.anchorContracts,
				config.OPTIMISM_NETWORK_NUMBER,
			),
			data: useProjectClaimableDonations(
				config.OPTIMISM_NETWORK_NUMBER,
				findAnchorContractAddress(
					project?.anchorContracts,
					config.OPTIMISM_NETWORK_NUMBER,
				),
			),
		},
		{
			name: 'Base',
			chainId: config.BASE_NETWORK_NUMBER,
			anchorContractAddress: findAnchorContractAddress(
				project?.anchorContracts,
				config.BASE_NETWORK_NUMBER,
			),
			data: useProjectClaimableDonations(
				config.BASE_NETWORK_NUMBER,
				findAnchorContractAddress(
					project?.anchorContracts,
					config.BASE_NETWORK_NUMBER,
				),
			),
		},
	];

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
				<TabWrapper gap='16px'>
					{recurringChains.map((tab, index) => (
						<Tab
							key={tab.name}
							className={activeTab === index ? 'active' : ''}
							onClick={() => setActiveTab(index)}
						>
							<NetworkLogo chainId={tab.chainId} logoSize={24} />
							{tab.name}
						</Tab>
					))}
				</TabWrapper>
				{recurringChains[activeTab].data.isLoading ? (
					<WrappedSpinner size={300} />
				) : recurringChains[activeTab].data.balances.length === 0 ? (
					<P>You have no streams yet!</P>
				) : (
					<Flex $flexDirection='column' gap='32px'>
						{recurringChains[activeTab].data.balances.map(
							tokenWithBalance => (
								<ClaimRecurringItem
									key={tokenWithBalance.token.symbol}
									tokenWithBalance={tokenWithBalance}
									onSelectStream={selectedItem => {
										setSelectedStream(selectedItem);
										setShowClaimWithdrawalModal(true);
										setFetchFunction(
											recurringChains[activeTab].data
												.refetch,
										);
										setSelectedAnchorContractAddress(
											recurringChains[activeTab]
												.anchorContractAddress || '',
										);
									}}
									setAllTokensUsd={setAllTokensUsd}
									allTokensUsd={allTokensUsd}
								/>
							),
						)}
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
					selectedAnchorContractAddress && (
						<ClaimWithdrawalModal
							setShowModal={setShowClaimWithdrawalModal}
							selectedStream={selectedStream}
							project={project}
							anchorContractAddress={
								selectedAnchorContractAddress
							}
							refetch={fetchFunction}
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
	min-width: 500px;
`;

const TotalAmountContainer = styled.div`
	padding: 8px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
`;

const SuperfluidLogoContainer = styled(Flex)`
	margin-top: 32px;
`;

const TabWrapper = styled(Flex)`
	position: relative;
	margin-bottom: 30px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

const Tab = styled(P)<TabProps>`
	display: flex;
	position: relative;
	margin-bottom: -1px;
	padding: 9px 12px;
	cursor: pointer;
	font-weight: 500;
	color: ${neutralColors.gray[600]};
	transition: all 0.3s ease;

	&.active {
		color: ${neutralColors.gray[900]};
		border-bottom: 1px solid ${neutralColors.gray[900]};
	}

	& img {
		margin-right: 5px;
	}
`;

export default ClaimRecurringDonationModal;
