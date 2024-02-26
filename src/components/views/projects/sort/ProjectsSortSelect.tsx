import React, { ComponentType, ReactElement, useEffect, useState } from 'react';
import {
	IconCaretUp,
	IconCaretDown,
	brandColors,
	IconArrowTop,
	IconArrowBottom,
	IconHeartOutline16,
	IconDonation16,
	neutralColors,
	IconFast16,
	IconFlash16,
	IconRocketInSpace16,
	IconIncrease16,
	semanticColors,
	Caption,
	Flex,
} from '@giveth/ui-design-system';
import Select, {
	components,
	OptionProps,
	DropdownIndicatorProps,
	StylesConfig,
	ControlProps,
	type CSSObjectWithLabel,
} from 'react-select';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { useProjectsContext } from '@/context/projects.context';
import useDetectDevice from '@/hooks/useDetectDevice';

export interface ISelectedSort {
	icon: ReactElement;
	label: string;
	value: EProjectsSortBy;
	color?: string;
}

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? <IconCaretUp /> : <IconCaretDown />;
};

const ProjectsSortSelect = () => {
	const { formatMessage } = useIntl();
	const { isQF } = useProjectsContext();

	let sortByOptions: ISelectedSort[] = [
		{
			label: formatMessage({ id: 'label.givpower' }),
			value: EProjectsSortBy.INSTANT_BOOSTING,
			icon: <IconRocketInSpace16 />,
		},
		{
			label: formatMessage({ id: 'label.rank' }),
			value: EProjectsSortBy.GIVPOWER,
			icon: <IconFlash16 />,
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
			label: formatMessage({ id: 'label.likes' }),
			value: EProjectsSortBy.MOST_LIKED,
			icon: <IconHeartOutline16 />,
		},
		{
			label: formatMessage({ id: 'label.amount_raised_all_time' }),
			value: EProjectsSortBy.MOST_FUNDED,
			icon: <IconDonation16 />,
		},
		{
			label: formatMessage({ id: 'label.recently_updated' }),
			value: EProjectsSortBy.RECENTLY_UPDATED,
			icon: <IconFast16 />,
		},
	];

	isQF &&
		sortByOptions.splice(sortByOptions.length - 1, 0, {
			label: formatMessage({ id: 'label.amount_raised_in_qf' }),
			value: EProjectsSortBy.ActiveQfRoundRaisedFunds,
			icon: <IconIncrease16 />,
			color: semanticColors.jade[700],
		});

	const [value, setValue] = useState(sortByOptions[0]);
	const { isMobile } = useDetectDevice();
	const router = useRouter();

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
	}, [router.query.sort]);

	return (
		<Flex
			gap='8px'
			$alignItems={isMobile ? 'stretch' : 'center'}
			$flexDirection={isMobile ? 'column' : 'row'}
		>
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

const Option: ComponentType<OptionProps<ISelectedSort>> = props => {
	const { data } = props;
	const { label } = data;
	const Icon = data.icon;
	const color = data.color || brandColors.deep[900];

	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer textColor={color}>
					{Icon}
					<Caption>{label}</Caption>
				</RowContainer>
			</OptionContainer>
		</components.Option>
	);
};

const Control: ComponentType<ControlProps<ISelectedSort>> = ({
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

const selectStyles: StylesConfig = {
	...selectCustomStyles,
	container: (baseStyles, props) =>
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
	control: (baseStyles, props) =>
		({
			...baseStyles,
			padding: '6px 8px',
			border: 'none',
			boxShadow: 'none',
		}) as CSSObjectWithLabel,
	indicatorSeparator: (baseStyles, props) =>
		({
			...baseStyles,
			display: 'none',
		}) as CSSObjectWithLabel,
};

interface IRowContainer {
	textColor: string;
}

const RowContainer = styled.div<IRowContainer>`
	display: flex;
	align-items: center;
	gap: 8px;
	color: ${props => props.textColor};
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

const SortingLabel = styled.label`
	color: ${neutralColors.gray[600]};
`;

export default ProjectsSortSelect;
