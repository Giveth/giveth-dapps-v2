import {
	brandColors,
	IconTrash,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import {
	ButtonStyled,
	RemoveBtn,
} from '@/components/views/verification/common.styled';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';

interface IRemoveBtnProps {
	onClick?: () => void;
}

export const RemoveButton: FC<IRemoveBtnProps> = ({ onClick }) => {
	return (
		<ButtonStyled
			label='REMOVE'
			color={neutralColors.gray[700]}
			size='small'
			icon={<IconTrash />}
			background={neutralColors.gray[300]}
			onClick={onClick && onClick}
		/>
	);
};

export const RemoveIcon: FC<IRemoveBtnProps> = ({ onClick }) => {
	return (
		<RemoveBtn onClick={onClick}>
			<IconTrash color={neutralColors.gray[700]} />
		</RemoveBtn>
	);
};

export const ProgressBar = () => {
	const stepsCount = menuList.length;
	const { step } = useVerificationData();
	const _step = step < 0 ? 0 : step; // For width animation on initial load
	return (
		<Container>
			<Bar width={(_step + 1) / stepsCount} />
		</Container>
	);
};

const Container = styled.div`
	background: ${neutralColors.gray[300]};
	height: 3px;
	border-radius: 5px;
`;

const Bar = styled.div<{ width: number }>`
	background: ${brandColors.giv[500]};
	border-radius: 5px;
	width: ${props => props.width * 100}%;
	height: 100%;
	transition: width 0.8s ease-in-out;
`;
