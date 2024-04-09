import {
	Flex,
	IconAdminNotif16,
	IconArrowBottom,
	IconArrowTop,
	IconDonation16,
} from '@giveth/ui-design-system';
import { type ReactElement } from 'react';
import { useIntl } from 'react-intl';
import Select from 'react-select';
import {
	Option,
	Control,
	SortingLabel,
	selectStyles,
	DropdownIndicator,
} from '../projects/sort/ProjectsSortSelect';
import { EQFRoundsSortBy } from '@/apollo/types/gqlEnums';

export interface IArchivedQFRoundsSort {
	icon: ReactElement;
	label: string;
	value: EQFRoundsSortBy;
	color?: string;
}

export const ArchivedQFRoundsSort = () => {
	const { formatMessage } = useIntl();

	let sortByOptions: IArchivedQFRoundsSort[] = [
		{
			label: formatMessage({ id: 'label.givpower' }),
			value: EQFRoundsSortBy.MATCHING_POOL,
			icon: <IconDonation16 />,
		},
		{
			label: formatMessage({ id: 'label.rank' }),
			value: EQFRoundsSortBy.UNIQUE_DONORS,
			icon: <IconAdminNotif16 />,
		},
		{
			label: formatMessage({ id: 'label.newest' }),
			value: EQFRoundsSortBy.NEWEST,
			icon: <IconArrowTop size={16} />,
		},
		{
			label: formatMessage({ id: 'label.oldest' }),
			value: EQFRoundsSortBy.OLDEST,
			icon: <IconArrowBottom size={16} />,
		},
	];

	return (
		<Flex gap='8px' $alignItems={'center'} $flexDirection={'row'}>
			<SortingLabel htmlFor='sorting'>
				{formatMessage({ id: 'label.sort_by' })}
			</SortingLabel>
			<Select
				components={{
					DropdownIndicator,
					Option: (props: any) => <Option {...props} />,
					Control: (props: any) => <Control {...props} />,
				}}
				onChange={(e: any) => {
					console.log('e', e);
				}}
				options={sortByOptions}
				styles={selectStyles}
				id='sorting'
				name='sorting'
				isClearable={false}
				isSearchable={false}
				isMulti={false}
			/>
		</Flex>
	);
};
