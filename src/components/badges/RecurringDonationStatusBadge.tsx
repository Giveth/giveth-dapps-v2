import { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { ERecurringDonationStatus } from '@/apollo/types/types';

interface IRecurringDonationStatus {
	status: ERecurringDonationStatus;
	isArchived?: boolean;
}

const mapStatusToColor = {
	[ERecurringDonationStatus.PENDING]: neutralColors.gray,
	[ERecurringDonationStatus.VERIFIED]: semanticColors.jade,
	[ERecurringDonationStatus.ENDED]: semanticColors.golden,
	[ERecurringDonationStatus.FAILED]: semanticColors.punch,
	[ERecurringDonationStatus.ACTIVE]: brandColors.giv,
};

const RecurringDonationStatusBadge: FC<IRecurringDonationStatus> = ({
	status,
	isArchived,
}) => {
	const { formatMessage } = useIntl();
	return isArchived ? (
		<Container $color={neutralColors.gray}>
			{formatMessage({ id: 'label.archived' })}
		</Container>
	) : (
		<Container $color={mapStatusToColor[status]}>{status}</Container>
	);
};

const Container = styled(SublineBold)<{ $color: any }>`
	display: flex;
	gap: 4px;
	align-items: center;
	text-transform: capitalize;
	border-radius: 50px;
	padding: 2px 8px;
	color: ${props => props.$color[600]};
	background: ${props => props.$color[200]};
`;

export default RecurringDonationStatusBadge;
