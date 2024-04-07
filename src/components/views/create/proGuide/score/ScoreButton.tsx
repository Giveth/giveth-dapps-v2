import { Button } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { ScoreState, infoMap } from './scoreHelpers';

interface IScoreButtonProps {
	fieldsScores: ScoreState;
}

export const ScoreButton: FC<IScoreButtonProps> = ({ fieldsScores }) => {
	const { formatMessage } = useIntl();

	return (
		<StyledButton
			label={formatMessage({ id: infoMap[fieldsScores.quality].title })}
			buttonType='texty-primary'
		/>
	);
};

const StyledButton = styled(Button)`
	box-shadow: ${Shadow.Neutral[400]};
	transition: box-shadow 0.2s ease-in-out;
	&:hover {
		box-shadow: ${Shadow.Neutral[500]};
	}
`;
