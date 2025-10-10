'use client';

import Select, { components } from 'react-select';
import styled from 'styled-components';
import {
	B,
	P,
	SublineBold,
	IconCaretDown,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useProjectContext } from '@/context/project.context';
import { IQFRound } from '@/apollo/types/types';
import type { ProjectDonationSwiperState } from './ProjectDonations.index';
import type { StylesConfig, GroupBase } from 'react-select';

type Props = {
	qfRounds: IQFRound[];
	projectDonationSwiperState: ProjectDonationSwiperState;
	setProjectDonationSwiperState: React.Dispatch<
		React.SetStateAction<ProjectDonationSwiperState>
	>;
};

type OptionType =
	| { type: 'all'; label: string; value: 'all' }
	| { type: 'recurring'; label: string; value: 'recurring' }
	| { type: 'round'; label: string; value: string; round: IQFRound };

export default function ProjectDonationsDropdown({
	qfRounds,
	projectDonationSwiperState,
	setProjectDonationSwiperState,
}: Props) {
	const { formatMessage } = useIntl();
	const { isCause } = useProjectContext();

	const sortedRounds: IQFRound[] = useMemo(() => {
		const list = qfRounds ?? [];
		return [...list].sort((a, b) => {
			const act = Number(b.isActive) - Number(a.isActive);
			if (act !== 0) return act;
			return new Date(b.beginDate) > new Date(a.beginDate) ? 1 : -1;
		});
	}, [qfRounds]);

	const options: OptionType[] = useMemo(() => {
		const base: OptionType[] = [
			{
				type: 'all',
				label: formatMessage({ id: 'label.all_donations' }),
				value: 'all',
			},
		];
		if (!isCause)
			base.push({
				type: 'recurring',
				label: formatMessage({ id: 'label.recurring_donations' }),
				value: 'recurring',
			});
		const rounds = sortedRounds.map<OptionType>(r => ({
			type: 'round',
			label: r.name,
			value: r.id,
			round: r,
		}));
		return [...base, ...rounds];
	}, [sortedRounds, isCause, formatMessage]);

	// current value from swiper state
	const currentValue: OptionType = projectDonationSwiperState.selectedQF
		? {
				type: 'round',
				label: projectDonationSwiperState.selectedQF.name,
				value: projectDonationSwiperState.selectedQF.id,
				round: projectDonationSwiperState.selectedQF,
			}
		: projectDonationSwiperState.isRecurringSelected && !isCause
			? {
					type: 'recurring',
					label: 'Recurring Donations',
					value: 'recurring',
				}
			: {
					type: 'all',
					label: formatMessage({
						id: 'label.qf.showing_all_donations',
					}),
					value: 'all',
				};

	const onChange = (opt: OptionType | null) => {
		console.log('opt', opt);
		if (!opt) return;
		if (opt.type === 'all') {
			setProjectDonationSwiperState(prev => ({
				...prev,
				isRecurringSelected: false,
				selectedQF: null,
			}));
		} else if (opt.type === 'recurring') {
			setProjectDonationSwiperState(prev => ({
				...prev,
				isRecurringSelected: true,
				selectedQF: null,
			}));
		} else {
			setProjectDonationSwiperState(prev => ({
				...prev,
				isRecurringSelected: false,
				selectedQF: opt.round,
			}));
		}
	};

	return (
		<Select<OptionType, false, GroupBase<OptionType>>
			value={currentValue}
			options={options}
			onChange={onChange}
			isClearable={false}
			isSearchable={false}
			components={{
				DropdownIndicator: props => (
					<components.DropdownIndicator {...props}>
						<IconCaretDown />
					</components.DropdownIndicator>
				),
				Option: QfOption as any,
				Control: QfControl as any,
				IndicatorSeparator: () => null,
			}}
			styles={styles}
			menuPlacement='auto'
			menuShouldScrollIntoView
		/>
	);
}

const QfOption = (props: any) => {
	const data = props.data as OptionType;
	const { formatMessage } = useIntl();

	// First item (currently selected) often looks like a subtle header in your mock;
	// if you want that, you could style when data.type==='all' and props.isSelected.
	return (
		<components.Option {...props}>
			<Row>
				{props.isSelected ? <B>{data.label}</B> : <P>{data.label}</P>}
				{data.type === 'round' && data.round.isActive && (
					<OpenLabel>
						{formatMessage({ id: 'label.qf.open' })}
					</OpenLabel>
				)}
			</Row>
		</components.Option>
	);
};

const QfControl = (props: any) => {
	return <components.Control {...props}>{props.children}</components.Control>;
};

const styles: StylesConfig<OptionType, false> = {
	container: base => ({
		...base,
		minWidth: 260,
		maxWidth: 320,
		marginBottom: 34,
		zIndex: 3,
		borderRadius: 8,
	}),
	control: base => ({
		...base,
		padding: '12px 10px',
		border: 'none',
		boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
		borderRadius: 10,
		background: neutralColors.gray[100],
		cursor: 'pointer',
	}),
	valueContainer: b => ({
		...b,
		padding: '0 8px',
		fontWeight: 500,
		fontSize: 16,
	}),
	menu: base => ({
		...base,
		borderRadius: 8,
		overflow: 'hidden',
		boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
		background: neutralColors.gray[100],
	}),
	option: (base, state) => ({
		...base,
		color: neutralColors.gray[900],
		padding: 0,
		background: state.isFocused ? neutralColors.gray[200] : 'transparent',
		cursor: 'pointer',
	}),
	menuList: base => ({ ...base, padding: 8 }),
	dropdownIndicator: base => ({ ...base, padding: 4 }),
};

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 12px;
	padding: 10px 12px;
	border-radius: 8px;
`;

const OpenLabel = styled(SublineBold)`
	padding: 2px 8px;
	background: ${semanticColors.jade[500]};
	color: ${neutralColors.gray[100]};
	border-radius: 999px;
`;
