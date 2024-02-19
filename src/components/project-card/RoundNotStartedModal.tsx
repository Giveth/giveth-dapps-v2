import { FC } from 'react';
import styled from 'styled-components';

import { Button, P } from '@giveth/ui-design-system';
import Link from 'next/link';
import { IModal } from '@/types/common';
import { mediaQueries } from '@/lib/constants/constants';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '../modals/Modal';
import { IQFRound } from '@/apollo/types/types';
import { formatDate } from '@/lib/helpers';

interface IRoundNotStartedModalProps extends IModal {
	destination: string;
	qfRounds: IQFRound[];
}

export const RoundNotStartedModal: FC<IRoundNotStartedModalProps> = ({
	setShowModal,
	destination,
	qfRounds,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const activeRound = qfRounds.find(r => r.isActive);
	const beginDate = activeRound?.beginDate;
	const name = activeRound?.name;

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Are you sure?'
			headerTitlePosition='left'
		>
			<ModalContainer>
				<Desc>
					The {name} hasn&apos;t started yet. It starts on{' '}
					{beginDate ? formatDate(new Date(beginDate)) : '--'}. You
					can donate now, but your donation will not be eligible for
					matching.
				</Desc>
				<Link href={destination}>
					<GotItButton label='Got It' buttonType='primary' />
				</Link>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 16px 24px;
	margin-bottom: 22px;
	text-align: left;
	width: 100%;
	${mediaQueries.tablet} {
		width: 570px;
	}
`;

const Desc = styled(P)`
	margin-top: 8px;
	margin-bottom: 24px;
`;

const GotItButton = styled(Button)`
	margin: auto;
	min-width: 220px;
`;
