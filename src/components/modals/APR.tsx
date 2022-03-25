import { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { BigNumber } from 'ethers';
import {
	brandColors,
	GLink,
	neutralColors,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';

import { IModal, Modal } from './Modal';
import { Flex } from '../styled-components/Flex';
import { PoolStakingConfig, RegenStreamConfig } from '@/types/config';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { WhatisGIVstreamModal } from './WhatisGIVstream';
import Routes from '@/lib/constants/Routes';

interface IAPRModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: BigNumber;
	regenStreamConfig?: RegenStreamConfig;
}

export const APRModal: FC<IAPRModalProps> = ({
	showModal,
	setShowModal,
	regenStreamConfig,
}) => {
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const { getTokenDistroHelper } = useTokenDistro();
	const { rewardTokenSymbol = 'GIV', type } = regenStreamConfig || {};
	const tokenDistroHelper = useMemo(
		() => getTokenDistroHelper(type),
		[getTokenDistroHelper, type],
	);

	return (
		<>
			<Modal
				showModal={showModal}
				setShowModal={setShowModal}
				headerTitle={'APR'}
			>
				<APRModalContainer>
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
							A percentage of the {rewardTokenSymbol} you earn
							from staking is claimable immediately, and the
							remaining percent goes into increasing your{' '}
							{rewardTokenSymbol}
							stream flowrate. Over time, a greater percentage of
							your total earnings will be claimable immediately
							following the continued expansion of the{' '}
							<Link href={Routes.GIVstream_FlowRate} passHref>
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

const DescContainer = styled.div`
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	padding: 18px;
	margin-top: 16px;
	margin-bottom: 16px;
`;

const AlertRow = styled(Flex)`
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
