import { Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();

	return (
		<div>
			<ConfettiContainer>
				<LottieControl
					size={isMobile ? 200 : 600}
					animationData={CongratsAnimation}
				/>
			</ConfettiContainer>
			<BoostedTitle>
				{formatMessage({ id: 'label.project_boosted' })}
			</BoostedTitle>
			<Desc>
				{formatMessage(
					{
						id: 'label.you_boosted_this_project_with_percentage',
					},
					{ percentage },
				)}
				<br />
				{formatMessage({
					id: 'label.this_project_rank_will_only_change',
				})}
			</Desc>
			<ActionsSection>
				<Link
					href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
				>
					<GetButton
						label={formatMessage({
							id: 'label.get_more_givpower',
						})}
						size='small'
					/>
				</Link>
				<Link href={Routes.MyBoostedProjects}>
					<CustomButtonLink
						linkType='texty-primary'
						size='small'
						label={formatMessage({
							id: 'label.see_your_givpower_allocation',
						})}
					/>
				</Link>
				<CustomButton
					buttonType='texty'
					size='small'
					label={formatMessage({ id: 'label.dismiss' })}
					onClick={closeModal}
				/>
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
