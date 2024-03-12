import {
	GLink,
	IconEdit16,
	IconEye16,
	IconUpdate16,
	IconWalletOutline16,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { Dropdown, IOption } from '@/components/Dropdown';
import { capitalizeAllWords } from '@/lib/helpers';
import { isRecurringActive } from '@/configuration';

interface IStreamActionButtonProps {
	finished: boolean;
}

export const StreamActionButton: FC<IStreamActionButtonProps> = ({
	finished,
}) => {
	const isCancelled = status === EProjectStatus.CANCEL;

	const { formatMessage } = useIntl();

	const [isHover, setIsHover] = useState(false);

	const options: IOption[] = finished
		? [
				{
					label: formatMessage({ id: 'label.modify_flow_rate' }),
					icon: <IconEye16 />,
				},
				{
					label: formatMessage({
						id: 'label.end_recurring_donation',
					}),
					icon: <IconUpdate16 />,
				},
			]
		: [
				{
					label: formatMessage({ id: 'label.start_new_donation' }),
					icon: <IconEdit16 />,
				},
				{
					label: capitalizeAllWords(
						formatMessage({ id: 'label.archive_donation' }),
					),
					icon: <IconWalletOutline16 />,
				},
			];

	const dropdownStyle = {
		padding: '4px 16px',
		borderRadius: '8px',
		background: isHover ? 'white' : '',
	};

	return isRecurringActive ? (
		<Actions
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			$isOpen={isHover}
			$isCancelled={isCancelled}
		>
			{isCancelled ? (
				<CancelledWrapper>CANCELLED</CancelledWrapper>
			) : (
				<Dropdown
					style={dropdownStyle}
					label=''
					options={options}
					stickToRight
				/>
			)}
		</Actions>
	) : (
		<ActionsOld
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			$isOpen={isHover}
			$isCancelled={isCancelled}
			size='Big'
		>
			{isCancelled ? (
				<CancelledWrapper>CANCELLED</CancelledWrapper>
			) : (
				<Dropdown
					style={dropdownStyle}
					label='Actions'
					options={options}
					stickToRight
				/>
			)}
		</ActionsOld>
	);
};

const CancelledWrapper = styled.div`
	padding: 4px 16px;
`;

const Actions = styled.div<{ $isCancelled: boolean; $isOpen: boolean }>`
	cursor: ${props => (props.$isCancelled ? 'default' : 'pointer')};
	border-radius: 8px;
	padding: 8px 10px;
`;

const ActionsOld = styled(GLink)<{ $isCancelled: boolean; $isOpen: boolean }>`
	color: ${props =>
		props.$isCancelled ? neutralColors.gray[500] : neutralColors.gray[900]};
	cursor: ${props => (props.$isCancelled ? 'default' : 'pointer')};
`;
