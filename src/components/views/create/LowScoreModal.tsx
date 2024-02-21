import React, { FC } from 'react';
import { Button, IconNetwork32, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';

interface ISwitchNetworkModal extends IModal {
	onSubmit: any;
}

export const LowScoreModal: FC<ISwitchNetworkModal> = ({
	onSubmit,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			headerTitle={'Low Project Score'}
			headerIcon={<IconNetwork32 />}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<Wrapper>
				<P>
					Your project can be published with its{' '}
					<b>current score below 80</b>, but achieving an optimal
					score might better motivate donors to support your cause.
				</P>
				<P>
					Are you sure you want to continue publishing your project?
				</P>
				<Flex flexDirection='column' gap='8px'>
					<StyledButton
						label='Yes, Publish My Project'
						buttonType='primary'
						onClick={() => {
							closeModal();
							onSubmit();
						}}
					/>
					<StyledButton
						label='No, let me improve my project score'
						onClick={closeModal}
						buttonType='texty-gray'
					/>
				</Flex>
			</Wrapper>
		</Modal>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 40px 24px;
	gap: 24px;
	flex-wrap: wrap;
	max-width: 600px;
	text-align: left;
`;

const StyledButton = styled(Button)`
	width: fit-content;
	min-width: 300px;
	margin: 0 auto;
`;
