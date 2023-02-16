import { Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import React from 'react';
import useDetectDevice from '@/hooks/useDetectDevice';
import { ConfettiContainer, BoostedTitle } from './BoostModal.sc';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';
import { GetButton, CustomButton, CustomButtonLink } from './ZeroGivpowerModal';
import { mediaQueries } from '@/lib/constants/constants';
import CongratsAnimation from '@/animations/congrats.json';
import LottieControl from '@/components/LottieControl';
import type { FC } from 'react';

interface IBoostedModalProps {
	percentage: number;
	closeModal: () => void;
}

const BoostedInnerModal: FC<IBoostedModalProps> = ({
	percentage,
	closeModal,
}) => {
	const { isMobile } = useDetectDevice();

	return (
		<div>
			<ConfettiContainer>
				<LottieControl
					size={isMobile ? 200 : 600}
					animationData={CongratsAnimation}
				/>
			</ConfettiContainer>
			<BoostedTitle>Project boosted!</BoostedTitle>
			<Desc>
				You boosted this project with {percentage}% of your GIVpower.
				<br />
				Note: This project’s rank will only change at the start of of
				the next GIVbacks round.
			</Desc>
			<ActionsSection>
				<Link
					href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
				>
					<GetButton label='Get more GIVpower' size='small' />
				</Link>
				<Link href={Routes.MyBoostedProjects}>
					<CustomButtonLink
						linkType='texty-primary'
						size='small'
						label='see your GIVpower allocations'
					/>
				</Link>
				<CustomButton
					buttonType='texty'
					size='small'
					label='DISMISS'
					onClick={closeModal}
				/>
			</ActionsSection>
		</div>
	);
};

const ActionsSection = styled.div`
	margin-top: 68px;
`;

const Desc = styled(Lead)`
	width: 100%;
	margin: auto;
	${mediaQueries.tablet} {
		width: 398px;
	}
`;

export default BoostedInnerModal;
