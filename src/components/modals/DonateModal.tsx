import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import {
	brandColors,
	H3,
	H6,
	P,
	neutralColors,
	Button,
	semanticColors,
	IconInfo,
} from '@giveth/ui-design-system';
import { IconWalletApprove } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletApprove';

import { Modal } from '@/components/modals/Modal';
import { IProject } from '@/apollo/types/types';
import { formatPrice } from '@/lib/helpers';
import FixedToast from '@/components/toasts/FixedToast';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { ISuccessDonation } from '@/components/views/donate/CryptoDonation';
import { confirmDonation } from '@/components/views/donate/helpers';
import { IModal } from '@/types/common';
import { EDonationFailedType } from '@/components/modals/FailedDonation';

export interface IDonateModalProps extends IModal {
	setFailedModalType: (i: EDonationFailedType) => void;
	setTxHash: (i: string) => void;
	project: IProject;
	token: IProjectAcceptedToken;
	amount: number;
	price?: number;
	anonymous?: boolean;
	setSuccessDonation: (i: ISuccessDonation) => void;
	givBackEligible?: boolean;
}

const DonateModal = (props: IDonateModalProps) => {
	const { project, token, amount, price, setShowModal } = props;

	const web3Context = useWeb3React();

	const [donating, setDonating] = useState(false);
	const [donationSaved, setDonationSaved] = useState(false);

	const { title } = project || {};

	const avgPrice = price && price * amount;

	const handleDonate = () => {
		setDonating(true);
		confirmDonation({
			...props,
			setDonationSaved,
			web3Context,
			setDonating,
		}).then();
	};

	return (
		<Modal
			setShowModal={setShowModal}
			headerTitle='Donating'
			headerTitlePosition='left'
			headerIcon={<IconWalletApprove size={32} />}
		>
			<DonateContainer>
				<DonatingBox>
					<P>You are donating</P>
					<H3>
						{formatPrice(amount)} {token.symbol}
					</H3>
					{avgPrice ? <H6>{formatPrice(avgPrice)} USD</H6> : null}
					<P>
						To <span>{title}</span>
					</P>
				</DonatingBox>
				<Buttons>
					{donationSaved && (
						<FixedToast
							message='Your donation is being processed, you can close this modal.'
							color={semanticColors.blueSky[700]}
							backgroundColor={semanticColors.blueSky[100]}
							icon={
								<IconInfo
									size={16}
									color={semanticColors.blueSky[700]}
								/>
							}
						/>
					)}
					<DonateButton
						buttonType='primary'
						disabled={donating}
						label={donating ? 'DONATING' : 'DONATE'}
						onClick={handleDonate}
					/>
					{donationSaved && (
						<CloseButton
							label='CLOSE THIS MODAL'
							buttonType='texty'
							onClick={() => setShowModal(false)}
						/>
					)}
				</Buttons>
			</DonateContainer>
		</Modal>
	);
};

const DonateContainer = styled.div`
	background: white;
	color: black;
	padding: 24px 24px 38px;
	margin: 0;
	width: 100%;
	${mediaQueries.tablet} {
		width: 494px;
	}
`;

const DonatingBox = styled.div`
	color: ${brandColors.deep[900]};
	> :first-child {
		margin-bottom: 8px;
	}
	h3 {
		margin-top: -5px;
	}
	h6 {
		color: ${neutralColors.gray[700]};
		margin-top: -5px;
	}
	> :last-child {
		margin: 12px 0 32px 0;
		> span {
			font-weight: 500;
		}
	}
`;

const DonateButton = styled(Button)`
	background: ${(props: { disabled: boolean }) =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};
	:hover:enabled {
		background: ${brandColors.giv[700]};
	}
	:disabled {
		cursor: not-allowed;
	}
	* {
		margin: auto 0;
		padding: 0 8px 0 0;
		font-weight: bold;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

	> :first-child {
		margin: 15px 0;
	}
`;

const CloseButton = styled(Button)`
	margin: 5px 0 0 0;
	:hover {
		background: transparent;
	}
`;

export default DonateModal;
