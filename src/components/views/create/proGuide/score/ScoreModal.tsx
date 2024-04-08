import {
	Button,
	Flex,
	IconHelpOutline32,
	P,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { type FC } from 'react';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { ImprovementTips } from './ImprovementTips';
import { ScoreBox } from './ScoreBox';
import { ScoreState, infoMap } from './scoreHelpers';

export interface IScoreModalProps extends IModal {
	fieldsScores: ScoreState;
}

export const ScoreModal: FC<IScoreModalProps> = ({ ...props }) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: infoMap[props.fieldsScores.quality].title,
			})}
			headerTitlePosition='left'
			headerIcon={<IconHelpOutline32 />}
		>
			<ScoreInnerModal {...props} />
		</Modal>
	);
};

interface IScoreInnerModalProps extends IScoreModalProps {}

const ScoreInnerModal: FC<IScoreInnerModalProps> = ({
	fieldsScores,
	setShowModal,
}) => {
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<P>
				{formatMessage({ id: infoMap[fieldsScores.quality].mainTip })}
			</P>
			<ScoreBoxWrapper>
				<ScoreBox
					score={fieldsScores.totalScore}
					color={infoMap[fieldsScores.quality].scoreColor}
				/>
			</ScoreBoxWrapper>
			{fieldsScores.totalScore < 100 && (
				<ImprovementTips fieldsScores={fieldsScores} />
			)}
			<ActionButton
				label={formatMessage({ id: 'label.got_it' })}
				onClick={() => {
					setShowModal(false);
				}}
				buttonType='texty-primary'
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	text-align: left;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 24px;
	${mediaQueries.tablet} {
		width: 530px;
	}
`;

const ScoreBoxWrapper = styled.div`
	padding: 0 40px;
`;

const ActionButton = styled(Button)`
	margin-top: 40px;
	width: 100%;
`;
