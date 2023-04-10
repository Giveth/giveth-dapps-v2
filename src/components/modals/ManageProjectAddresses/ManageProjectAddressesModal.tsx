import {
	IconWalletOutline32,
	neutralColors,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IProject } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import type { IModal } from '@/types/common';

interface IManageProjectAddressesModal extends IModal {
	project: IProject;
}

export const ManageProjectAddressesModal: FC<IManageProjectAddressesModal> = ({
	project,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	console.log('project.address', project.addresses);

	return (
		<Modal
			headerIcon={<IconWalletOutline32 />}
			headerTitle='Manage addresses'
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<Content>
					<SublineBold>{project.title}</SublineBold>
					<Subline>
						{formatMessage({ id: 'label.recipient_addresses' })}
					</Subline>
				</Content>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	text-align: left;
	padding: 24px;
	${mediaQueries.tablet} {
		width: 556px;
	}
`;

const Content = styled(Flex)`
	gap: 4px;
	padding-bottom: 24px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;
