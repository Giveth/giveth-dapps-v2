import { FC } from 'react';
import { semanticColors } from '@giveth/ui-design-system';
import { EVerificationStatus } from '@/apollo/types/types';
import { Badge } from './styled-components/Badge';

interface IProps {
	status?: EVerificationStatus;
	simplified?: boolean;
}

const VerificationBadge: FC<IProps> = ({ status, simplified }) => {
	if (!status || status === EVerificationStatus.DRAFT) return null;
	let title, color;
	switch (status) {
		case EVerificationStatus.REJECTED:
			title = simplified ? 'Rejected' : 'Verification rejected';
			color = semanticColors.punch;
			break;
		case EVerificationStatus.SUBMITTED:
			title = simplified ? 'Request sent' : 'Verification request sent';
			color = semanticColors.golden;
			break;
		case EVerificationStatus.VERIFIED:
			title = 'Verified';
			color = semanticColors.jade;
			break;
	}

	return <Badge mainColor={color}>{title}</Badge>;
};

export default VerificationBadge;
