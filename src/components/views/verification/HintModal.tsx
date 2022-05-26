import { FC } from 'react';
import { neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { Bullets } from '@/components/styled-components/Bullets';

const HintModal: FC<IModal> = ({ setShowModal }) => {
	return (
		<Modal
			headerTitle='Hint!!!'
			headerTitlePosition='left'
			setShowModal={setShowModal}
		>
			<Container>
				<P>
					Our verification team needs to ensure that you are actually
					a representative of this project or organization.
				</P>
				<Bullets>
					<li>
						This information will be kept private and will never be
						shared publicly.
					</li>
				</Bullets>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 24px;
	max-width: 401px;
	text-align: left;
	color: ${neutralColors.gray[700]};
`;

export default HintModal;
