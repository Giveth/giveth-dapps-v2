import {
	brandColors,
	IconTrash,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ButtonStyled } from '@/components/views/verification/common.styled';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';

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

export const ProgressBar = () => {
	const stepsCount = menuList.length;
	const { step } = useVerificationData();
	return (
		<Container>
			<Bar width={step / stepsCount} />
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
`;
