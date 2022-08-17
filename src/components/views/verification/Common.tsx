import { IconTrash, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';
import {
	ButtonStyled,
	RemoveBtn,
} from '@/components/views/verification/Common.sc';
import ProgressBar from '@/components/ProgressBar';

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

export const StepsProgressBar = () => {
	const stepsCount = menuList.length;
	const { step } = useVerificationData();
	const _step = step < 0 ? 0 : step; // For width animation on initial load
	return <ProgressBar percentage={((_step + 1) * 100) / stepsCount} />;
};
