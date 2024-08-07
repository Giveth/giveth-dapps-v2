import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { neutralColors, Flex, P, B, IconArrowRight } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IDraftDonation, IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { UsdAmountCard } from './QRDonationCard';
import Image from 'next/image';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import CopyConatainer from './CopyConatainer';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { IWalletAddress } from '@/apollo/types/types';

interface IQRDonationCardContentProps {
	tokenData?: IProjectAcceptedToken;
	usdAmount: string;
	amount: string;
	qrDonationStatus?: string;
	draftDonationData?: IDraftDonation;
	projectAddress?: IWalletAddress;
}

const ImageComponent = ({
	dataUrl,
	isExpired,
}: {
	dataUrl: string;
	isExpired?: boolean;
}) => {
	const { formatMessage } = useIntl();

	return dataUrl ? (
		<ImageWrapper>
			{isExpired && (
				<Overlay>
					<Flex $justifyContent='center' $alignItems='center'>
						<InlineToast
							type={EToastType.Info}
							message={
								formatMessage({
									id: 'label.qr_code_expired',
								})
							}
						/>
					</Flex>
				</Overlay>
			)}
			<Image
				src={dataUrl}
				alt='QR Code'
				width={200}
				height={200}
				unoptimized
			/>
		</ImageWrapper>
	) : (
		<P>QR code is loading...</P>
	);
};

const QRDonationCardContent: FC<IQRDonationCardContentProps> = ({
	tokenData,
	usdAmount,
	amount,
	qrDonationStatus,
	draftDonationData,
	projectAddress,
}) => {
	const { formatMessage } = useIntl();

	return (
		<>
			<DonationAmountCard>
				<P>
					{formatMessage({
						id: 'label.you_are_donating',
					})}
				</P>
				<AmountWrapper>
					<B>{amount}</B>
					<UsdAmountCard>$ {usdAmount}</UsdAmountCard>
					<IconArrowRight size={20} />
					<TokenIcon symbol={tokenData?.symbol} size={32} />
					<TokenSymbol>
						{tokenData?.symbol} on{' '}
						{config.NETWORKS_CONFIG[ChainType.STELLAR].name}
					</TokenSymbol>
				</AmountWrapper>
			</DonationAmountCard>
			<QRDataWrapper>
				<P>
					{formatMessage({
						id: 'label.scan_to_donate',
					})}
				</P>
				<ImageComponent
					dataUrl={draftDonationData?.qrCodeDataUrl ?? ''}
					isExpired={qrDonationStatus === 'expired'}
				/>
				<P>
					{formatMessage({
						id: 'label.project_address',
					})}
				</P>
				<CopyConatainer text={projectAddress?.address ?? ''} />
				<P>
					{formatMessage({
						id: 'label.copy_the_mnemo_to_use_in_your_app',
					})}
				</P>
				<CopyConatainer text={projectAddress?.memo ?? ''} />
			</QRDataWrapper>
		</>
	);
};

const DonationAmountCard = styled(Flex)`
	background-color: ${neutralColors.gray[200]};
	justify-content: space-between;
	align-items: center;
	border-radius: 1rem;
	padding: 1rem;
	margin-top: 1rem;
	width: 100%;
`;

const AmountWrapper = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	gap: 2px;
`;

const TokenSymbol = styled(B)`
	white-space: nowrap;
`;

const QRDataWrapper = styled(Flex)`
	flex-direction: column;
	padding: 1rem;
	background-color: ${neutralColors.gray[100]};
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 1rem;
	margin-top: 1rem;
	gap: 1rem;
	width: 100%;
`;

const ImageWrapper = styled(Flex)`
	position: relative;
	justify-content: center;
	align-items: center;
`;

const Overlay = styled(Flex)`
	position: absolute;
	z-index: 100;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.7);
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	backdrop-filter: blur(2px);
`;

export default QRDonationCardContent;
