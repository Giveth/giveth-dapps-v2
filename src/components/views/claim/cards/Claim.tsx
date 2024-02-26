import { FC, useState } from 'react';
import styled from 'styled-components';
import { H2, Lead } from '@giveth/ui-design-system';
import { useConnect, useAccount } from 'wagmi';
import { WriteContractReturnType } from 'viem';
import { Flex } from '@giveth/ui-design-system';
import { Button } from '../../../styled-components/Button';
import { Card, Header, PreviousArrowButton } from './common';
import { IClaimViewCardProps } from '../Claim.view';
import useClaim from '@/context/claim.context';
import config from '@/configuration';
import { GIVdropHarvestModal } from '../../../modals/GIVdropHarvestModal';
import { AddTokenButton } from '../../../AddTokenButton';

interface IClaimCardContainer {
	claimed: any;
}

const ClaimCardContainer = styled(Card)<IClaimCardContainer>`
	&::before {
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

const AddTokenRow = styled(Flex)`
	margin-top: 16px;
`;

const ClaimCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goPreviousStep, goNextStep } = useClaim();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { isConnected } = useAccount();
	const { connect, connectors } = useConnect();

	const [txStatus, setTxStatus] = useState<
		WriteContractReturnType | undefined
	>();
	const [showClaimModal, setShowClaimModal] = useState<boolean>(false);

	const checkNetworkAndWallet = async () => {
		if (!isConnected) {
			console.log('Wallet is not connected');
			await connect({
				connector: connectors.filter(c => c.id === 'injected')[0],
			});
			return false;
		}

		return chainId === config.GNOSIS_NETWORK_NUMBER;
	};

	const openHarvestModal = async () => {
		const check = checkNetworkAndWallet();
		if (!check) return;

		setShowClaimModal(true);
	};

	const onSuccess = (tx: WriteContractReturnType) => {
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
				<Flex $alignItems={'center'} $justifyContent={'center'}>
					{/* <ClaimButton secondary onClick={onClaim}> */}
					<ClaimButton
						$secondary
						onClick={() => {
							openHarvestModal();
						}}
						tabIndex={-1}
					>
						CLAIM
					</ClaimButton>
				</Flex>
				<AddTokenRow $alignItems={'center'} $justifyContent={'center'}>
					<AddTokenButton chainId={chainId} />
				</AddTokenRow>
				{step === index && (
					<>
						<PreviousArrowButton onClick={goPreviousStep} />
					</>
				)}
			</ClaimCardContainer>
			{showClaimModal && (
				<GIVdropHarvestModal
					setShowModal={setShowClaimModal}
					network={config.GNOSIS_NETWORK_NUMBER}
					givdropAmount={totalAmount}
					checkNetworkAndWallet={checkNetworkAndWallet}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
};

export default ClaimCard;
