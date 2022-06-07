import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import {
	brandColors,
	neutralColors,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';

import { Modal } from './Modal';
import { Flex } from '../styled-components/Flex';
import { RegenStreamConfig } from '@/types/config';
import { IModal } from '@/types/common';
import type { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';

interface IAPRModalProps extends IModal {
	tokenDistroHelper?: TokenDistroHelper;
	regenStreamConfig?: RegenStreamConfig;
}

export const APRModal: FC<IAPRModalProps> = ({
	setShowModal,
	tokenDistroHelper,
	regenStreamConfig,
}) => {
	const { rewardTokenSymbol = 'GIV', type } = regenStreamConfig || {};
	const streamName = regenStreamConfig ? 'RegenStream' : 'GIVstream';

	return (
		<Modal setShowModal={setShowModal} headerTitle={'APR'}>
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
						A percentage of the {rewardTokenSymbol} you earn from
						staking is claimable immediately, and the remaining
						percent goes into increasing your {rewardTokenSymbol}
						stream flowrate. Over time, a greater percentage of your
						total earnings will be claimable immediately.
					</Desc>
					<DescTitle>Current Distribution:</DescTitle>
					<Desc>
						Claimable immediately:{' '}
						{tokenDistroHelper?.GlobalReleasePercentage.toFixed(2)}%
					</Desc>
					<Desc>
						Increasing your {streamName}:{' '}
						{(
							100 -
							(tokenDistroHelper?.GlobalReleasePercentage || 0)
						).toFixed(2)}
						%
					</Desc>
				</DescContainer>
			</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
	padding: 16px 24px;
	margin-bottom: 22px;
	text-align: left;
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
