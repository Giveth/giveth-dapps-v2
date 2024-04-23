import {
	Button,
	IconHelpOutline32,
	mediaQueries,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { ScoreState, infoMap } from './scoreHelpers';
import { ScoreModal } from './ScoreModal';

interface IScoreButtonProps {
	fieldsScores: ScoreState;
}

export const ScoreButton: FC<IScoreButtonProps> = ({ fieldsScores }) => {
	const [showScoreModal, setShowScoreModal] = useState(false);
	const { formatMessage } = useIntl();

	return (
		<>
			<StyledButton
				label={formatMessage({
					id: infoMap[fieldsScores.quality].title,
				})}
				buttonType='texty-primary'
				onClick={() => setShowScoreModal(true)}
				icon={<IconHelpOutline32 />}
			/>

			{showScoreModal && (
				<ScoreModal
					setShowModal={setShowScoreModal}
					fieldsScores={fieldsScores}
				/>
			)}
		</>
	);
};

const StyledButton = styled(Button)`
	box-shadow: ${Shadow.Neutral[400]};
	transition: box-shadow 0.2s ease-in-out;
	&:hover {
		box-shadow: ${Shadow.Neutral[500]};
	}
	& > span {
		display: none;
	}

	${mediaQueries.laptopS} {
		& > span {
			display: block;
		}
		& > svg {
			display: none;
		}
	}
`;
