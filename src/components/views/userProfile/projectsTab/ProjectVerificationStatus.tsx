import styled from 'styled-components';
import {
	SublineBold,
	brandColors,
	neutralColors,
  semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

interface IProjectVerificationStatus {
	verified?: boolean;
}

const ProjectVerificationStatus = ({
	verified = false,
}: IProjectVerificationStatus) => {
	const { formatMessage } = useIntl();
	const verifiedStatus = verified
		? formatMessage({
				id: 'label.verified',
			})
		: formatMessage({
				id: 'label.verified_not',
			});

	return (
		<StatusBadge $isVerified={verified}>
			<SublineBold>{verifiedStatus}</SublineBold>
		</StatusBadge>
	);
};

const getBackgroundColor = (isVerified: boolean) => {
	return isVerified ? semanticColors.jade[100] : semanticColors.golden[100];
};

const getBorderColor = (isVerified: boolean) => {
	return isVerified ? semanticColors.jade[400] : semanticColors.golden[400];
};

const getColor = (isVerified: boolean) => {
	return isVerified ? semanticColors.jade[700] : semanticColors.golden[700];
};

const StatusBadge = styled.div<{ $isVerified: boolean }>`
	border-radius: 50px;
	padding: 2px 8px;
	border-width: 2px;
	border-style: solid;
	background-color: ${({ $isVerified }) => getBackgroundColor($isVerified)};
	border-color: ${({ $isVerified }) => getBorderColor($isVerified)};
	color: ${({ $isVerified }) => getColor($isVerified)};
`;

export default ProjectVerificationStatus;
