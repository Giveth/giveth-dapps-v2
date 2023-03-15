import { FC, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconChevronRight16,
	P,
} from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import { AddPolygonAddress } from '@/components/modals/AddPolygonAddress';

interface IAddPolygonToastProps {
	project: IProject;
}

export const AddPolygonToast: FC<IAddPolygonToastProps> = ({ project }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<Wrapper onClick={() => setShowModal(true)}>
				<P>Add polygon address for this project</P>
				<Flex gap='8px' alignItems='center'>
					<B>Add</B>
					<IconChevronRight16 />
				</Flex>
			</Wrapper>
			{showModal && (
				<AddPolygonAddress
					project={project}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

const Wrapper = styled(Flex)`
	width: 100%;
	background-color: ${brandColors.giv[50]};
	border: 1px solid ${brandColors.giv[300]};
	border-radius: 8px;
	padding: 8px;
	margin: 8px 8px 8px 0;
	justify-content: space-between;
	color: ${brandColors.giv[400]};
	transition: color 0.3s ease;
	cursor: pointer;
	&:hover {
		color: ${brandColors.giv[600]};
	}
`;
