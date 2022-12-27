import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, P } from '@giveth/ui-design-system';
import Image from 'next/image';

import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { Bullets } from '@/components/styled-components/Bullets';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const FiatDonationConfirmationModal: FC<IModal> = ({
	setShowModal,
	continueProcess,
	type,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
			headerTitle={formatMessage({ id: 'Before you continue' })}
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					{type === 'onramper' ? (
						<>
							<li>
								You will be purchasing crypto on behalf of the
								project account, the destination address will be
								the one set for the project.
							</li>
							<li>
								Note that your donations history will be updated
								some time after a successful transaction.
							</li>
							<li>
								Donations will only be confirmed after a while
								of being sent, time depends on the chosen
								onramp.
							</li>
						</>
					) : (
						type === 'donorbox' && (
							<>
								<li>
									This is a way to support Giveth using our{' '}
									<a
										href='https://www.sdgimpactfund.org/giveth-foundation'
										target='_blank'
										rel='noreferrer'
									>
										SDG impact fund
									</a>
									<li>
										You'll get a confirmation from donorbox
										on your email but you won't see it
										listed on our platform, we will be very
										very grateful for your support!
									</li>
								</li>
							</>
						)
					)}
				</Bullets>
				<Buttons>
					<OkButton
						label='Cancel'
						onClick={closeModal}
						buttonType='texty'
					/>
					<OkButton
						label='Continue'
						onClick={continueProcess}
						buttonType='secondary'
					/>
				</Buttons>
			</Container>
		</Modal>
	);
};

const Container = styled(P)`
	width: 350px;
	text-align: left;
	padding: 0 30px 30px;
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
`;
