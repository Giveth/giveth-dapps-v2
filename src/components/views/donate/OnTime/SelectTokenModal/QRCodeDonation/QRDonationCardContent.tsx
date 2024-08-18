import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
	neutralColors,
	Flex,
	P,
	B,
	IconArrowRight,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { IDraftDonation, IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { UsdAmountCard } from './QRDonationCard';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import CopyConatainer from './CopyConatainer';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { IWalletAddress } from '@/apollo/types/types';
import { Spinner } from '@/components/Spinner';

interface IQRDonationCardContentProps {
	tokenData?: IProjectAcceptedToken;
	usdAmount: string;
	amount: string;
	qrDonationStatus?: string;
	draftDonationData?: IDraftDonation;
	projectAddress?: IWalletAddress;
	draftDonationLoading?: boolean;
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
							message={formatMessage({
								id: 'label.qr_code_expired',
							})}
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
		<Flex
			$justifyContent='center'
			$alignItems='center'
			style={{ marginBlock: '2rem' }}
		>
			<InlineToast
				type={EToastType.Error}
				message={formatMessage({
					id: 'label.qr_code_error',
				})}
			/>
		</Flex>
	);
};

const QRDonationCardContent: FC<IQRDonationCardContentProps> = ({
	tokenData,
	usdAmount,
	amount,
	qrDonationStatus,
	draftDonationData,
	projectAddress,
	draftDonationLoading,
}) => {
	const { formatMessage } = useIntl();

	if (draftDonationLoading) {
		return (
			<Flex
				$justifyContent='center'
				$alignItems='center'
				style={{ marginBlock: '3rem' }}
			>
				<Spinner />
			</Flex>
		);
	}

	return (
		<>
			<DonationAmountCard>
				<P style={{ minWidth: 'fit-content' }}>
					{formatMessage({
						id: 'label.you_are_donating',
					})}
				</P>
				<AmountWrapper>
					<Flex $alignItems='center' gap='2px'>
						<B>{amount ?? '--'}</B>
						<UsdAmountCard>
							{' '}
							{usdAmount ? `$ ${usdAmount}` : '--'}
						</UsdAmountCard>
						<IconArrowRight size={20} />
					</Flex>
					<Flex $alignItems='center' gap='2px'>
						<TokenIcon symbol={tokenData?.symbol} size={32} />
						<TokenSymbol>
							{tokenData?.symbol} on{' '}
							{config.NETWORKS_CONFIG[ChainType.STELLAR].name}
						</TokenSymbol>
					</Flex>
				</AmountWrapper>
			</DonationAmountCard>
			<QRDataWrapper>
				<B>
					{formatMessage({
						id: 'label.scan_to_donate',
					})}
				</B>
				<ImageComponent
					dataUrl={draftDonationData?.qrCodeDataUrl ?? ''}
					isExpired={
						!!qrDonationStatus &&
						['expired', 'failed'].includes(qrDonationStatus)
					}
				/>
				<B>
					{formatMessage({
						id: 'label.project_address',
					})}
				</B>
				<CopyConatainer text={projectAddress?.address ?? ''} />
				{projectAddress?.memo ? (
					<>
						<B>
							{formatMessage({
								id: 'label.copy_the_mnemo_to_use_in_your_app',
							})}
						</B>
						<CopyConatainer text={projectAddress.memo ?? ''} />
					</>
				) : (
					<InlineToast
						type={EToastType.Info}
						message={formatMessage({
							id: 'label.no_memo_is_needed_for_this_address',
						})}
					/>
				)}
			</QRDataWrapper>
		</>
	);
};

const DonationAmountCard = styled(Flex)`
	background-color: ${neutralColors.gray[200]};
	border: 1px solid ${neutralColors.gray[700]};
	justify-content: space-between;
	align-items: center;
	border-radius: 8px;
	padding: 10px 16px;
	margin-top: 1rem;
	width: 100%;
	gap: 1rem;
	flex-wrap: wrap;
`;

const AmountWrapper = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	gap: 2px;
	flex-wrap: wrap;
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
