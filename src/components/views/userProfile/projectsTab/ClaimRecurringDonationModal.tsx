import { B, P, brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IProject } from '@/apollo/types/types';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconPolygon } from '@/components/Icons/Polygon';
import { Modal } from '@/components/modals/Modal';
import { Flex } from '@/components/styled-components/Flex';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

interface IClaimRecurringDonationModal extends IModal {
	project: IProject;
}

const recurringDonationItems = [
	{
		icon: <IconEthereum size={32} />,
		value: '0.5 ETH',
		usdValue: '$1,000',
	},
	{
		icon: <IconPolygon size={32} />,
		value: '0.5 MATIC',
		usdValue: '$1,000',
	},
];

const ClaimRecurringDonationModal = ({
	setShowModal,
	project,
}: IClaimRecurringDonationModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Claimable Donations'
			headerTitlePosition='left'
			hiddenClose
		>
			<ModalContainer>
				<Flex flexDirection='column' gap='40px'>
					{recurringDonationItems.map(item => (
						<ItemContainer
							justifyContent='space-between'
							alignItems='center'
							key={item.value}
						>
							<Flex alignItems='center'>
								<div>{item.icon}</div>
								&nbsp;
								<B>
									{item.value} ~ {item.usdValue}
								</B>
							</Flex>
							<ClaimButton>Claim tokens</ClaimButton>
						</ItemContainer>
					))}
				</Flex>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	min-width: 650px;
`;

const ItemContainer = styled(Flex)`
	padding: 8px;
	border-radius: 8px;
	:hover {
		background-color: ${neutralColors.gray[300]};
	}
`;

const ClaimButton = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default ClaimRecurringDonationModal;
