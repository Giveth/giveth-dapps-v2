import {
	IconEdit16,
	IconEye16,
	IconUpdate16,
	IconWalletOutline16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Dropdown, IOption } from '@/components/Dropdown';
import { capitalizeAllWords } from '@/lib/helpers';
import { ModifyStreamModal } from './ModifyStreamModal/ModifyStreamModal';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { EndStreamModal } from './EndStreamModal';

interface IStreamActionButtonProps {
	donation: IWalletRecurringDonation;
	refetch: () => void;
}

export const StreamActionButton: FC<IStreamActionButtonProps> = ({
	donation,
	refetch,
}) => {
	const [showModify, setShowModify] = useState(false);
	const [showEnd, setShowEnd] = useState(false);

	const { formatMessage } = useIntl();

	const options: IOption[] = donation.finished
		? [
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
			]
		: [
				{
					label: formatMessage({ id: 'label.modify_flow_rate' }),
					icon: <IconEye16 />,
					cb: () => setShowModify(true),
				},
				{
					label: formatMessage({
						id: 'label.end_recurring_donation',
					}),
					icon: <IconUpdate16 />,
					cb: () => setShowEnd(true),
				},
			];

	const dropdownStyle = {
		padding: '4px 16px',
		borderRadius: '8px',
	};

	return (
		<Actions>
			<Dropdown
				style={dropdownStyle}
				label=''
				options={options}
				stickToRight
			/>
			{showModify && (
				<ModifyStreamModal
					setShowModal={setShowModify}
					donation={donation}
					refetch={refetch}
				/>
			)}
			{showEnd && (
				<EndStreamModal
					setShowModal={setShowEnd}
					donation={donation}
					refetch={refetch}
				/>
			)}
		</Actions>
	);
};

const Actions = styled.div`
	cursor: pointer;
	border-radius: 8px;
	padding: 8px 10px;
	:hover {
		background-color: white;
	}
`;
