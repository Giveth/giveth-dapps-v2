import React, { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Button, neutralColors, P, Subline } from '@giveth/ui-design-system';
import { useSwitchNetwork } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { useDonateData } from '@/context/donate.context';
import { getActiveRound } from '@/helpers/qf';
import config from '@/configuration';

const QFModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const { switchNetwork } = useSwitchNetwork();
	const { project } = useDonateData();
	const activeRound = getActiveRound(project.qfRounds);
	const roundName = activeRound?.name;
	const eligibleChainName =
		config.NETWORKS_CONFIG[activeRound?.eligibleNetworks[0] || 1].name;

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.get_your_donations_matched',
			})}
			headerTitlePosition='left'
		>
			<Container>
				<P>
					{formatMessage({
						id: 'label.your_donation_can_qualify_for_matching_1',
					})}
					<span> {eligibleChainName} </span>
					{formatMessage({
						id: 'label.your_donation_can_qualify_for_matching_2',
					})}
					{' ' + roundName}.
				</P>
				<Button
					label={formatMessage({ id: 'label.switch_network' })}
					onClick={() => {
						switchNetwork?.(activeRound?.eligibleNetworks[0]);
						closeModal();
					}}
					buttonType='primary'
				/>
				<Hr />
				<Subline>
					{formatMessage({ id: 'label.you_can_still_donate' })}
				</Subline>
			</Container>
		</Modal>
	);
};

const Hr = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${neutralColors.gray[400]};
`;

const Container = styled.div`
	padding: 24px;
	max-width: 510px;
	text-align: left;
	color: ${neutralColors.gray[900]};
	> *:first-child {
		> span {
			font-weight: 500;
		}
	}
	> *:last-child {
		margin-top: 8px;
		color: ${neutralColors.gray[700]};
	}
	> button {
		padding: 16px 50px;
		margin: 32px auto;
	}
`;

export default QFModal;
