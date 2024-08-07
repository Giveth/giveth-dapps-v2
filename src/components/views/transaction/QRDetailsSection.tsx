import React, { useEffect } from 'react';
import styled from 'styled-components';
import { neutralColors, Flex } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import QRDonationCardContent from '@/components/views/donate/OnTime/SelectTokenModal/QRCodeDonation/QRDonationCardContent';
import { IDraftDonation, IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { ChainType } from '@/types/config';

type TQRDetailsSectionProps = {
	usdAmount: string;
	status?: string;
	draftDonationData?: IDraftDonation;
};

const StellarData = {
	name: 'Stellar',
	chainType: ChainType.STELLAR,
	symbol: 'XLM',
} as IProjectAcceptedToken; 

const QRDetailsSection: React.FC<TQRDetailsSectionProps> = ({
	usdAmount,
	status,
	draftDonationData,
}) => {
	return (
		<DetailsWapper>
			<QRDonationCardContent
				tokenData={StellarData}
				usdAmount={usdAmount}
				amount={draftDonationData?.amount?.toString() || '0'}
				qrDonationStatus={status}
				draftDonationData={draftDonationData}
				projectAddress={draftDonationData?.project?.addresses?.find(
					address => address.chainType === ChainType.STELLAR,
				)}
			/>
		</DetailsWapper>
	);
};

const DetailsWapper = styled(Flex)`
	width: 80%;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 30px;
	padding: 20px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background-color: ${neutralColors.gray[100]};

	${mediaQueries.laptopL} {
		width: 60%;
	}

	${mediaQueries.desktop} {
		width: 50%;
	}
`;

export default QRDetailsSection;
