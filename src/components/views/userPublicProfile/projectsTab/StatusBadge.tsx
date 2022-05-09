import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

const StatusBadge = (props: { status: EProjectStatus }) => {
	const { status } = props;

	let title = '',
		backgroundColor = '',
		color = '';
	switch (status) {
		case EProjectStatus.DEACTIVE:
			backgroundColor = neutralColors.gray[300];
			title = 'Deactivated';
			color = neutralColors.gray[700];
			break;
		case EProjectStatus.CANCEL:
			backgroundColor = semanticColors.golden[200];
			title = 'Cancelled';
			color = semanticColors.golden[600];
			break;
		case EProjectStatus.DRAFT:
			backgroundColor = brandColors.giv[100];
			title = 'Draft';
			color = brandColors.giv[500];
			break;
		case EProjectStatus.ACTIVE:
			backgroundColor = semanticColors.blueSky[100];
			title = 'Active';
			color = semanticColors.blueSky[500];
			break;
	}

	return (
		<Container color={color} backgroundColor={backgroundColor}>
			{title}
		</Container>
	);
};

const Container = styled(SublineBold)<{
	backgroundColor: string;
	color: string;
}>`
	border-radius: 4px;
	padding: 2px 8px;
	color: ${props => props.color};
	background-color: ${props => props.backgroundColor};
`;

export default StatusBadge;
