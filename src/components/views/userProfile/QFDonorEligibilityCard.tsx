import React from 'react';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import {
	Flex,
	P,
	neutralColors,
	semanticColors,
	H5,
	Button,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { ContributeCardBox } from '@/components/ContributeCard.sc';
import { scoreUserAddress } from '@/services/passport';

type TQFEligibilityData = {
	[key in 'NOT_ELIGIBLE' | 'ELIGIBLE']: {
		bgColor: string;
		color: string;
		text: string;
		icon?: JSX.Element;
	};
};

//TODO: add it to ui-design-system
const VerifiedIcon = () => {
	return (
		<svg
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M12 1.99951C6.48606 1.99951 2 6.48557 2 11.9995C2 17.5135 6.48606 21.9995 12 21.9995C17.5139 21.9995 22 17.5135 22 11.9995C22 6.48557 17.5139 1.99951 12 1.99951ZM17.2043 8.64807L10.7428 16.3404C10.6719 16.4248 10.5837 16.493 10.4842 16.5404C10.3846 16.5877 10.2761 16.6131 10.1659 16.6149H10.1529C10.0451 16.6149 9.93846 16.5922 9.83998 16.5483C9.7415 16.5044 9.65335 16.4403 9.58125 16.3601L6.81202 13.2832C6.74169 13.2086 6.68698 13.1207 6.65111 13.0246C6.61524 12.9286 6.59892 12.8264 6.60313 12.7239C6.60733 12.6215 6.63197 12.5209 6.67559 12.4282C6.71922 12.3354 6.78094 12.2523 6.85715 12.1837C6.93336 12.1151 7.0225 12.0625 7.11935 12.0288C7.21619 11.9952 7.31878 11.9812 7.42109 11.9878C7.5234 11.9944 7.62336 12.0214 7.7151 12.0671C7.80683 12.1129 7.8885 12.1765 7.95529 12.2543L10.1327 14.6736L16.0264 7.65865C16.1586 7.5058 16.3457 7.41112 16.5471 7.39506C16.7486 7.37901 16.9483 7.44288 17.103 7.57286C17.2577 7.70284 17.3551 7.8885 17.3741 8.08969C17.393 8.29089 17.3321 8.49147 17.2043 8.64807Z'
				fill='white'
			/>
		</svg>
	);
};

enum QFEligibilityState {
	NOT_ELIGIBLE = 'NOT_ELIGIBLE',
	ELIGIBLE = 'ELIGIBLE',
}

const QFEligibilityCurrentState = QFEligibilityState.NOT_ELIGIBLE;

const QFEligibilityData: TQFEligibilityData = {
	[QFEligibilityState.NOT_ELIGIBLE]: {
		bgColor: semanticColors.golden[300],
		color: semanticColors.golden[700],
		text: 'Not Eligible',
	},
	[QFEligibilityState.ELIGIBLE]: {
		bgColor: semanticColors.jade[500],
		color: neutralColors.gray[100],
		text: 'QF Eligible',
		icon: <VerifiedIcon />,
	},
};

export const QFDonorEligibilityCard = () => {
	const { formatMessage } = useIntl();
	const { address } = useAccount();

	const checkEligibility = () => {
		console.log('Check Eligibility');
		scoreUserAddress(address);
	};

	return (
		<StyledContributeCardBox>
			<EligibilityCardTop>
				<H5 weight={700}>
					{formatMessage({ id: 'QF Donor Eligibility' })}
				</H5>
				<QFEligibilityStatus
					$bgColor={
						QFEligibilityData[QFEligibilityCurrentState].bgColor
					}
					$color={QFEligibilityData[QFEligibilityCurrentState].color}
				>
					{formatMessage({
						id: QFEligibilityData[QFEligibilityCurrentState].text,
					})}
					{QFEligibilityData[QFEligibilityCurrentState].icon}
				</QFEligibilityStatus>
			</EligibilityCardTop>
			<EligibilityCardDesc>
				<P>
					{formatMessage({
						id: 'Verify your donor uniqueness with a quick check of your on-chain activity.',
					})}
				</P>
			</EligibilityCardDesc>
			<Hr />
			<EligibilityCardBottom>
				<P>{formatMessage({ id: 'It won’t take long!' })}</P>
				<Button
					label='Check Eligibility'
					size='small'
					buttonType='primary'
					onClick={checkEligibility}
				/>
			</EligibilityCardBottom>
		</StyledContributeCardBox>
	);
};

const StyledContributeCardBox = styled(ContributeCardBox)`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const EligibilityCardTop = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

const QFEligibilityStatus = styled.div<{
	$bgColor: string;
	$color: string;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	height: 40px;
	width: 135px;
	border-radius: 25px;
	background-color: ${props => props.$bgColor};
	color: ${props => props.$color};
`;

const EligibilityCardDesc = styled.div`
	width: 100%;
	max-width: 1000px;
	gap: 20px;
	button {
		margin: 20px 0 0 0;
		width: 100%;
	}
	background-color: ${neutralColors.gray[200]};
	padding: 16px;
	border-radius: 8px;
`;

const EligibilityCardBottom = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
`;

const Hr = styled.div`
	height: 1px;
	background-color: ${neutralColors.gray[300]};
	width: 100%;
`;
