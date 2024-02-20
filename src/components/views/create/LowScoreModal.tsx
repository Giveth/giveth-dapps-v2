import React, { FC } from 'react';
import {
	brandColors,
	IconNetwork32,
	neutralColors,
	Overline,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { ETheme } from '@/features/general/general.slice';

interface ISwitchNetworkModal extends IModal {}

export const LowScoreModal: FC<ISwitchNetworkModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			headerTitle={'Low Project Score'}
			headerIcon={<IconNetwork32 />}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<P>
				Your project can be published with its{' '}
				<b>current score below 80</b>, but achieving an optimal score
				might better motivate donors to support your cause.
			</P>
			<P>Are you sure you want to continue publishing your project?</P>
		</Modal>
	);
};

export const SelectedNetwork = styled(Overline)`
	color: ${props =>
		props.themeState === ETheme.Dark
			? brandColors.giv[100]
			: brandColors.giv[500]};
	position: absolute;
	top: -8px;
	left: 10px;
	background: ${props =>
		props.themeState === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	padding: 0 3px;
	border-radius: 4px;
`;
