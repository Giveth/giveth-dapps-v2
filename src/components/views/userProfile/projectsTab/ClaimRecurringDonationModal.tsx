import {
	B,
	Button,
	P,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { utils } from 'ethers';
import { IProject } from '@/apollo/types/types';
import { Modal } from '@/components/modals/Modal';
import { Flex } from '@/components/styled-components/Flex';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { useProjectClaimableDonations } from '@/hooks/useProjectClaimableDonations';
import { TokenIcon } from '../../donate/TokenIcon';
import { limitFraction } from '@/helpers/number';
import { WrappedSpinner } from '@/components/Spinner';

interface IClaimRecurringDonationModal extends IModal {
	project: IProject;
}

const ClaimRecurringDonationModal = ({
	setShowModal,
	project,
}: IClaimRecurringDonationModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { streams, isLoading } = useProjectClaimableDonations();
	console.log('Streams', streams);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Claimable Donations'
			headerTitlePosition='left'
			hiddenClose
		>
			<ModalContainer>
				{isLoading ? (
					<WrappedSpinner size={300} />
				) : (
					<Flex flexDirection='column' gap='32px'>
						{streams.map(item => (
							<ItemContainer
								justifyContent='space-between'
								alignItems='center'
								key={item.token.symbol}
							>
								<Flex alignItems='center'>
									<TokenIcon
										symbol={
											item.token.underlyingToken?.symbol!
										}
									/>
									&nbsp; &nbsp;
									<B>
										{`
									${limitFraction(utils.formatUnits(item.balance, item.token.decimals), 6)} 
									${item.token.underlyingToken?.symbol} ~
									${limitFraction(utils.formatUnits(item.balance, item.token.decimals), 6)}
									USD
									`}
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
