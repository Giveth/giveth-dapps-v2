import {
	B,
	Button,
	P,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { IProject } from '@/apollo/types/types';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconPolygon } from '@/components/Icons/Polygon';
import { Modal } from '@/components/modals/Modal';
import { Flex } from '@/components/styled-components/Flex';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IClaimRecurringDonationModal extends IModal {
	project: IProject;
}

const recurringDonationItems = [
	{
		icon: <IconEthereum size={24} />,
		value: '0.5 ETH',
		usdValue: '$1,000',
	},
	{
		icon: <IconPolygon size={24} />,
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
				<Flex flexDirection='column' gap='32px'>
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
					<TotalAmountContainer>
						<Flex justifyContent='space-between'>
							<B>Total amount claimable </B>
							<B>~945 USD</B>
						</Flex>
					</TotalAmountContainer>
					<Button label='Claim All Tokens' />
					<Button
						label='Cancel'
						buttonType='texty-gray'
						onClick={() => setShowModal(false)}
					/>
				</Flex>
				<SuperfluidLogoContainer gap='15px'>
					<P>Streams powered by </P>{' '}
					<Image
						src='/images/logo/superfluid-logo.svg'
						width={120}
						height={30}
						alt='Superfluid logo'
					/>
				</SuperfluidLogoContainer>
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

const TotalAmountContainer = styled.div`
	padding: 8px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
`;

const SuperfluidLogoContainer = styled(Flex)`
	margin-top: 32px;
`;

export default ClaimRecurringDonationModal;
