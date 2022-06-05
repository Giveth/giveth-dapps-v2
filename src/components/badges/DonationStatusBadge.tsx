import { FC } from 'react';
import styled from 'styled-components';
import {
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { EDonationStatus } from '@/apollo/types/gqlEnums';

interface IDonationStatus {
	status: EDonationStatus;
}

const DonationStatus: FC<IDonationStatus> = ({ status }) => {
	let _status: string = status;
	if (status === EDonationStatus.VERIFIED) _status = 'success';
	return (
		<Container status={status}>
			{status === EDonationStatus.PENDING && <Bullet />}
			{_status}
		</Container>
	);
};

const Bullet = styled.div`
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: ${neutralColors.gray[700]};
`;

const Container = styled(SublineBold)<IDonationStatus>`
	display: flex;
	gap: 4px;
	align-items: center;
	text-transform: capitalize;
	border-radius: 50px;
	padding: 2px 8px;
	border: 2px solid
		${props => {
			switch (props.status) {
				case EDonationStatus.VERIFIED:
					return semanticColors.jade[300];
				case EDonationStatus.PENDING:
					return neutralColors.gray[400];
				case EDonationStatus.FAILED:
					return semanticColors.punch[200];
			}
		}};
	color: ${props => {
		switch (props.status) {
			case EDonationStatus.VERIFIED:
				return neutralColors.gray[700];
			case EDonationStatus.PENDING:
				return neutralColors.gray[700];
			case EDonationStatus.FAILED:
				return semanticColors.punch[700];
		}
	}};
	background: ${props => {
		switch (props.status) {
			case EDonationStatus.VERIFIED:
				return semanticColors.jade[100];
			case EDonationStatus.PENDING:
				return 'transparent';
			case EDonationStatus.FAILED:
				return semanticColors.punch[100];
		}
	}};
`;

export default DonationStatus;
