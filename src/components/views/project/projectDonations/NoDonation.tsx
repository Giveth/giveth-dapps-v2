import { ButtonLink, H1, H2, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { slugToProjectDonate } from '@/lib/routeCreators';
import { useProjectContext } from '@/context/project.context';
import { IQFRound } from '@/apollo/types/types';
import { getNowUnixMS } from '@/helpers/time';
import { RoundNotStartedModal } from '@/components/project-card/RoundNotStartedModal';

interface INoDonation {
	selectedQF: IQFRound | null;
}

export const NoDonation: FC<INoDonation> = ({ selectedQF }) => {
	const [showHintModal, setShowHintModal] = useState(false);

	const { formatMessage } = useIntl();
	const { projectData, isActive } = useProjectContext();
	const { slug } = projectData || {};
	const _startDate = selectedQF
		? new Date(selectedQF.beginDate).getTime()
		: 0;
	const now = getNowUnixMS();
	const isRoundStarted = now > _startDate;
	const destination = slugToProjectDonate(slug || '');

	// Show hint modal if the user clicks on the card and the round is not started
	const handleClick = (e: any) => {
		if (isRoundStarted) return;
		e.preventDefault();
		e.stopPropagation();
		setShowHintModal(true);
	};

	return (
		<Wrapper>
			{selectedQF && !selectedQF.isActive ? (
				<H2>There were no donations in this round.</H2>
			) : (
				<>
					<H1>Be the</H1>
					<H1 weight={700}>First</H1>
					<H1>to</H1>
					<H1 weight={700}>Donate</H1>
					{selectedQF && selectedQF.isActive && (
						<H1>in This Round</H1>
					)}
					{isActive ? (
						<Link href={destination} onClick={e => handleClick(e)}>
							<DonateButton
								linkType='primary'
								label={formatMessage({ id: 'label.donate' })}
							/>
						</Link>
					) : (
						<DonateButton
							linkType='primary'
							label={formatMessage({ id: 'label.donate' })}
							disabled
						/>
					)}
				</>
			)}
			{showHintModal && selectedQF && (
				<RoundNotStartedModal
					setShowModal={setShowHintModal}
					destination={destination}
					qfRound={selectedQF}
				/>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 60px;
	background-image: url('/images/backgrounds/giv-background.svg');
	color: ${brandColors.giv[500]};
	text-align: center;
	height: 100%;
`;

const DonateButton = styled(ButtonLink)`
	margin-top: 40px;
	display: inline-block;
	min-width: 260px;
`;
