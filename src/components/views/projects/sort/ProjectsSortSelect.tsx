import React, { ComponentType, ReactElement, useEffect, useState } from 'react';
import {
	IconCaretUp,
	IconCaretDown,
	brandColors,
	IconArrowTop,
	IconArrowBottom,
	IconDonation16,
	neutralColors,
	IconRocketInSpace16,
	IconIncrease16,
	semanticColors,
	Caption,
	Flex,
	IconPublish16,
	IconEstimated16,
	IconGIVBack16,
	IconSpark16,
} from '@giveth/ui-design-system';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { useProjectsContext } from '@/context/projects.context';
import useDetectDevice from '@/hooks/useDetectDevice';
import { capitalizeFirstLetter } from '@/lib/helpers';
import type {
	OptionProps,
	DropdownIndicatorProps,
	StylesConfig,
	ControlProps,
	CSSObjectWithLabel,
} from 'react-select';

export interface ISelectedSort {
	icon: ReactElement;
	label: string;
	value: EProjectsSortBy;
	color?: string;
}

export const DropdownIndicator: ComponentType<
	DropdownIndicatorProps
> = props => {
	const { isQF } = useProjectsContext();
	if (isQF) {
		return <IconDropdown />;
	}

	return props.selectProps.menuIsOpen ? <IconCaretUp /> : <IconCaretDown />;
};

const ProjectsSortSelect = () => {
	const { formatMessage } = useIntl();
	const { isQF, isCauses } = useProjectsContext();
	const router = useRouter();

	// Default sortByOptions without Best Match
	const initialSortByOptions: ISelectedSort[] = [
		{
			label: formatMessage({ id: 'label.givpower' }),
			value: EProjectsSortBy.INSTANT_BOOSTING,
			icon: <IconRocketInSpace16 />,
		},
		{
			label: formatMessage({ id: 'label.rank' }),
			value: EProjectsSortBy.GIVPOWER,
			icon: <IconGIVBack16 color={neutralColors.gray[900]} />,
		},
		{
			label: formatMessage({ id: 'label.newest' }),
			value: EProjectsSortBy.NEWEST,
			icon: <IconArrowTop size={16} />,
		},
		{
			label: formatMessage({ id: 'label.oldest' }),
			value: EProjectsSortBy.OLDEST,
			icon: <IconArrowBottom size={16} />,
		},
		{
			label: capitalizeFirstLetter(
				formatMessage({ id: 'label.amount_raised_all_time' }),
			),
			value: EProjectsSortBy.MOST_FUNDED,
			icon: <IconDonation16 />,
		},
	];

	if (!isCauses) {
		initialSortByOptions.push({
			label: capitalizeFirstLetter(
				formatMessage({ id: 'label.recently_updated' }),
			),
			value: EProjectsSortBy.RECENTLY_UPDATED,
			icon: <IconPublish16 />,
		});
	} else {
		initialSortByOptions.push({
			label: capitalizeFirstLetter(
				formatMessage({ id: 'label.cause.most_number_of_projects' }),
			),
			value: EProjectsSortBy.MOST_NUMBER_OF_PROJECTS,
			icon: <IconArrowTop size={16} />,
		});
		initialSortByOptions.push({
			label: capitalizeFirstLetter(
				formatMessage({ id: 'label.cause.least_number_of_projects' }),
			),
			value: EProjectsSortBy.LEAST_NUMBER_OF_PROJECTS,
			icon: <IconArrowBottom size={16} />,
		});
	}

	const [sortByOptions, setSortByOptions] =
		useState<ISelectedSort[]>(initialSortByOptions);
	const [value, setValue] = useState(sortByOptions[0]);
	const { isMobile } = useDetectDevice();

	const selectStyles: StylesConfig = {
		...selectCustomStyles,
		container: baseStyles =>
			({
				...baseStyles,
				zIndex: 3,
				border: 'none',
				borderRadius: '8px',
				minWidth: '230px',

				'&:hover': {
					borderColor: 'transparent',
				},
			}) as CSSObjectWithLabel,
		control: baseStyles =>
			({
				...baseStyles,
				padding: '6px 8px',
				border: 'none',
				boxShadow: 'none',
				cursor: 'pointer',
			}) as CSSObjectWithLabel,
		indicatorSeparator: baseStyles =>
			({
				...baseStyles,
				display: 'none',
			}) as CSSObjectWithLabel,
		singleValue: baseStyles =>
			({
				...baseStyles,
				fontWeight: isQF ? 500 : 400,
				fontSize: isQF ? '16px' : '14px',
			}) as CSSObjectWithLabel,
	};

	// Update sortByOptions based on the existence of searchTerm
	useEffect(() => {
		const hasSearchTerm = !!router.query.searchTerm;

		let updatedOptions = [...initialSortByOptions];

		// Conditionally add the "Best Match" option if searchTerm exists
		if (hasSearchTerm) {
			const bestMatchOption = {
				label: capitalizeFirstLetter(
					formatMessage({ id: 'label.best_match' }),
				),
				value: EProjectsSortBy.BestMatch,
				icon: <IconSpark16 />,
			};
			// Check if the Best Match option already exists before adding
			const bestMatchExists = updatedOptions.some(
				option => option.value === EProjectsSortBy.BestMatch,
			);

			if (!bestMatchExists) {
				updatedOptions.push(bestMatchOption);
			}
		}

		// Add QF-specific options if isQF is true
		if (isQF) {
			updatedOptions.splice(
				updatedOptions.length - 1,
				0,
				{
					label: formatMessage({ id: 'label.amount_raised_in_qf' }),
					value: EProjectsSortBy.ActiveQfRoundRaisedFunds,
					icon: <IconIncrease16 />,
					color: semanticColors.jade[500],
				},
				{
					label: formatMessage({ id: 'label.estimated_matching' }),
					value: EProjectsSortBy.EstimatedMatching,
					icon: <IconEstimated16 />,
					color: semanticColors.jade[500],
				},
			);
		}

		setSortByOptions(updatedOptions);
	}, [router.query.searchTerm, isQF]);

	useEffect(() => {
		if (router.query.sort) {
			const _value = sortByOptions.find(
				option =>
					option.value.toLowerCase() ===
					(router.query.sort as string).toLowerCase(),
			);
			if (_value) setValue(_value);
		} else {
			setValue(sortByOptions[0]);
		}
	}, [router.query.sort, sortByOptions]);

	return (
		<Flex
			gap='8px'
			$alignItems={isMobile ? 'stretch' : 'center'}
			$flexDirection={isMobile ? 'column' : 'row'}
			style={{ marginLeft: isQF ? 'auto' : '0' }}
		>
			{!isQF && (
				<SortingLabel htmlFor='sorting'>
					{formatMessage({ id: 'label.sort_by' })}
				</SortingLabel>
			)}
			<Select
				components={{
					DropdownIndicator,
					Option: (props: any) => <Option {...props} />,
					Control: (props: any) => <Control {...props} />,
				}}
				onChange={(e: any) => {
					const updatedQuery = {
						...router.query,
						sort: e.value,
					};
					router.push({
						pathname: router.pathname,
						query: updatedQuery,
					});
					setValue(e);
				}}
				value={value}
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

export const Option: ComponentType<OptionProps<ISelectedSort>> = props => {
	const { data } = props;
	const { label } = data;
	const Icon = data.icon;
	const color = data.color || brandColors.deep[900];

	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer $textColor={color}>
					{Icon}
					<Caption>{label}</Caption>
				</RowContainer>
			</OptionContainer>
		</components.Option>
	);
};

export const Control: ComponentType<ControlProps<ISelectedSort>> = ({
	children,
	...props
}) => {
	return (
		<components.Control {...props}>
			{props.selectProps.value ? (
				<>
					{(props.selectProps.value as ISelectedSort).icon}
					{children}
				</>
			) : (
				children
			)}
		</components.Control>
	);
};

interface IRowContainer {
	$textColor: string;
}

const RowContainer = styled.div<IRowContainer>`
	display: flex;
	align-items: center;
	gap: 8px;
	color: ${props => props.$textColor};
	> :first-child {
		flex-shrink: 0;
	}
	> :last-child {
		width: 100%;
	}
`;

const OptionContainer = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const IconDropdown = styled.div`
	width: 16px;
	height: 16px;
	background-image: url('/images/icons/dropdown.svg');
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
`;

export const SortingLabel = styled.label`
	color: ${neutralColors.gray[600]};
`;

export default ProjectsSortSelect;
