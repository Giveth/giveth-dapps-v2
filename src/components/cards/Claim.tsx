import { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { Card, Header, PreviousArrowButton } from './common';
import { IClaimViewCardProps } from '../views/claim/Claim.view';
import useUser from '../../context/user.context';
import config from '../../configuration';
import { GIVdropHarvestModal } from '../modals/GIVdropHarvestModal';
import type { TransactionResponse } from '@ethersproject/providers';
import { H2, Lead } from '@giveth/ui-design-system';
import { AddGIVTokenButton } from '../AddGIVTokenButton';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

interface IClaimCardContainer {
	claimed: any;
}

const ClaimCardContainer = styled(Card)<IClaimCardContainer>`
	::before {
		content: '';
		background-image: ${props =>
			props.claimed ? '' : 'url(/images/wave.png)'};
		position: absolute;
		height: 143px;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 0;
	}
`;

const Title = styled(H2)``;

const Desc = styled(Lead)`
	margin-top: 22px;
`;

const ClaimHeader = styled(Header)`
	margin: 116px auto 48px auto;
	text-align: center;
`;

const ClaimButton = styled(Button)`
	width: 356px;
	text-transform: uppercase;
`;

const MetamaskButton = styled.a`
	width: 215px;
	heigh: 32px;
	margin-top: 12px;
	background: transparent;
	cursor: pointer;
`;

const AddTokenRow = styled(Row)`
	margin-top: 16px;
`;

const ClaimCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goPreviousStep, goNextStep } = useUser();
	const { active, activate, chainId, library } = useWeb3React();

	const [txStatus, setTxStatus] = useState<TransactionResponse | undefined>();
	const [showClaimModal, setShowClaimModal] = useState<boolean>(false);

	const checkNetworkAndWallet = async () => {
		if (!active) {
			console.log('Wallet is not connected');
			await activate(new InjectedConnector({}));
			return false;
		}

		if (chainId !== config.XDAI_NETWORK_NUMBER) {
			// await walletCheck();
			return false;
		}

		return true;
	};

	const openHarvestModal = async () => {
		const check = checkNetworkAndWallet();
		if (!check) return;

		setShowClaimModal(true);
	};

	const onSuccess = (tx: TransactionResponse) => {
		setTxStatus(tx);
		goNextStep();
	};

	return (
		<>
			<ClaimCardContainer
				activeIndex={step}
				index={index}
				claimed={txStatus}
			>
				<ClaimHeader>
					<Title as='h1' weight={700}>
						Claim your GIV now!
					</Title>
					<Desc>
						Let&apos;s Build the Future of Giving, together.
					</Desc>
				</ClaimHeader>
				<Row alignItems={'center'} justifyContent={'center'}>
					{/* <ClaimButton secondary onClick={onClaim}> */}
					<ClaimButton
						secondary
						onClick={() => {
							openHarvestModal();
						}}
						tabIndex={-1}
					>
						CLAIM
					</ClaimButton>
				</Row>
				<AddTokenRow alignItems={'center'} justifyContent={'center'}>
					<AddGIVTokenButton provider={library} />
				</AddTokenRow>
				{step === index && (
					<>
						<PreviousArrowButton onClick={goPreviousStep} />
					</>
				)}
			</ClaimCardContainer>
			{showClaimModal && (
				<GIVdropHarvestModal
					showModal={showClaimModal}
					setShowModal={setShowClaimModal}
					network={config.XDAI_NETWORK_NUMBER}
					givdropAmount={totalAmount}
					checkNetworkAndWallet={checkNetworkAndWallet}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
};

export default ClaimCard;
