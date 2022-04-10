import { brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import FixedToast from '@/components/toasts/FixedToast';

const GIVBackToast = (props: {
	projectEligible: boolean;
	tokenEligible: boolean;
}) => {
	const { projectEligible, tokenEligible } = props;
	let message, color, boldColor, backgroundColor;
	if (!projectEligible) {
		message = 'This project is not eligible for GIVbacks.';
		color = brandColors.mustard[700];
		boldColor = brandColors.mustard[800];
		backgroundColor = brandColors.mustard[200];
	} else if (tokenEligible) {
		message = 'This token is eligible for GIVbacks.';
		color = brandColors.giv[300];
		boldColor = brandColors.giv[600];
		backgroundColor = brandColors.giv[100];
	} else {
		message = 'This token is not eligible for GIVbacks.';
		color = brandColors.mustard[700];
		boldColor = brandColors.mustard[800];
		backgroundColor = brandColors.mustard[200];
	}

	return (
		<ToastContainer>
			<FixedToast
				message={message}
				color={color}
				boldColor={boldColor}
				backgroundColor={backgroundColor}
				href={Routes.GIVbacks}
			/>
		</ToastContainer>
	);
};

const ToastContainer = styled.div`
	margin: 12px 0;
`;

export default GIVBackToast;
