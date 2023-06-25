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
	P,
	IconRocketInSpace16,
	IconFast16,
	IconFlash16,
} from '@giveth/ui-design-system';
import Select, {
	components,
	OptionProps,
	DropdownIndicatorProps,
	StylesConfig,
	ControlProps,
} from 'react-select';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { useProjectsContext } from '@/context/projects.context';
import { Flex } from '@/components/styled-components/Flex';
import useDetectDevice from '@/hooks/useDetectDevice';

export interface ISelectedSort {
	icon: ReactElement;
	label: string;
	value: EProjectsSortBy;
}

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? <IconCaretUp /> : <IconCaretDown />;
};

const ProjectsSortSelect = () => {
	const { formatMessage } = useIntl();

	const sortByOptions = [
		{
			label: formatMessage({ id: 'label.givpower' }),
			value: EProjectsSortBy.INSTANT_BOOSTING,
			icon: <IconRocketInSpace16 color={brandColors.deep[900]} />,
		},
		{
			label: formatMessage({ id: 'label.rank' }),
			value: EProjectsSortBy.GIVPOWER,
			icon: <IconFlash16 color={brandColors.deep[900]} />,
		},
		{
			label: formatMessage({ id: 'label.newest' }),
			value: EProjectsSortBy.NEWEST,
			icon: <IconArrowTop size={16} color={brandColors.deep[900]} />,
		},
		{
			label: formatMessage({ id: 'label.oldest' }),
			value: EProjectsSortBy.OLDEST,
			icon: <IconArrowBottom size={16} color={brandColors.deep[900]} />,
		},
		{
			label: formatMessage({ id: 'label.most_liked' }),
			value: EProjectsSortBy.MOST_LIKED,
			icon: <IconHeartOutline16 color={brandColors.deep[900]} />,
		},
		{
			label: formatMessage({ id: 'label.most_funded' }),
			value: EProjectsSortBy.MOST_FUNDED,
			icon: <IconDonation16 color={brandColors.deep[900]} />,
		},
		{
			label: formatMessage({ id: 'label.recently_updated' }),
			value: EProjectsSortBy.RECENTLY_UPDATED,
			icon: <IconFast16 color={brandColors.deep[900]} />,
		},
	];

	const [value, setValue] = useState(sortByOptions[0]);
	const { variables, setVariables } = useProjectsContext();
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
		}
	}, [router.query.sort]);

	return (
		<Flex
			gap='8px'
			alignItems={isMobile ? 'stretch' : 'center'}
			flexDirection={isMobile ? 'column' : 'row'}
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
					setVariables({
						...variables,
						sortingBy: e.value,
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

	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					{Icon}
					<P>{label}</P>
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
	container: styles => ({
		...styles,
		zIndex: 3,
		border: 'none',
		borderRadius: '8px',
		minWidth: '220px',
		'&:hover': {
			borderColor: 'transparent',
		},
	}),
	control: styles => ({
		...styles,
		padding: '6px 8px',
		border: 'none',
		boxShadow: 'none',
	}),
	indicatorSeparator: styles => ({
		...styles,
		display: 'none',
	}),
};

const RowContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	> :first-child {
		flex-shrink: 0;
	}
	> :last-child {
		width: 100%;
		color: ${neutralColors.gray[900]};
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
