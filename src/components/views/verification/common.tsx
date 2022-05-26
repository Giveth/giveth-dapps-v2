import { IconTrash, neutralColors } from '@giveth/ui-design-system';
import { ButtonStyled } from '@/components/views/verification/common.styled';

export const ButtonRemove = () => {
	return (
		<ButtonStyled
			label='REMOVE'
			color={neutralColors.gray[700]}
			size='small'
			icon={<IconTrash />}
			background={neutralColors.gray[300]}
		/>
	);
};
