import { Dispatch, FC, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Caption,
	GLink,
	IconChevronRight16,
} from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import { AddPolygonAddressModal } from '@/components/modals/AddPolygonAddressModal';

interface IAddPolygonToastProps {
	project: IProject;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

export const AddPolygonToast: FC<IAddPolygonToastProps> = ({
	project,
	setProjects,
}) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<Wrapper>
				<Caption>Add Polygon address for this project</Caption>
				<Action
					gap='8px'
					alignItems='center'
					onClick={() => setShowModal(true)}
				>
					<GLink size='Medium'>Add</GLink>
					<IconChevronRight16 />
				</Action>
			</Wrapper>
			{showModal && (
				<AddPolygonAddressModal
					project={project}
					setShowModal={setShowModal}
					setProjects={setProjects}
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
	padding: 16px;
	margin: 8px 16px 8px 0;
	justify-content: space-between;
	color: ${brandColors.giv[300]};
`;

const Action = styled(Flex)`
	transition: color 0.3s ease;
	color: ${brandColors.giv[500]};
	cursor: pointer;
	&:hover {
		color: ${brandColors.giv[600]};
	}
`;
