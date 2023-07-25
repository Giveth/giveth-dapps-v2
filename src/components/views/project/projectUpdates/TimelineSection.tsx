import { B, neutralColors, SublineBold } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';

interface IProps {
	date: string;
	launch?: boolean;
	newUpdate?: boolean;
}

const TimelineSection: FC<IProps> = props => {
	const { formatMessage } = useIntl();
	const date = new Date(props?.date);
	const year = date.getFullYear();
	const month = date.toLocaleString('default', { month: 'short' });
	const day = date.getDate();
	return (
		<TimelineStyled>
			{props.newUpdate ? (
				<>
					<NewUpdate>
						<SublineBold>
							{formatMessage({ id: 'label.new_update' })}
						</SublineBold>
					</NewUpdate>
					<VerticalBorder />
				</>
			) : (
				<>
					<DayAndYear>{day}</DayAndYear>
					<Month>{month}</Month>
					<DayAndYear>{year}</DayAndYear>
					{!props.launch && <VerticalBorder />}
				</>
			)}
		</TimelineStyled>
	);
};

const NewUpdate = styled.div`
	text-align: center;
	color: ${neutralColors.gray[600]};
`;

const VerticalBorder = styled.div`
	height: 100%;
	border-right: 1px solid ${neutralColors.gray[300]};
	margin-top: 24px;
`;

const Month = styled(B)`
	color: ${neutralColors.gray[800]};
	text-transform: uppercase;
`;

const DayAndYear = styled(SublineBold)`
	color: ${neutralColors.gray[600]};
`;

const TimelineStyled = styled.div`
	width: 50px;
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
`;

export default TimelineSection;
