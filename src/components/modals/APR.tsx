import { FC, useState } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import Link from 'next/link';
import {
	H6,
	GLink,
	IconCalculator,
	neutralColors,
	brandColors,
	SublineBold,
	Subline,
} from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { Row } from '../styled-components/Grid';
import { PoolStakingConfig } from '@/types/config';
import { useTokenDistro } from '@/context/tokenDistro.context';
import Image from 'next/image';
import { WhatisGIVstreamModal } from './WhatisGIVstream';
interface IAPRModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: BigNumber;
}

export const APRModal: FC<IAPRModalProps> = ({
	showModal,
	setShowModal,
	poolStakingConfig,
	maxAmount,
}) => {
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const { tokenDistroHelper } = useTokenDistro();

	return (
		<>
			<Modal showModal={showModal} setShowModal={setShowModal}>
				<APRModalContainer>
					<Row gap='8px' alignItems='center'>
						<APRLabel>APR</APRLabel>
						{/* <IconCalculator size={16} /> */}
					</Row>
					{/* <InputLabel size='big'>{`${poolStakingConfig.title} ${poolStakingConfig.unit} Staking`}</InputLabel>
					<USDInput
						maxAmount={maxAmount}
						poolStakingConfig={poolStakingConfig}
					/> */}
					<DescContainer>
						<AlertRow alignItems='flex-end'>
							<Image
								width={24}
								height={24}
								src='/images/alert.svg'
								alt='alert'
							/>
							<SublineBold>IMPORTANT</SublineBold>
						</AlertRow>
						<Desc>
							A percentage of the GIV you earn from staking is
							claimable immediately, and the remaining percent
							goes into increasing your GIVstream flowrate. Over
							time, a greater percentage of your total earnings
							will be claimable immediately following the
							continued expansion of the{' '}
							<Link href='/givstream#flowRate' passHref>
								<GIViverseLink>GIViverse</GIViverseLink>
							</Link>
						</Desc>
						<DescTitle>Current Distribution:</DescTitle>
						<Desc>
							Claimable immediately:{' '}
							{tokenDistroHelper.GlobalReleasePercentage}%
						</Desc>
						<Desc>
							Increasing your GIVstream:{' '}
							{100 - tokenDistroHelper.GlobalReleasePercentage}%
						</Desc>
						<Whatis>
							<a
								href='https://docs.giveth.io/giveconomy/givstream/'
								target='_blank'
								rel='noreferrer'
							>
								Read More
							</a>
						</Whatis>
					</DescContainer>
				</APRModalContainer>
			</Modal>
			{showWhatIsGIVstreamModal && (
				<WhatisGIVstreamModal
					showModal={showWhatIsGIVstreamModal}
					setShowModal={setShowWhatIsGIVstreamModal}
				/>
			)}
		</>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
	padding: 16px 24px;
	margin-bottom: 22px;
	text-align: left;
`;

const GIViverseLink = styled.span`
	cursor: pointer;
	color: ${brandColors.cyan[500]};
`;
const APRLabel = styled(H6)``;

const InputLabel = styled(GLink)`
	text-align: left;
	color: ${neutralColors.gray[100]};
	margin-bottom: 8px;
`;

const DescContainer = styled.div`
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	padding: 18px;
	margin-top: 16px;
	margin-bottom: 16px;
`;

const AlertRow = styled(Row)`
	gap: 8px;
	margin-bottom: 8px;
`;

const Desc = styled(Subline)``;

const DescTitle = styled(Subline)`
	font-weight: bold;
	margin-top: 8px;
`;

const Whatis = styled(GLink)`
	cursor: pointer;
	color: ${brandColors.cyan[500]};
`;
