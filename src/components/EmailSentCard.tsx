import { IconAlertCircle, Flex, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

// import { Container } from './styles';
type EmailSentCardProps = {
	email: string;
};

const EmailSentCard: React.FC<EmailSentCardProps> = ({ email }) => {
	return (
		<EmailSentNotification
			gap='8px'
			$alignItems='center'
			$justifyContent='center'
		>
			<IconAlertCircle />
			Verification code sent to {email}
		</EmailSentNotification>
	);
};

const EmailSentNotification = styled(Flex)`
	border: 1px solid ${brandColors.giv[200]};
	padding: 16px;
	border-radius: 8px;

	font-size: 12px;
	font-weight: 400;
	line-height: 15.88px;
	text-align: left;
	color: ${brandColors.giv[500]};

	svg {
		color: ${brandColors.giv[500]};
	}
`;

export default EmailSentCard;
