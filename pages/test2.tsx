import { useState } from 'react';
import { neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import InputBox from '@/components/views/donate/InputBox';
import { AmountInput } from '@/components/AmountInput/AmountInput';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();

	return (
		<div>
			<w3m-button />
			<div>
				<button onClick={() => {}}>Test Button</button>
			</div>
			{failedModalType && (
				<FailedDonation
					txUrl={'0x01121212'}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
			<InputSlider
				value={Number(0.0)}
				onFocus={() => {}}
				onChange={() => {}}
				disabled={false}
			/>
		</div>
	);
};

export default YourApp;

const InputSlider = styled(InputBox)`
	width: 100%;
	height: 100%;
	border-left: 20px solid ${neutralColors.gray[300]} !important;
	background: red !important;
	padding: 20px;
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%; /* 24px */
		width: 100%;
		border-left: 20px solid ${neutralColors.gray[500]};
		background-color: ${neutralColors.gray[100]};
		color: blue;
		padding: 20px;
	}
`;

// const InputSlider = styled(AmountInput)`
// 	width: 100%;
// 	height: 100%;
// 	border-left: 20px solid ${neutralColors.gray[300]} !important;
// 	background: red !important;
// 	padding: 20px;
// 	#amount-input {
// 		border: none;
// 		flex: 1;
// 		font-family: Red Hat Text;
// 		font-size: 16px;
// 		font-style: normal;
// 		font-weight: 500;
// 		line-height: 150%; /* 24px */
// 		width: 100%;
// 		border-left: 20px solid ${neutralColors.gray[500]};
// 		background-color: ${neutralColors.gray[100]};
// 		color: blue;
// 		padding: 20px;
// 	}
// `;
